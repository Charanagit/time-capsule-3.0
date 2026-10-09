import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { memoryStore, Post } from '@/lib/store';

export async function GET() {
  try {
    const db = await getDatabase();
    if (db) {
      const posts = await db
        .collection('posts')
        .find({})
        .sort({ created_at: -1, createdAt: -1 })
        .toArray();

      const formattedPosts: Post[] = posts.map((p) => ({
        id: p._id.toString(),
        username: p.username || 'Anonymous',
        title: p.title || '',
        content: p.content || '',
        visibility: p.visibility || 'public',
        image: p.image ? (p.image.startsWith('/') ? p.image : `/uploads/${p.image}`) : undefined,
        createdAt: (p.created_at || p.createdAt || new Date()).toISOString(),
        likes: p.likes || Math.floor(Math.random() * 50) + 5,
        comments: p.comments || Math.floor(Math.random() * 10),
      }));

      return NextResponse.json({ posts: formattedPosts.concat(memoryStore.posts) });
    }

    return NextResponse.json({ posts: memoryStore.posts });
  } catch (error) {
    console.error('Fetch posts error:', error);
    return NextResponse.json({ posts: memoryStore.posts });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    const username = session?.username || 'demo';

    const body = await req.json();
    const { title, content, visibility = 'public', image } = body;

    if (!content && !title && !image) {
      return NextResponse.json(
        { error: 'Post content or image is required' },
        { status: 400 }
      );
    }

    const newPost: Post = {
      id: `post-${Date.now()}`,
      username,
      title: title || '',
      content: content || '',
      visibility,
      image: image || undefined,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
    };

    const db = await getDatabase();
    if (db) {
      await db.collection('posts').insertOne({
        username,
        title: newPost.title,
        content: newPost.content,
        visibility: newPost.visibility,
        image: newPost.image,
        created_at: new Date(),
        likes: 0,
        comments: 0,
      });
    } else {
      memoryStore.posts.unshift(newPost);
    }

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
