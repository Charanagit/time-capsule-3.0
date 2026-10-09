'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Stories from '@/components/Stories';
import CreatePostBox from '@/components/CreatePostBox';
import FeedCard from '@/components/FeedCard';
import RightPanel from '@/components/RightPanel';
import ThemeCustomizer from '@/components/ThemeCustomizer';
import { Post } from '@/lib/store';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; name?: string; avatar?: string } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [themeModalOpen, setThemeModalOpen] = useState(false);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        // Automatically default to demo mode if no auth session
        setUser({ username: 'demo', name: 'Charana Pramoad', avatar: '/profile-8.jpg' });
      }
    } catch {
      setUser({ username: 'demo', name: 'Charana Pramoad', avatar: '/profile-8.jpg' });
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (e) {
      console.error('Failed to load posts:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchPosts();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-light)', paddingBottom: '3rem' }}>
      {/* Navbar */}
      <Navbar user={user} onOpenThemeModal={() => setThemeModalOpen(true)} />

      {/* Main 3-Column Layout */}
      <main style={{ marginTop: '2rem' }}>
        <div
          className="app-container"
          style={{
            display: 'grid',
            gridTemplateColumns: '20vw auto 22vw',
            gap: '2rem',
            position: 'relative',
          }}
        >
          {/* Left Column: Sidebar */}
          <div className="left-sidebar">
            <Sidebar
              user={user}
              onOpenThemeModal={() => setThemeModalOpen(true)}
            />
          </div>

          {/* Center Column: Stories + Create Post + Feeds */}
          <div className="center-feed">
            <Stories />
            <CreatePostBox user={user} onPostCreated={fetchPosts} />

            {/* Posts List */}
            {loading ? (
              <div
                style={{
                  background: 'var(--color-white)',
                  padding: '2rem',
                  borderRadius: 'var(--card-border-radius)',
                  textAlign: 'center',
                  color: 'var(--color-gray)',
                }}
              >
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                <p>Loading memories...</p>
              </div>
            ) : posts.length === 0 ? (
              <div
                style={{
                  background: 'var(--color-white)',
                  padding: '3rem 2rem',
                  borderRadius: 'var(--card-border-radius)',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '2.5rem' }}>⏳</span>
                <h3 style={{ color: 'var(--color-dark)', marginTop: '0.5rem' }}>No memories shared yet</h3>
                <p style={{ color: 'var(--color-gray)', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
                  Be the first to share a moment or schedule a time capsule!
                </p>
              </div>
            ) : (
              posts.map((post) => <FeedCard key={post.id} post={post} />)
            )}
          </div>

          {/* Right Column: Messages & Friend Requests */}
          <div className="right-sidebar">
            <RightPanel />
          </div>
        </div>
      </main>

      {/* Theme Customizer Modal */}
      <ThemeCustomizer isOpen={themeModalOpen} onClose={() => setThemeModalOpen(false)} />
    </div>
  );
}
