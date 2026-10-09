'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  user?: {
    username: string;
    name?: string;
    avatar?: string;
    role?: 'admin' | 'user';
  } | null;
  onOpenThemeModal?: () => void;
}

export default function Navbar({ user, onOpenThemeModal }: NavbarProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error(e);
      router.push('/login');
    }
  };

  return (
    <nav style={{
      width: '100%',
      backgroundColor: 'var(--color-white)',
      padding: '0.8rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease'
    }}>
      <div className="app-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h2 style={{
            fontSize: '1.6rem',
            fontWeight: 700,
            color: 'var(--color-dark)',
            letterSpacing: '-0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⏳</span>
            <span>Time<span style={{ color: 'var(--color-primary)' }}>Caps</span></span>
            <span style={{
              fontSize: '0.75rem',
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '12px',
              fontWeight: 600,
              marginLeft: '4px'
            }}>3.0</span>
          </h2>
        </Link>

        {/* Search Bar */}
        <div style={{
          background: 'var(--color-light)',
          borderRadius: 'var(--border-radius)',
          padding: '0.6rem 1.4rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          width: '32vw',
          maxWidth: '450px'
        }}>
          <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--color-gray)' }}></i>
          <input
            type="search"
            placeholder="Search memories, capsules, or creators..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '0.9rem',
              color: 'var(--color-dark)'
            }}
          />
        </div>

        {/* Action Buttons & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <Link
            href="/schedule"
            className="btn btn-primary"
            style={{ boxShadow: '0 4px 12px rgba(112, 0, 255, 0.25)' }}
          >
            <i className="fa-solid fa-clock-rotate-left"></i>
            <span>Schedule Capsule</span>
          </Link>

          <Link
            href="/view-scheduled-messages"
            className="btn"
            style={{
              background: 'var(--color-light)',
              color: 'var(--color-dark)',
              fontWeight: 600
            }}
          >
            <i className="fa-solid fa-box-archive" style={{ color: 'var(--color-primary)' }}></i>
            <span>Vault</span>
          </Link>

          {/* User Profile Avatar with dropdown */}
          <div style={{ position: 'relative' }}>
            <div
              className="profile-picture"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                cursor: 'pointer',
                border: user?.role === 'admin' ? '2.5px solid var(--color-danger)' : '2.5px solid var(--color-primary)',
                transition: 'transform 0.2s'
              }}
            >
              <img
                src={user?.avatar || '/profile-8.jpg'}
                alt={user?.username || 'User Profile'}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
                }}
              />
            </div>

            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  background: 'var(--color-white)',
                  borderRadius: 'var(--card-border-radius)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  padding: '1rem',
                  minWidth: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  zIndex: 100
                }}
              >
                <div style={{ borderBottom: '1px solid var(--color-light)', paddingBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontWeight: 600, color: 'var(--color-dark)' }}>{user?.name || user?.username || 'User'}</p>
                    {user?.role === 'admin' && (
                      <span style={{ fontSize: '0.65rem', background: '#fee2e2', color: '#dc2626', padding: '1px 6px', borderRadius: '8px', fontWeight: 700 }}>
                        ADMIN
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>@{user?.username || 'demo'}</p>
                </div>

                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    color: 'var(--color-dark)',
                    textDecoration: 'none',
                    padding: '0.4rem 0',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  }}
                >
                  <i className="fa-solid fa-gear" style={{ color: 'var(--color-primary)' }}></i>
                  <span>Settings & Privacy</span>
                </Link>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onOpenThemeModal?.();
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    color: 'var(--color-dark)',
                    cursor: 'pointer',
                    padding: '0.4rem 0',
                    textAlign: 'left',
                    fontSize: '0.9rem'
                  }}
                >
                  <i className="fa-solid fa-palette" style={{ color: 'var(--color-primary)' }}></i>
                  Customize Theme
                </button>

                <button
                  onClick={handleLogout}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    color: 'var(--color-danger)',
                    cursor: 'pointer',
                    padding: '0.4rem 0',
                    textAlign: 'left',
                    fontSize: '0.9rem',
                    borderTop: '1px solid var(--color-light)',
                    marginTop: '0.2rem',
                    paddingTop: '0.6rem'
                  }}
                >
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
