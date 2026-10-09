'use client';

import React, { useState, useRef } from 'react';

interface CreatePostBoxProps {
  user?: {
    username: string;
    avatar?: string;
  } | null;
  onPostCreated?: () => void;
}

export default function CreatePostBox({ user, onPostCreated }: CreatePostBoxProps) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFullForm, setShowFullForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setShowFullForm(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imagePreview) return;

    setLoading(true);
    try {
      let uploadedImageUrl: string | undefined = imagePreview || undefined;

      // If file input has a file, upload it
      if (fileInputRef.current?.files?.[0]) {
        const formData = new FormData();
        formData.append('file', fileInputRef.current.files[0]);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedImageUrl = uploadData.url;
        }
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || 'Memory',
          content,
          image: uploadedImageUrl,
          visibility: 'public',
        }),
      });

      if (res.ok) {
        setContent('');
        setTitle('');
        setImagePreview(null);
        setShowFullForm(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onPostCreated?.();
      }
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: 'var(--color-white)',
        borderRadius: 'var(--card-border-radius)',
        padding: '1.2rem',
        marginBottom: '1.2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <div className="profile-picture" style={{ width: '2.5rem', height: '2.5rem' }}>
            <img src={user?.avatar || '/profile-8.jpg'} alt="Avatar" />
          </div>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setShowFullForm(true)}
            placeholder={`What's on your mind, ${user?.username || 'Charana'}?`}
            style={{
              width: '100%',
              background: 'var(--color-light)',
              borderRadius: 'var(--border-radius)',
              padding: '0.7rem 1.2rem',
              border: 'none',
              outline: 'none',
              color: 'var(--color-dark)',
              fontSize: '0.9rem',
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: 'var(--color-light)',
              border: 'none',
              borderRadius: '50%',
              width: '2.5rem',
              height: '2.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)',
              fontSize: '1.1rem',
              flexShrink: 0,
            }}
            title="Attach Photo"
          >
            <i className="fa-regular fa-image"></i>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </div>

        {showFullForm && (
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post Title / Memory Caption (Optional)"
              style={{
                width: '100%',
                background: 'var(--color-light)',
                borderRadius: '8px',
                padding: '0.6rem 1rem',
                border: 'none',
                outline: 'none',
                color: 'var(--color-dark)',
                fontSize: '0.85rem',
              }}
            />

            {imagePreview && (
              <div
                style={{
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  maxHeight: '220px',
                  border: '1px solid var(--color-light)',
                }}
              >
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  style={{ width: '100%', maxHeight: '220px', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    cursor: 'pointer',
                  }}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={() => {
                  setShowFullForm(false);
                  setImagePreview(null);
                }}
                className="btn"
                style={{ background: 'var(--color-light)', color: 'var(--color-gray)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || (!content.trim() && !imagePreview)}
                className="btn btn-primary"
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Posting...' : 'Share Memory'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
