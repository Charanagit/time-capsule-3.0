import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDatabase } from '@/lib/mongodb';
import { memoryStore } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const { username, email, password, confirmPassword } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const db = await getDatabase();
    if (db) {
      const existing = await db.collection('users').findOne({ username });
      if (existing) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 409 }
        );
      }

      await db.collection('users').insertOne({
        username,
        email: email || '',
        password: hashedPassword,
        createdAt: new Date(),
      });
    } else {
      // Memory store fallback
      if (memoryStore.users.some((u) => u.username === username)) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 409 }
        );
      }
      memoryStore.users.push({
        id: `user-${Date.now()}`,
        username,
        email: email || '',
        passwordHash: hashedPassword,
        name: username,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Signup successful! Please log in.',
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during registration' },
      { status: 500 }
    );
  }
}
