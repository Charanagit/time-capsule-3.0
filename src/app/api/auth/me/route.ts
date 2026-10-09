import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { adminUser, demoUser, memoryStore } from '@/lib/store';

export async function GET() {
  const session = await getCurrentUser();

  if (!session) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  if (session.username === 'admin') {
    return NextResponse.json({
      authenticated: true,
      user: adminUser,
    });
  }

  if (session.username === 'demo') {
    return NextResponse.json({
      authenticated: true,
      user: demoUser,
    });
  }

  let user = {
    id: session.userId,
    username: session.username,
    name: session.username,
    email: '',
    avatar: '/profile-8.jpg',
    role: session.role || 'user',
    bio: 'Preserving memories in Time Capsule 3.0',
    isPrivate: false,
    twoFactorEnabled: false,
    quietMode: false,
  };

  const db = await getDatabase();
  if (db) {
    try {
      const dbUser = await db.collection('users').findOne({ username: session.username });
      if (dbUser) {
        user.name = dbUser.name || session.username;
        user.email = dbUser.email || '';
        user.avatar = dbUser.avatar || '/profile-8.jpg';
        user.bio = dbUser.bio || 'Preserving memories in Time Capsule 3.0';
        user.isPrivate = !!dbUser.isPrivate;
        user.twoFactorEnabled = !!dbUser.twoFactorEnabled;
        user.quietMode = !!dbUser.quietMode;
      }
    } catch (e) {
      console.warn('Error reading user from db:', e);
    }
  } else {
    const memUser = memoryStore.users.find((u) => u.username === session.username);
    if (memUser) {
      user = { ...user, ...memUser };
    }
  }

  return NextResponse.json({
    authenticated: true,
    user,
  });
}

export async function PUT(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, bio, isPrivate, twoFactorEnabled, quietMode, avatar } = body;

    const db = await getDatabase();
    if (db) {
      await db.collection('users').updateOne(
        { username: session.username },
        {
          $set: {
            name,
            bio,
            isPrivate,
            twoFactorEnabled,
            quietMode,
            avatar,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );
    } else {
      const memUser = memoryStore.users.find((u) => u.username === session.username);
      if (memUser) {
        if (name !== undefined) memUser.name = name;
        if (bio !== undefined) memUser.bio = bio;
        if (isPrivate !== undefined) memUser.isPrivate = isPrivate;
        if (twoFactorEnabled !== undefined) memUser.twoFactorEnabled = twoFactorEnabled;
        if (quietMode !== undefined) memUser.quietMode = quietMode;
        if (avatar !== undefined) memUser.avatar = avatar;
      }
    }

    return NextResponse.json({ success: true, message: 'Profile & Settings updated' });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
