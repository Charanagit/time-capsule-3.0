import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDatabase } from '@/lib/mongodb';
import { signToken } from '@/lib/auth';
import { memoryStore, demoUser } from '@/lib/store';

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

    const db = await getDatabase();
    if (db) {
      try {
        const user = await db.collection('users').findOne({ username });
        if (user && user.password) {
          const valid = await bcrypt.compare(password, user.password);
          if (valid) {
            authenticated = true;
            userId = user._id.toString();
          }
        }
      } catch (err) {
        console.warn('DB findOne failed, checking demo store:', err);
      }
    }

    // Demo account fallback if DB didn't match or failed
    if (!authenticated) {
      if (username === 'demo' && (password === 'demo123' || password === 'demo')) {
        authenticated = true;
        userId = demoUser.id;
      } else {
        const memUser = memoryStore.users.find((u) => u.username === username);
        if (memUser && memUser.passwordHash) {
          const valid = await bcrypt.compare(password, memUser.passwordHash);
          if (valid) {
            authenticated = true;
            userId = memUser.id;
          }
        }
      }
    }

    if (!authenticated) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const token = signToken({ userId, username });
    const response = NextResponse.json({
      success: true,
      user: { username, userId },
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
