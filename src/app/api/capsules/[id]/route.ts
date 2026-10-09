import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { memoryStore } from '@/lib/store';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    if (db) {
      try {
        await db.collection('scheduled_messages').deleteOne({ _id: new ObjectId(id) });
      } catch {
        await db.collection('scheduled_messages').deleteOne({ id });
      }
    } else {
      const idx = memoryStore.capsules.findIndex((c) => c.id === id);
      if (idx !== -1) {
        memoryStore.capsules.splice(idx, 1);
      }
    }

    return NextResponse.json({ success: true, message: 'Capsule deleted successfully' });
  } catch (error) {
    console.error('Delete capsule error:', error);
    return NextResponse.json(
      { error: 'Failed to delete capsule' },
      { status: 500 }
    );
  }
}
