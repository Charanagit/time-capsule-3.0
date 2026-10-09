'use client';

import React, { useState } from 'react';
import { Post } from '@/lib/store';

interface FeedCardProps {
  post: Post;
}

export default function FeedCard({ post }: FeedCardProps) {
  const [likes, setLikes] = useState(post.likes || 12);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentList, setCommentList] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');

  const toggleLike = () => {
    if (isLiked) {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentList([...commentList, newComment.trim()]);
    setNewComment('');
  };

  return (
    <div
      style={{
        background: 'var(--color-white)',
        borderRadius: 'var(--card-border-radius)',
        padding: '1.2rem',
        marginBottom: '1.2rem',
        fontSize: '0.85rem',
        lineHeight: '1.5',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}
    >
      {/* Post Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.8rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <div className="profile-picture">
            <img
              src="/profile-13.jpg"
              alt={post.username}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/profile-8.jpg';
              }}
            />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-dark)' }}>
              {post.username}
            </h3>
            <small style={{ color: 'var(--color-gray)', fontSize: '0.75rem' }}>
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </small>
          </div>
        </div>
        <span style={{ cursor: 'pointer', color: 'var(--color-gray)' }}>
          <i className="fa-solid fa-ellipsis"></i>
        </span>
      </div>

      {/* Post Title & Content */}
      {post.title && (
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
          {post.title}
        </h4>
      )}
      <p style={{ color: 'var(--color-dark)', marginBottom: '0.8rem' }}>{post.content}</p>

      {/* Post Image */}
      {post.image && (
        <div
          style={{
            borderRadius: 'var(--card-border-radius)',
            overflow: 'hidden',
            margin: '0.7rem 0',
            maxHeight: '450px',
            background: '#000',
          }}
        >
          <img
            src={post.image}
            alt="Post memory"
            style={{ width: '100%', maxHeight: '450px', objectFit: 'cover' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/feed-1.jpg';
            }}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '1.3rem',
          margin: '0.6rem 0',
        }}
      >
        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
          <span
            onClick={toggleLike}
            style={{
              cursor: 'pointer',
              color: isLiked ? 'var(--color-danger)' : 'var(--color-dark)',
              transition: 'transform 0.15s ease',
            }}
          >
            <i className={isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
          </span>
          <span
            onClick={() => setShowComments(!showComments)}
            style={{ cursor: 'pointer', color: 'var(--color-dark)' }}
          >
            <i className="fa-regular fa-comment-dots"></i>
          </span>
          <span style={{ cursor: 'pointer', color: 'var(--color-dark)' }}>
            <i className="fa-solid fa-share-nodes"></i>
          </span>
        </div>
        <div
          onClick={() => setIsBookmarked(!isBookmarked)}
          style={{
            cursor: 'pointer',
            color: isBookmarked ? 'var(--color-primary)' : 'var(--color-dark)',
          }}
        >
          <i className={isBookmarked ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'}></i>
        </div>
      </div>

      {/* Liked By Avatars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
        <div style={{ display: 'flex' }}>
          <span
            className="profile-picture"
            style={{ width: '1.4rem', height: '1.4rem', marginLeft: '-0.3rem', border: '2px solid white' }}
          >
            <img src="/profile-10.jpg" alt="Like avatar" />
          </span>
          <span
            className="profile-picture"
            style={{ width: '1.4rem', height: '1.4rem', marginLeft: '-0.4rem', border: '2px solid white' }}
          >
            <img src="/profile-4.jpg" alt="Like avatar" />
          </span>
          <span
            className="profile-picture"
            style={{ width: '1.4rem', height: '1.4rem', marginLeft: '-0.4rem', border: '2px solid white' }}
          >
            <img src="/profile-15.jpg" alt="Like avatar" />
          </span>
        </div>
        <p style={{ color: 'var(--color-gray)', fontSize: '0.8rem' }}>
          Liked by <b>Ernest</b> and <b>{likes} others</b>
        </p>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div
          style={{
            marginTop: '0.8rem',
            paddingTop: '0.8rem',
            borderTop: '1px solid var(--color-light)',
          }}
        >
          {commentList.map((c, idx) => (
            <div key={idx} style={{ marginBottom: '0.4rem', color: 'var(--color-dark)' }}>
              <b>You</b>: {c}
            </div>
          ))}
          <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              style={{
                width: '100%',
                background: 'var(--color-light)',
                borderRadius: 'var(--border-radius)',
                padding: '0.4rem 0.8rem',
                border: 'none',
                outline: 'none',
                fontSize: '0.8rem',
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.75rem' }}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
