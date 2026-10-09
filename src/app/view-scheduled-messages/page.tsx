'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import CountdownTimer from '@/components/CountdownTimer';
import { Capsule } from '@/lib/store';

export default function ViewScheduledMessagesPage() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'locked' | 'unlocked'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCapsules = async () => {
    try {
      const res = await fetch('/api/capsules');
      const data = await res.json();
      if (data.capsules) {
        setCapsules(data.capsules);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCapsules();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this time capsule?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/capsules/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCapsules((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error('Delete failed:', e);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCapsules = capsules.filter((c) => {
    if (filter === 'locked') return !c.isUnlocked;
    if (filter === 'unlocked') return c.isUnlocked;
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-light)', paddingBottom: '4rem' }}>
      <Navbar />

      <div className="app-container" style={{ marginTop: '2.5rem' }}>
        {/* Header Banner */}
        <div
          style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--card-border-radius)',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-dark)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span>📦</span> Your Time Capsule Vault
            </h1>
            <p style={{ color: 'var(--color-gray)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
              Track sealed memories, countdown timers, and unlocked revelations.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* Filter buttons */}
            <div style={{ display: 'flex', background: 'var(--color-light)', padding: '4px', borderRadius: '30px' }}>
              {(['all', 'locked', 'unlocked'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilter(mode)}
                  style={{
                    background: filter === mode ? 'var(--color-primary)' : 'transparent',
                    color: filter === mode ? '#fff' : 'var(--color-dark)',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>

            <Link href="/schedule" className="btn btn-primary">
              <i className="fa-solid fa-plus"></i> New Capsule
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-gray)' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
            <p>Loading your capsule vault...</p>
          </div>
        ) : filteredCapsules.length === 0 ? (
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--card-border-radius)',
              padding: '4rem 2rem',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            }}
          >
            <span style={{ fontSize: '3.5rem' }}>⏳</span>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--color-dark)', marginTop: '1rem' }}>
              No capsules found in this view
            </h3>
            <p style={{ color: 'var(--color-gray)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Lock in a thought or memory today and unlock it in the future!
            </p>
            <Link href="/schedule" className="btn btn-primary">
              Schedule Your First Capsule
            </Link>
          </div>
        ) : (
          /* Capsule Cards Grid */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filteredCapsules.map((capsule) => (
              <div
                key={capsule.id}
                style={{
                  background: 'var(--color-white)',
                  borderRadius: 'var(--card-border-radius)',
                  padding: '1.5rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: capsule.isUnlocked
                    ? '1.5px solid rgba(34, 197, 94, 0.4)'
                    : '1.5px solid rgba(112, 0, 255, 0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Top Row: Caption & Status */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark)' }}>
                      {capsule.caption}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '12px',
                        background: capsule.isUnlocked ? '#dcfce7' : '#ede9fe',
                        color: capsule.isUnlocked ? '#15803d' : '#6b21a8',
                      }}
                    >
                      {capsule.isUnlocked ? 'Unlocked 🔓' : 'Sealed 🔒'}
                    </span>
                  </div>

                  {/* Countdown Timer */}
                  <div style={{ marginBottom: '1rem' }}>
                    <CountdownTimer targetDate={capsule.scheduleDate} />
                  </div>

                  {/* Message Content (Revealed or Locked Preview) */}
                  <div
                    style={{
                      background: 'var(--color-light)',
                      borderRadius: '8px',
                      padding: '1rem',
                      marginBottom: '1rem',
                      filter: !capsule.isUnlocked ? 'blur(0.5px)' : 'none',
                      transition: 'filter 0.3s',
                    }}
                  >
                    <p style={{ color: 'var(--color-dark)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      {capsule.message}
                    </p>
                  </div>

                  {/* Optional Image */}
                  {capsule.imageUrl && (
                    <div
                      style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        marginBottom: '1rem',
                        maxHeight: '220px',
                        background: '#000',
                      }}
                    >
                      <img
                        src={capsule.imageUrl}
                        alt="Capsule attachment"
                        style={{ width: '100%', maxHeight: '220px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </div>

                {/* Card Footer: Metadata & Delete */}
                <div
                  style={{
                    borderTop: '1px solid var(--color-light)',
                    paddingTop: '0.8rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    color: 'var(--color-gray)',
                  }}
                >
                  <div>
                    <p>
                      <strong>Unlocks:</strong>{' '}
                      {new Date(capsule.scheduleDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p>
                      <strong>Visibility:</strong> {capsule.visibility}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(capsule.id)}
                    disabled={deletingId === capsule.id}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-danger)',
                      cursor: 'pointer',
                      padding: '6px',
                      fontSize: '1rem',
                    }}
                    title="Delete Capsule"
                  >
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
