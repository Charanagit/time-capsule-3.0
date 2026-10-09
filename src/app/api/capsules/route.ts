import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { memoryStore, Capsule } from '@/lib/store';

export async function GET() {
  try {
    const session = await getCurrentUser();
    const username = session?.username || 'demo';

    const now = new Date();

    const db = await getDatabase();
    if (db) {
      const docs = await db
        .collection('scheduled_messages')
        .find({ username })
        .sort({ schedule_date: 1 })
        .toArray();

      const capsules: Capsule[] = docs.map((d) => {
        const scheduleDate = (d.schedule_date || d.scheduleDate || now).toISOString();
        const isUnlocked = new Date(scheduleDate) <= now;
        return {
          id: d._id.toString(),
          username: d.username || username,
          caption: d.caption || '',
          message: d.message || d.messageText || '',
          scheduleDate,
          visibility: d.visibility || 'private',
          imageUrl: d.imageUrl || d.image || undefined,
          createdAt: (d.created_at || d.createdAt || now).toISOString(),
          isUnlocked,
        };
      });

      return NextResponse.json({ capsules });
    }

    const memoryCapsules = memoryStore.capsules
      .filter((c) => c.username === username || username === 'demo')
      .map((c) => ({
        ...c,
        isUnlocked: new Date(c.scheduleDate) <= now,
      }));

    return NextResponse.json({ capsules: memoryCapsules });
  } catch (error) {
    console.error('Fetch capsules error:', error);
    return NextResponse.json({ capsules: memoryStore.capsules });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    const username = session?.username || 'demo';

    const body = await req.json();
    const { caption, message, scheduleType, customDate, visibility = 'private', imageUrl } = body;

    if (!caption || !message) {
      return NextResponse.json(
        { error: 'Caption and message are required' },
        { status: 400 }
      );
    }

    let scheduleDate: Date;
    if (scheduleType === 'oneYear') {
      scheduleDate = new Date();
      scheduleDate.setFullYear(scheduleDate.getFullYear() + 1);
    } else if (customDate) {
      scheduleDate = new Date(customDate);
    } else {
      scheduleDate = new Date();
    }

    const newCapsule: Capsule = {
      id: `capsule-${Date.now()}`,
      username,
      caption,
      message,
      scheduleDate: scheduleDate.toISOString(),
      visibility,
      imageUrl: imageUrl || undefined,
      createdAt: new Date().toISOString(),
      isUnlocked: scheduleDate <= new Date(),
    };

    const db = await getDatabase();
    if (db) {
      await db.collection('scheduled_messages').insertOne({
        username,
        caption,
        message,
        schedule_date: scheduleDate,
        visibility,
        imageUrl: newCapsule.imageUrl,
        created_at: new Date(),
      });
    } else {
      memoryStore.capsules.unshift(newCapsule);
    }

    return NextResponse.json({ success: true, capsule: newCapsule });
  } catch (error) {
    console.error('Create capsule error:', error);
    return NextResponse.json(
      { error: 'Failed to schedule capsule' },
      { status: 500 }
    );
  }
}
