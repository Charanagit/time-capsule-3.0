'use client';

import React from 'react';

const stories = [
  { id: 'my-story', name: 'Your Story', avatar: '/profile-8.jpg', bg: '/story-1.jpg', isUser: true },
  { id: 'story-1', name: 'Lilian James', avatar: '/profile-9.jpg', bg: '/story-2.jpg' },
  { id: 'story-2', name: 'Winnie Hale', avatar: '/profile-10.jpg', bg: '/story-3.jpg' },
  { id: 'story-3', name: 'Daniel Bale', avatar: '/profile-11.jpg', bg: '/story-4.jpg' },
  { id: 'story-4', name: 'Jane Doe', avatar: '/profile-12.jpg', bg: '/story-5.jpg' },
  { id: 'story-5', name: 'Tina White', avatar: '/profile-13.jpg', bg: '/story-6.jpg' },
];

export default function Stories() {
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.8rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        marginBottom: '1.2rem',
        scrollbarWidth: 'none',
      }}
    >
      {stories.map((story) => (
        <div
          key={story.id}
          style={{
            position: 'relative',
            minWidth: '105px',
            height: '160px',
            borderRadius: 'var(--card-border-radius)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '0.6rem',
            backgroundImage: `linear-gradient(transparent 40%, rgba(0,0,0,0.8)), url(${story.bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
          }}
        >
          <div
            className="profile-picture"
            style={{
              width: '2.2rem',
              height: '2.2rem',
              border: story.isUser ? '2px dashed var(--color-primary)' : '2px solid var(--color-primary)',
            }}
          >
            <img src={story.avatar} alt={story.name} />
          </div>
          <p
            style={{
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 600,
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {story.name}
          </p>
        </div>
      ))}
    </div>
  );
}
