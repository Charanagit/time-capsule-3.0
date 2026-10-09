'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function SchedulePage() {
  const router = useRouter();
  const [caption, setCaption] = useState('');
  const [messageText, setMessageText] = useState('');
  const [scheduleType, setScheduleType] = useState<'oneYear' | 'custom'>('oneYear');
  const [customDate, setCustomDate] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [specificFriend, setSpecificFriend] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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
    setError('');
    if (!caption.trim() || !messageText.trim()) {
      setError('Please provide both a caption and a message for your capsule.');
      return;
    }

    if (scheduleType === 'custom' && !customDate) {
      setError('Please pick a custom date for your time capsule.');
      return;
    }

    setLoading(true);
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

      const res = await fetch('/api/capsules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption,
          message: messageText,
          scheduleType,
          customDate: scheduleType === 'custom' ? customDate : undefined,
          visibility: visibility === 'specific' ? `specific:${specificFriend}` : visibility,
          imageUrl,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/view-scheduled-messages');
        }, 1200);
      } else {
        const d = await res.json();
        setError(d.error || 'Failed to schedule capsule');
      }
    } catch {
      setError('Network error scheduling capsule');
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
            <span style={{ fontSize: '2.5rem' }}>⏳</span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-dark)', marginTop: '0.3rem' }}>
              Schedule a Time Capsule
            </h1>
            <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem' }}>
              Lock your thoughts, photos, and messages to be unveiled in the future.
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

          {success && (
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#16a34a',
                padding: '0.8rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                textAlign: 'center',
                fontWeight: 600,
              }}
            >
              🎉 Time capsule successfully sealed and locked! Redirecting to vault...
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            {/* Caption */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                Capsule Title / Caption
              </label>
              <input
                type="text"
                required
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. Letter to Future Me, Birthday Wishes for 2027"
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

            {/* Message */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                Your Message:
              </label>
              <textarea
                rows={5}
                required
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type the message you want to preserve for the future..."
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

            {/* Attachment Section */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                Attach Picture (Optional):
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
                  transition: 'background 0.2s',
                }}
              >
                {imagePreview ? (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={imagePreview}
                      alt="Attachment preview"
                      style={{ maxHeight: '200px', margin: '0 auto', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-gray)', marginTop: '0.5rem' }}>
                      Click to change image
                    </p>
                  </div>
                ) : (
                  <div>
                    <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}></i>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-dark)', fontWeight: 500 }}>
                      Click to upload photo attachment
                    </p>
                    <small style={{ color: 'var(--color-gray)' }}>PNG, JPG, GIF up to 10MB</small>
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

            {/* Schedule Section */}
            <div style={{ background: 'var(--color-light)', padding: '1.2rem', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-dark)', marginBottom: '0.8rem' }}>
                📅 Unlock Date & Timing
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--color-dark)' }}>
                  <input
                    type="radio"
                    name="scheduleType"
                    value="oneYear"
                    checked={scheduleType === 'oneYear'}
                    onChange={() => setScheduleType('oneYear')}
                  />
                  <span>Schedule 1 Year from Now (Standard Capsule)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--color-dark)' }}>
                  <input
                    type="radio"
                    name="scheduleType"
                    value="custom"
                    checked={scheduleType === 'custom'}
                    onChange={() => setScheduleType('custom')}
                  />
                  <span>Pick a Custom Date</span>
                </label>

                {scheduleType === 'custom' && (
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      padding: '0.6rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      fontSize: '0.9rem',
                      marginTop: '0.4rem',
                      width: '100%',
                    }}
                  />
                )}
              </div>
            </div>

            {/* Visibility Section */}
            <div style={{ background: 'var(--color-light)', padding: '1.2rem', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-dark)', marginBottom: '0.8rem' }}>
                🔒 Privacy & Visibility
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--color-dark)' }}>
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={visibility === 'private'}
                    onChange={() => setVisibility('private')}
                  />
                  <span>Private (Only Me)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--color-dark)' }}>
                  <input
                    type="radio"
                    name="visibility"
                    value="friends"
                    checked={visibility === 'friends'}
                    onChange={() => setVisibility('friends')}
                  />
                  <span>Friends</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--color-dark)' }}>
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={visibility === 'public'}
                    onChange={() => setVisibility('public')}
                  />
                  <span>Public</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--color-dark)' }}>
                  <input
                    type="radio"
                    name="visibility"
                    value="specific"
                    checked={visibility === 'specific'}
                    onChange={() => setVisibility('specific')}
                  />
                  <span>Specific Friend</span>
                </label>
              </div>

              {visibility === 'specific' && (
                <select
                  value={specificFriend}
                  onChange={(e) => setSpecificFriend(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    fontSize: '0.9rem',
                    marginTop: '0.8rem',
                  }}
                >
                  <option value="">Select a Friend</option>
                  <option value="Edem Quist">Edem Quist</option>
                  <option value="Chantel Msiza">Chantel Msiza</option>
                  <option value="Hajia Bintu">Hajia Bintu</option>
                </select>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 'var(--border-radius)',
                boxShadow: '0 6px 20px rgba(112, 0, 255, 0.3)',
              }}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Sealing Capsule...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-lock"></i> Add to Capsules & Seal Vault
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
