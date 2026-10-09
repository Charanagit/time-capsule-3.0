'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please provide content for your memory post.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      let imageUrl: string | undefined = imagePreview || undefined;

      if (fileInputRef.current?.files?.[0]) {
        const formData = new FormData();
        formData.append('file', fileInputRef.current.files[0]);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        }
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          visibility,
          image: imageUrl,
        }),
      });

      if (res.ok) {
        router.push('/');
      } else {
        setError('Failed to publish post');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-light)', paddingBottom: '4rem' }}>
      <Navbar />

      <div style={{ maxWidth: '600px', margin: '2.5rem auto', padding: '0 1rem' }}>
        <div
          style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--card-border-radius)',
            padding: '2.2rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
            <span style={{ fontSize: '2.5rem' }}>📸</span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-dark)', marginTop: '0.3rem' }}>
              Create a Memory Post
            </h1>
            <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem' }}>
              Share a moment with your network or store it in your timeline.
            </p>
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#dc2626',
                padding: '0.8rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '1rem',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                Post Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your memory a title..."
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: 'var(--color-light)',
                  color: 'var(--color-dark)',
                  outline: 'none',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                Your Story / Content
              </label>
              <textarea
                rows={5}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What happened today? Write your thoughts..."
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: 'var(--color-light)',
                  color: 'var(--color-dark)',
                  outline: 'none',
                  fontSize: '0.9rem',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Photo upload */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                Attach Picture:
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--color-primary)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  background: 'var(--color-light)',
                  cursor: 'pointer',
                }}
              >
                {imagePreview ? (
                  <div>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxHeight: '200px', margin: '0 auto', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-gray)', marginTop: '0.5rem' }}>
                      Click to choose a different photo
                    </p>
                  </div>
                ) : (
                  <div>
                    <i className="fa-regular fa-image" style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}></i>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-dark)', fontWeight: 500 }}>
                      Click to upload photo
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {/* Visibility */}
            <div style={{ background: 'var(--color-light)', padding: '1.2rem', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-dark)', marginBottom: '0.8rem' }}>
                Visibility
              </h3>
              <div style={{ display: 'flex', gap: '1.2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--color-dark)', fontSize: '0.9rem' }}>
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={visibility === 'public'}
                    onChange={() => setVisibility('public')}
                  />
                  <span>Public</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--color-dark)', fontSize: '0.9rem' }}>
                  <input
                    type="radio"
                    name="visibility"
                    value="friends"
                    checked={visibility === 'friends'}
                    onChange={() => setVisibility('friends')}
                  />
                  <span>Friends</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--color-dark)', fontSize: '0.9rem' }}>
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={visibility === 'private'}
                    onChange={() => setVisibility('private')}
                  />
                  <span>Private</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 'var(--border-radius)',
              }}
            >
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
