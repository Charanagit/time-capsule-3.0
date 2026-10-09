import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDatabase } from '@/lib/mongodb';
import { signToken } from '@/lib/auth';
import { memoryStore, adminUser, demoUser } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    let authenticated = false;
    let userId = '';
    let role: 'admin' | 'user' = 'user';
    let displayName = username;
    let avatar = '/profile-8.jpg';

    // 1. Check Hardcoded Admin User
    if (
      username.toLowerCase() === 'admin' &&
      (password === 'admin123' || password === 'admin' || password === 'Admin@123')
    ) {
      authenticated = true;
      userId = adminUser.id;
      role = 'admin';
      displayName = adminUser.name || 'System Administrator';
      avatar = adminUser.avatar || '/profile-1.jpg';
    }

    // 2. Check Hardcoded Demo User
    if (
      !authenticated &&
      username.toLowerCase() === 'demo' &&
      (password === 'demo123' || password === 'demo')
    ) {
      authenticated = true;
      userId = demoUser.id;
      role = 'user';
      displayName = demoUser.name || 'Charana Pramoad';
      avatar = demoUser.avatar || '/profile-8.jpg';
    }

    // 3. Check MongoDB Database
    if (!authenticated) {
      const db = await getDatabase();
      if (db) {
        try {
          const user = await db.collection('users').findOne({
            $or: [{ username: username }, { email: username }],
          });
          if (user && user.password) {
            const valid = await bcrypt.compare(password, user.password);
            if (valid) {
              authenticated = true;
              userId = user._id.toString();
              role = user.role === 'admin' ? 'admin' : 'user';
              displayName = user.name || user.username;
              avatar = user.avatar || '/profile-8.jpg';
            }
          }
        } catch (err) {
          console.warn('DB lookup error:', err);
        }
      }
    }

    // 4. Check Memory Store for newly registered users (offline/fallback mode)
    if (!authenticated) {
      const memUser = memoryStore.users.find(
        (u) => u.username.toLowerCase() === username.toLowerCase() || u.email?.toLowerCase() === username.toLowerCase()
      );
      if (memUser && memUser.passwordHash) {
        const valid = await bcrypt.compare(password, memUser.passwordHash);
        if (valid) {
          authenticated = true;
          userId = memUser.id;
          role = memUser.role === 'admin' ? 'admin' : 'user';
          displayName = memUser.name || memUser.username;
          avatar = memUser.avatar || '/profile-8.jpg';
        }
      }
    }

    if (!authenticated) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const token = signToken({ userId, username, role });
    const response = NextResponse.json({
      success: true,
      user: { username, userId, role, name: displayName, avatar },
      message: 'Login successful',
    });

    response.cookies.set('timecapsule_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
