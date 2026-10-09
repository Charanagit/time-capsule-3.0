'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import FeedCard from '@/components/FeedCard';
import { Post } from '@/lib/store';

export default function ViewPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then((r) => r.json())
      .then((d) => {
        if (d.posts) setPosts(d.posts);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-light)', paddingBottom: '4rem' }}>
      <Navbar />

      <div style={{ maxWidth: '650px', margin: '2.5rem auto', padding: '0 1rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-dark)' }}>
            Your Memory Timeline
          </h1>
          <Link href="/create-post" className="btn btn-primary">
            <i className="fa-solid fa-plus"></i> New Post
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-gray)' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.8rem', marginBottom: '0.8rem' }}></i>
            <p>Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div
            style={{
              background: 'var(--color-white)',
              padding: '3rem',
              borderRadius: 'var(--card-border-radius)',
              textAlign: 'center',
            }}
          >
            <p style={{ color: 'var(--color-gray)', marginBottom: '1rem' }}>No posts created yet.</p>
            <Link href="/create-post" className="btn btn-primary">
              Create Your First Post
            </Link>
          </div>
        ) : (
          posts.map((post) => <FeedCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
