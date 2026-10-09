'use client';

import React, { useState } from 'react';

const initialRequests = [
  { id: 'req-1', name: 'Hajia Bintu', mutual: '8 mutual friends', avatar: '/profile-13.jpg' },
  { id: 'req-2', name: 'Jackline Mensah', mutual: '2 mutual friends', avatar: '/profile-14.jpg' },
  { id: 'req-3', name: 'Jennifer Lawrence', mutual: '19 mutual friends', avatar: '/profile-15.jpg' },
];

export default function RightPanel() {
  const [requests, setRequests] = useState(initialRequests);
  const [activeTab, setActiveTab] = useState<'primary' | 'general' | 'requests'>('primary');

  const handleAction = (id: string) => {
    setRequests(requests.filter((r) => r.id !== id));
  };

  return (
    <div style={{ position: 'sticky', top: '5.4rem', height: 'max-content' }}>
      {/* Messages Box */}
      <div
        style={{
          background: 'var(--color-white)',
          borderRadius: 'var(--card-border-radius)',
          padding: '1rem',
          marginBottom: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.8rem',
          }}
        >
          <h4 style={{ fontWeight: 600, color: 'var(--color-dark)', fontSize: '0.95rem' }}>
            Capsule Network
          </h4>
          <i className="fa-regular fa-pen-to-square" style={{ color: 'var(--color-gray)', cursor: 'pointer' }}></i>
        </div>

        {/* Message Search */}
        <div
          style={{
            background: 'var(--color-light)',
            borderRadius: 'var(--border-radius)',
            padding: '0.4rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginBottom: '0.8rem',
          }}
        >
          <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--color-gray)', fontSize: '0.8rem' }}></i>
          <input
            type="search"
            placeholder="Search connections..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.8rem',
              color: 'var(--color-dark)',
              width: '100%',
            }}
          />
        </div>

        {/* Message Category Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '4px solid var(--color-light)',
            marginBottom: '0.8rem',
          }}
        >
          <h6
            onClick={() => setActiveTab('primary')}
            style={{
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 600,
              paddingBottom: '0.4rem',
              color: activeTab === 'primary' ? 'var(--color-primary)' : 'var(--color-gray)',
              borderBottom: activeTab === 'primary' ? '4px solid var(--color-primary)' : 'none',
              marginBottom: '-4px',
            }}
          >
            Primary
          </h6>
          <h6
            onClick={() => setActiveTab('general')}
            style={{
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 600,
              paddingBottom: '0.4rem',
              color: activeTab === 'general' ? 'var(--color-primary)' : 'var(--color-gray)',
              borderBottom: activeTab === 'general' ? '4px solid var(--color-primary)' : 'none',
              marginBottom: '-4px',
            }}
          >
            General
          </h6>
          <h6
            onClick={() => setActiveTab('requests')}
            style={{
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 600,
              paddingBottom: '0.4rem',
              color: activeTab === 'requests' ? 'var(--color-primary)' : 'var(--color-gray)',
              borderBottom: activeTab === 'requests' ? '4px solid var(--color-primary)' : 'none',
              marginBottom: '-4px',
            }}
          >
            Capsules (3)
          </h6>
        </div>

        {/* Message Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ position: 'relative' }}>
              <div className="profile-picture" style={{ width: '2.4rem', height: '2.4rem' }}>
                <img src="/profile-17.jpg" alt="Edem Quist" />
              </div>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--color-success)',
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  border: '1.5px solid white',
                }}
              />
            </div>
            <div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-dark)' }}>
                Edem Quist
              </h5>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-gray)' }}>
                Scheduled a memory for 2027! 🚀
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', cursor: 'pointer' }}>
            <div className="profile-picture" style={{ width: '2.4rem', height: '2.4rem' }}>
              <img src="/profile-18.jpg" alt="Chantel Msiza" />
            </div>
            <div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-dark)' }}>
                Chantel Msiza
              </h5>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-gray)' }}>
                Birthday time capsule sent! 🎂
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Friend Requests */}
      <div
        style={{
          background: 'var(--color-white)',
          borderRadius: 'var(--card-border-radius)',
          padding: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <h4 style={{ fontWeight: 600, color: 'var(--color-dark)', fontSize: '0.95rem', marginBottom: '0.8rem' }}>
          Memory Vault Requests
        </h4>

        {requests.length === 0 ? (
          <p style={{ fontSize: '0.8rem', color: 'var(--color-gray)', textAlign: 'center', padding: '0.5rem 0' }}>
            No pending requests
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {requests.map((req) => (
              <div
                key={req.id}
                style={{
                  background: 'var(--color-light)',
                  padding: '0.8rem',
                  borderRadius: 'var(--card-border-radius)',
                }}
              >
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <div className="profile-picture" style={{ width: '2.2rem', height: '2.2rem' }}>
                    <img src={req.avatar} alt={req.name} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-dark)' }}>
                      {req.name}
                    </h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-gray)' }}>{req.mutual}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleAction(req.id)}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.4rem 0', fontSize: '0.75rem' }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(req.id)}
                    className="btn"
                    style={{
                      flex: 1,
                      padding: '0.4rem 0',
                      fontSize: '0.75rem',
                      background: 'var(--color-white)',
                      color: 'var(--color-gray)',
                    }}
                  >
                    Decline
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
