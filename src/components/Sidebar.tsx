'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  user?: {
    username: string;
    name?: string;
    avatar?: string;
    role?: 'admin' | 'user';
  } | null;
  onOpenThemeModal?: () => void;
  onOpenCreatePostModal?: () => void;
}

export default function Sidebar({
  user,
  onOpenThemeModal,
  onOpenCreatePostModal,
}: SidebarProps) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(4);

  const clearNotifications = () => {
    setNotificationCount(0);
  };

  return (
    <div style={{ position: 'sticky', top: '5.4rem', height: 'max-content' }}>
      {/* Profile Card */}
      <Link
        href="/settings"
        style={{
          textDecoration: 'none',
          display: 'block',
          marginBottom: '1rem',
        }}
      >
        <div
          style={{
            padding: '1rem',
            background: 'var(--color-white)',
            borderRadius: 'var(--card-border-radius)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            transition: 'transform 0.2s',
          }}
        >
          <div className="profile-picture">
            <img
              src={user?.avatar || '/profile-8.jpg'}
              alt="Profile"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h4 style={{ color: 'var(--color-dark)', fontWeight: 600, fontSize: '0.95rem' }}>
                {user?.name || user?.username || 'Charana'}
              </h4>
              {user?.role === 'admin' && (
                <span style={{ fontSize: '0.65rem', background: '#fee2e2', color: '#dc2626', padding: '1px 5px', borderRadius: '8px', fontWeight: 700 }}>
                  ADMIN
                </span>
              )}
            </div>
            <p style={{ color: 'var(--color-gray)', fontSize: '0.8rem' }}>
              @{user?.username || 'Charana_Bandara'}
            </p>
          </div>
          <i className="fa-solid fa-chevron-right" style={{ color: 'var(--color-gray)', fontSize: '0.8rem' }}></i>
        </div>
      </Link>

      {/* Sidebar Navigation */}
      <div
        style={{
          background: 'var(--color-white)',
          borderRadius: 'var(--card-border-radius)',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '3.6rem',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            position: 'relative',
            textDecoration: 'none',
            color: pathname === '/' ? 'var(--color-primary)' : 'var(--color-dark)',
            background: pathname === '/' ? 'var(--color-light)' : 'transparent',
            paddingLeft: '1.5rem',
            gap: '1.2rem',
          }}
        >
          <i className="fa-solid fa-house" style={{ fontSize: '1.15rem' }}></i>
          <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>Home Feed</span>
        </Link>

        <Link
          href="/view-scheduled-messages"
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '3.6rem',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            position: 'relative',
            textDecoration: 'none',
            color: pathname.includes('scheduled') ? 'var(--color-primary)' : 'var(--color-dark)',
            background: pathname.includes('scheduled') ? 'var(--color-light)' : 'transparent',
            paddingLeft: '1.5rem',
            gap: '1.2rem',
          }}
        >
          <i className="fa-solid fa-box-archive" style={{ fontSize: '1.15rem' }}></i>
          <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>Capsule Vault</span>
        </Link>

        {/* Notifications with Dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (notificationCount > 0) clearNotifications();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '3.6rem',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              color: showNotifications ? 'var(--color-primary)' : 'var(--color-dark)',
              background: showNotifications ? 'var(--color-light)' : 'transparent',
              paddingLeft: '1.5rem',
              gap: '1.2rem',
            }}
          >
            <div style={{ position: 'relative' }}>
              <i className="fa-solid fa-bell" style={{ fontSize: '1.15rem' }}></i>
              {notificationCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
                    background: 'var(--color-danger)',
                    color: 'white',
                    fontSize: '0.65rem',
                    borderRadius: '10px',
                    padding: '1px 5px',
                    fontWeight: 700,
                  }}
                >
                  {notificationCount}
                </span>
              )}
            </div>
            <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>Notifications</span>
          </div>

          {/* Popup */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                left: '105%',
                top: 0,
                width: '300px',
                background: 'var(--color-white)',
                borderRadius: 'var(--card-border-radius)',
                padding: '1rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
              }}
            >
              <h4 style={{ fontSize: '0.9rem', color: 'var(--color-dark)', fontWeight: 600 }}>
                Recent Alerts
              </h4>

              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <div className="profile-picture" style={{ width: '2.2rem', height: '2.2rem' }}>
                  <img src="/profile-2.jpg" alt="Sonali" />
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-dark)' }}>
                    <b>Sonali</b> sent a shared time capsule request.
                  </p>
                  <small style={{ color: 'var(--color-gray)', fontSize: '0.7rem' }}>2 HOURS AGO</small>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <div className="profile-picture" style={{ width: '2.2rem', height: '2.2rem' }}>
                  <img src="/profile-3.jpg" alt="Komal" />
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-dark)' }}>
                    <b>Komal</b> unlocked a memory from 2025!
                  </p>
                  <small style={{ color: 'var(--color-gray)', fontSize: '0.7rem' }}>5 HOURS AGO</small>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <div className="profile-picture" style={{ width: '2.2rem', height: '2.2rem' }}>
                  <img src="/profile-4.jpg" alt="Kunal" />
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-dark)' }}>
                    <b>Kunal</b> commented on your milestone post.
                  </p>
                  <small style={{ color: 'var(--color-gray)', fontSize: '0.7rem' }}>1 DAY AGO</small>
                </div>
              </div>
            </div>
          )}
        </div>

        <Link
          href="/create-post"
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '3.6rem',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            position: 'relative',
            textDecoration: 'none',
            color: pathname === '/create-post' ? 'var(--color-primary)' : 'var(--color-dark)',
            background: pathname === '/create-post' ? 'var(--color-light)' : 'transparent',
            paddingLeft: '1.5rem',
            gap: '1.2rem',
          }}
        >
          <i className="fa-solid fa-square-plus" style={{ fontSize: '1.15rem' }}></i>
          <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>Create Post</span>
        </Link>

        {/* Settings Button */}
        <Link
          href="/settings"
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '3.6rem',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            position: 'relative',
            textDecoration: 'none',
            color: pathname === '/settings' ? 'var(--color-primary)' : 'var(--color-dark)',
            background: pathname === '/settings' ? 'var(--color-light)' : 'transparent',
            paddingLeft: '1.5rem',
            gap: '1.2rem',
          }}
        >
          <i className="fa-solid fa-gear" style={{ fontSize: '1.15rem' }}></i>
          <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>Settings</span>
        </Link>

        {/* Theme Customizer Trigger */}
        <div
          onClick={onOpenThemeModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '3.6rem',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            color: 'var(--color-dark)',
            paddingLeft: '1.5rem',
            gap: '1.2rem',
          }}
        >
          <i className="fa-solid fa-palette" style={{ fontSize: '1.15rem', color: 'var(--color-primary)' }}></i>
          <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>Theme</span>
        </div>
      </div>

      {/* Quick Action Button */}
      <Link
        href="/schedule"
        className="btn btn-primary"
        style={{
          width: '100%',
          marginTop: '1rem',
          padding: '0.85rem',
          fontSize: '0.95rem',
          borderRadius: 'var(--border-radius)',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(112, 0, 255, 0.25)',
        }}
      >
        <i className="fa-solid fa-plus"></i> Lock New Capsule
      </Link>
    </div>
  );
}
