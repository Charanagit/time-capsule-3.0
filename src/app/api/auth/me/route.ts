import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { demoUser, memoryStore } from '@/lib/store';

export async function GET() {
  const session = await getCurrentUser();

  if (!session) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  let user = {
    username: session.username,
    name: session.username === 'demo' ? 'Charana Pramoad' : session.username,
    avatar: '/profile-8.jpg',
  };

  const db = await getDatabase();
  if (db) {
    const dbUser = await db.collection('users').findOne({ username: session.username });
    if (dbUser) {
      user.name = dbUser.name || session.username;
      user.avatar = dbUser.avatar || '/profile-8.jpg';
    }
  } else {
    const memUser = memoryStore.users.find((u) => u.username === session.username);
    if (memUser) {
      user.name = memUser.name || session.username;
      user.avatar = memUser.avatar || '/profile-8.jpg';
    }
  }

  return NextResponse.json({
    authenticated: true,
    user,
  });
}
