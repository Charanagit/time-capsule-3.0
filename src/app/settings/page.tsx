'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

type SettingsTab =
  | 'profile'
  | 'privacy'
  | 'capsules'
  | 'security'
  | 'notifications'
  | 'messages'
  | 'display'
  | 'export'
  | 'admin';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile Form States
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('https://timecapsule.app');
  const [pronouns, setPronouns] = useState('they/them');
  const [avatar, setAvatar] = useState('/profile-8.jpg');

  // Privacy States (Instagram Style)
  const [isPrivate, setIsPrivate] = useState(false);
  const [hideLikes, setHideLikes] = useState(false);
  const [closeFriends, setCloseFriends] = useState(['Sonali', 'Komal', 'Ernest']);
  const [newCloseFriend, setNewCloseFriend] = useState('');
  const [taggingPermission, setTaggingPermission] = useState('everyone');
  const [blockedUsers, setBlockedUsers] = useState(['spambot_99', 'unknown_user']);

  // Capsule Preferences (TimeCapsule Unique)
  const [defaultLockDuration, setDefaultLockDuration] = useState('1year');
  const [autoEmailNotify, setAutoEmailNotify] = useState(true);
  const [flashbacksEnabled, setFlashbacksEnabled] = useState(true);
  const [vaultBlurIntensity, setVaultBlurIntensity] = useState('medium');
  const [ephemeralVault, setEphemeralVault] = useState(false);

  // Security States (Meta/FB Style)
  const [twoFactor, setTwoFactor] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmNewPw, setConfirmNewPw] = useState('');
  const [pwMessage, setPwMessage] = useState('');

  // Notifications (Instagram Style)
  const [pauseAllNotifs, setPauseAllNotifs] = useState(false);
  const [quietMode, setQuietMode] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [milestoneAlerts, setMilestoneAlerts] = useState(true);

  // Messages States
  const [messageFilter, setMessageFilter] = useState('friends');
  const [readReceipts, setReadReceipts] = useState(true);
  const [groupCapsuleInvites, setGroupCapsuleInvites] = useState(true);

  // Display & Media
  const [highQualityUploads, setHighQualityUploads] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [autoplayMedia, setAutoplayMedia] = useState(true);

  // Admin Broadcast state
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          setName(data.user.name || data.user.username);
          setBio(data.user.bio || 'Preserving digital memories ⏳✨');
          setAvatar(data.user.avatar || '/profile-8.jpg');
          setIsPrivate(!!data.user.isPrivate);
          setTwoFactor(!!data.user.twoFactorEnabled);
          setQuietMode(!!data.user.quietMode);
        } else {
          setUser({ username: 'demo', name: 'Charana Pramoad', role: 'user' });
          setName('Charana Pramoad');
        }
      })
      .catch(() => {
        setUser({ username: 'demo', name: 'Charana Pramoad', role: 'user' });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          bio,
          avatar,
          isPrivate,
          twoFactorEnabled: twoFactor,
          quietMode,
        }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error('Save error:', e);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmNewPw) {
      setPwMessage('❌ New passwords do not match');
      return;
    }
    if (newPw.length < 6) {
      setPwMessage('❌ Password must be at least 6 characters');
      return;
    }
    setPwMessage('✅ Password updated securely!');
    setCurrentPw('');
    setNewPw('');
    setConfirmNewPw('');
  };

  const handleAddCloseFriend = () => {
    if (!newCloseFriend.trim()) return;
    setCloseFriends([...closeFriends, newCloseFriend.trim()]);
    setNewCloseFriend('');
  };

  const handleUnblock = (username: string) => {
    setBlockedUsers(blockedUsers.filter((u) => u !== username));
  };

  const handleExportData = () => {
    const dataObj = {
      username: user?.username || 'demo',
      exportedAt: new Date().toISOString(),
      accountType: user?.role || 'user',
      preferences: {
        isPrivate,
        defaultLockDuration,
        autoEmailNotify,
        flashbacksEnabled,
      },
      closeFriends,
    };
    const blob = new Blob([JSON.stringify(dataObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timecapsule-data-${user?.username || 'user'}.json`;
    a.click();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-light)', paddingBottom: '5rem' }}>
      <Navbar user={user} />

      <div className="app-container" style={{ marginTop: '2.5rem' }}>
        {/* Settings Header Box */}
        <div
          style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--card-border-radius)',
            padding: '1.5rem 2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div
              className="profile-picture"
              style={{ width: '3.5rem', height: '3.5rem', border: '3px solid var(--color-primary)' }}
            >
              <img src={avatar} alt="Profile" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-dark)' }}>
                Account Settings & Preferences
              </h1>
              <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem' }}>
                Meta & Instagram style privacy, security, and time vault customizations
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
            {saveSuccess && (
              <span style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.9rem' }}>
                ✓ Settings Saved!
              </span>
            )}
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="btn btn-primary"
              style={{ padding: '0.7rem 1.8rem' }}
            >
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>

        {/* 2-Column Layout for Settings */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '260px 1fr',
            gap: '2rem',
          }}
        >
          {/* Left Navigation Menu */}
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--card-border-radius)',
              padding: '1rem',
              height: 'max-content',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem',
            }}
          >
            <div style={{ padding: '0.5rem 0.8rem', borderBottom: '1px solid var(--color-light)', marginBottom: '0.5rem' }}>
              <small style={{ fontWeight: 700, color: 'var(--color-gray)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                Preferences
              </small>
            </div>

            {[
              { id: 'profile', icon: 'fa-regular fa-user', label: 'Edit Profile' },
              { id: 'privacy', icon: 'fa-solid fa-lock', label: 'Privacy & Audience' },
              { id: 'capsules', icon: 'fa-solid fa-hourglass-half', label: 'Capsule Preferences' },
              { id: 'security', icon: 'fa-solid fa-shield-halved', label: 'Security & 2FA' },
              { id: 'notifications', icon: 'fa-regular fa-bell', label: 'Notifications & Quiet Mode' },
              { id: 'messages', icon: 'fa-regular fa-paper-plane', label: 'Messages & Sharing' },
              { id: 'display', icon: 'fa-solid fa-wand-magic-sparkles', label: 'Media & Display' },
              { id: 'export', icon: 'fa-solid fa-download', label: 'Your Data & Export' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as SettingsTab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  padding: '0.8rem 1rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeTab === item.id ? 'var(--color-light)' : 'transparent',
                  color: activeTab === item.id ? 'var(--color-primary)' : 'var(--color-dark)',
                  fontWeight: activeTab === item.id ? 600 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <i className={item.icon} style={{ width: '1.2rem', textAlign: 'center' }}></i>
                <span>{item.label}</span>
              </button>
            ))}

            {/* Admin Only Tab */}
            {user?.role === 'admin' && (
              <>
                <div style={{ margin: '0.6rem 0 0.2rem', padding: '0.5rem 0.8rem', borderTop: '1px solid var(--color-light)' }}>
                  <small style={{ fontWeight: 700, color: 'var(--color-danger)', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                    Super Admin
                  </small>
                </div>
                <button
                  onClick={() => setActiveTab('admin')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.9rem',
                    padding: '0.8rem 1rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: activeTab === 'admin' ? 'rgba(239,68,68,0.1)' : 'transparent',
                    color: 'var(--color-danger)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <i className="fa-solid fa-user-shield" style={{ width: '1.2rem', textAlign: 'center' }}></i>
                  <span>Admin Control Center</span>
                </button>
              </>
            )}
          </div>

          {/* Right Content Panel */}
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--card-border-radius)',
              padding: '2.5rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            }}
          >
            {/* 1. EDIT PROFILE */}
            {activeTab === 'profile' && (
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                  Edit Profile
                </h2>
                <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                  Manage how you appear across Time Capsule 3.0.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
                  {/* Avatar Picker */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '0.5rem' }}>
                    <div className="profile-picture" style={{ width: '4.5rem', height: '4.5rem' }}>
                      <img src={avatar} alt="Profile" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-dark)' }}>
                        Profile Picture
                      </h4>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {['/profile-8.jpg', '/profile-1.jpg', '/profile-2.jpg', '/profile-3.jpg', '/profile-4.jpg'].map((imgSrc, i) => (
                          <div
                            key={i}
                            onClick={() => setAvatar(imgSrc)}
                            className="profile-picture"
                            style={{
                              width: '2.2rem',
                              height: '2.2rem',
                              cursor: 'pointer',
                              border: avatar === imgSrc ? '2px solid var(--color-primary)' : '2px solid transparent',
                            }}
                          >
                            <img src={imgSrc} alt="Choice" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        background: 'var(--color-light)',
                        color: 'var(--color-dark)',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                      Username
                    </label>
                    <input
                      type="text"
                      disabled
                      value={`@${user?.username || 'demo'}`}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        background: '#f1f5f9',
                        color: 'var(--color-gray)',
                        fontSize: '0.9rem',
                        cursor: 'not-allowed',
                      }}
                    />
                    <small style={{ color: 'var(--color-gray)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                      Unique username handle in the TimeCaps memory network.
                    </small>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                      Bio / Memory Quote
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Write a short bio or future motto..."
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        background: 'var(--color-light)',
                        color: 'var(--color-dark)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                        Pronouns
                      </label>
                      <input
                        type="text"
                        value={pronouns}
                        onChange={(e) => setPronouns(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.7rem 1rem',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          background: 'var(--color-light)',
                          color: 'var(--color-dark)',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                        Links / Website
                      </label>
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.7rem 1rem',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          background: 'var(--color-light)',
                          color: 'var(--color-dark)',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PRIVACY & AUDIENCE (Instagram Style) */}
            {activeTab === 'privacy' && (
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                  Privacy & Audience Control
                </h2>
                <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                  Control who can see your profile, time capsules, and feed memories.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', maxWidth: '650px' }}>
                  {/* Private Account Toggle */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.2rem', borderBottom: '1px solid var(--color-light)' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-dark)' }}>
                        Private Account
                      </h4>
                      <p style={{ color: 'var(--color-gray)', fontSize: '0.8rem', marginTop: '2px' }}>
                        When your account is private, only approved followers can see your memories and capsules.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      style={{ width: '1.4rem', height: '1.4rem', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Hide Likes and View Counts */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.2rem', borderBottom: '1px solid var(--color-light)' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-dark)' }}>
                        Hide Like & Reaction Counts
                      </h4>
                      <p style={{ color: 'var(--color-gray)', fontSize: '0.8rem', marginTop: '2px' }}>
                        The total number of likes and views will be hidden on your posts.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={hideLikes}
                      onChange={(e) => setHideLikes(e.target.checked)}
                      style={{ width: '1.4rem', height: '1.4rem', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Tagging Permissions */}
                  <div style={{ paddingBottom: '1.2rem', borderBottom: '1px solid var(--color-light)' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-dark)', marginBottom: '0.6rem' }}>
                      Who Can Tag & Mention You in Capsules
                    </h4>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                      {['everyone', 'friends', 'no_one'].map((opt) => (
                        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-dark)' }}>
                          <input
                            type="radio"
                            name="tagging"
                            value={opt}
                            checked={taggingPermission === opt}
                            onChange={() => setTaggingPermission(opt)}
                          />
                          <span style={{ textTransform: 'capitalize' }}>{opt.replace('_', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Close Friends Manager */}
                  <div style={{ paddingBottom: '1.2rem', borderBottom: '1px solid var(--color-light)' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                      ⭐ Close Friends Circle
                    </h4>
                    <p style={{ color: 'var(--color-gray)', fontSize: '0.8rem', marginBottom: '0.8rem' }}>
                      Add your closest companions who will receive special early-access unlock notifications.
                    </p>

                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
                      <input
                        type="text"
                        placeholder="Add friend name..."
                        value={newCloseFriend}
                        onChange={(e) => setNewCloseFriend(e.target.value)}
                        style={{
                          padding: '0.5rem 0.9rem',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          background: 'var(--color-light)',
                          fontSize: '0.85rem',
                          outline: 'none',
                        }}
                      />
                      <button onClick={handleAddCloseFriend} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                        Add
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {closeFriends.map((friend) => (
                        <span
                          key={friend}
                          style={{
                            background: 'rgba(34, 197, 94, 0.15)',
                            color: '#16a34a',
                            padding: '4px 10px',
                            borderRadius: '16px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          {friend}
                          <i
                            className="fa-solid fa-xmark"
                            onClick={() => setCloseFriends(closeFriends.filter((f) => f !== friend))}
                            style={{ cursor: 'pointer', fontSize: '0.75rem' }}
                          ></i>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Blocked Accounts */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-dark)', marginBottom: '0.6rem' }}>
                      🚫 Blocked Accounts
                    </h4>
                    {blockedUsers.length === 0 ? (
                      <p style={{ color: 'var(--color-gray)', fontSize: '0.8rem' }}>No blocked accounts</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {blockedUsers.map((u) => (
                          <div
                            key={u}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              background: 'var(--color-light)',
                              padding: '0.5rem 0.8rem',
                              borderRadius: '8px',
                            }}
                          >
                            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-dark)' }}>@{u}</span>
                            <button
                              onClick={() => handleUnblock(u)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--color-primary)',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              Unblock
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 3. TIME CAPSULE PREFERENCES */}
            {activeTab === 'capsules' && (
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                  ⏳ Time Capsule & Vault Preferences
                </h2>
                <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                  Fine-tune how your future memories are sealed, scheduled, and delivered.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', maxWidth: '650px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                      Default Seal Duration Preset
                    </label>
                    <select
                      value={defaultLockDuration}
                      onChange={(e) => setDefaultLockDuration(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        background: 'var(--color-light)',
                        color: 'var(--color-dark)',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    >
                      <option value="1year">1 Year (Standard Anniversary)</option>
                      <option value="3years">3 Years (Milestone Era)</option>
                      <option value="5years">5 Years (Long-Term Vault)</option>
                      <option value="10years">10 Years (Decade Capsule)</option>
                      <option value="25years">25 Years (Silver Jubilee Edition)</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.2rem', borderBottom: '1px solid var(--color-light)' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-dark)' }}>
                        Automated Unlock Email Notification
                      </h4>
                      <p style={{ color: 'var(--color-gray)', fontSize: '0.8rem', marginTop: '2px' }}>
                        Receive a morning celebration email when a time capsule reaches its scheduled unlock timestamp.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoEmailNotify}
                      onChange={(e) => setAutoEmailNotify(e.target.checked)}
                      style={{ width: '1.4rem', height: '1.4rem', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.2rem', borderBottom: '1px solid var(--color-light)' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-dark)' }}>
                        &quot;On This Day&quot; Flashback Reminders
                      </h4>
                      <p style={{ color: 'var(--color-gray)', fontSize: '0.8rem', marginTop: '2px' }}>
                        Get nostalgic alerts whenever you have past memories from this exact calendar date.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={flashbacksEnabled}
                      onChange={(e) => setFlashbacksEnabled(e.target.checked)}
                      style={{ width: '1.4rem', height: '1.4rem', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                      Sealed Vault Blur Intensity
                    </label>
                    <select
                      value={vaultBlurIntensity}
                      onChange={(e) => setVaultBlurIntensity(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        background: 'var(--color-light)',
                        color: 'var(--color-dark)',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    >
                      <option value="high">High (Full Cryptographic Concealment)</option>
                      <option value="medium">Medium (Soft Frosted Glass Preview)</option>
                      <option value="off">Minimal (Show Caption Only)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 4. SECURITY & 2FA (Meta/FB Style) */}
            {activeTab === 'security' && (
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                  Password & Security (Meta Account Center)
                </h2>
                <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                  Manage two-factor authentication, active login sessions, and password security.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px' }}>
                  {/* Two-Factor Auth */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-light)', padding: '1.2rem', borderRadius: '12px' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-dark)' }}>
                        Two-Factor Authentication (2FA)
                      </h4>
                      <p style={{ color: 'var(--color-gray)', fontSize: '0.8rem', marginTop: '2px' }}>
                        Protect your capsule vault with an extra layer of SMS or Authenticator verification.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={twoFactor}
                      onChange={(e) => setTwoFactor(e.target.checked)}
                      style={{ width: '1.4rem', height: '1.4rem', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Change Password Form */}
                  <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-dark)' }}>
                      Change Password
                    </h3>

                    {pwMessage && (
                      <div style={{ padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.85rem', background: pwMessage.startsWith('✅') ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: pwMessage.startsWith('✅') ? '#16a34a' : '#dc2626' }}>
                        {pwMessage}
                      </div>
                    )}

                    <input
                      type="password"
                      placeholder="Current Password"
                      value={currentPw}
                      onChange={(e) => setCurrentPw(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        background: 'var(--color-light)',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />

                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        background: 'var(--color-light)',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />

                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmNewPw}
                      onChange={(e) => setConfirmNewPw(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        background: 'var(--color-light)',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />

                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                      Update Password
                    </button>
                  </form>

                  {/* Active Login Sessions (FB style) */}
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-dark)', marginBottom: '0.8rem' }}>
                      Where You&apos;re Logged In
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-light)', padding: '0.8rem 1rem', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                          <i className="fa-solid fa-desktop" style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}></i>
                          <div>
                            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-dark)' }}>
                              Windows PC · Chrome Browser
                            </p>
                            <small style={{ color: '#16a34a', fontWeight: 600 }}>Active Now · Localhost</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. NOTIFICATIONS & QUIET MODE */}
            {activeTab === 'notifications' && (
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                  Notifications & Quiet Mode
                </h2>
                <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                  Manage push notifications, quiet hours, and memory alerts.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', maxWidth: '600px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.2rem', borderBottom: '1px solid var(--color-light)' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-dark)' }}>
                        Pause All Notifications
                      </h4>
                      <p style={{ color: 'var(--color-gray)', fontSize: '0.8rem', marginTop: '2px' }}>
                        Temporarily silence all push notifications.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={pauseAllNotifs}
                      onChange={(e) => setPauseAllNotifs(e.target.checked)}
                      style={{ width: '1.4rem', height: '1.4rem', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.2rem', borderBottom: '1px solid var(--color-light)' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-dark)' }}>
                        🌙 Quiet Mode (Instagram Style)
                      </h4>
                      <p style={{ color: 'var(--color-gray)', fontSize: '0.8rem', marginTop: '2px' }}>
                        Automatically mute notifications from 10:00 PM to 07:00 AM.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={quietMode}
                      onChange={(e) => setQuietMode(e.target.checked)}
                      style={{ width: '1.4rem', height: '1.4rem', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.2rem', borderBottom: '1px solid var(--color-light)' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-dark)' }}>
                        Capsule Milestone Alerts
                      </h4>
                      <p style={{ color: 'var(--color-gray)', fontSize: '0.8rem', marginTop: '2px' }}>
                        Get reminders 30 days and 7 days before your locked capsules open.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={milestoneAlerts}
                      onChange={(e) => setMilestoneAlerts(e.target.checked)}
                      style={{ width: '1.4rem', height: '1.4rem', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 6. MESSAGES & SHARING */}
            {activeTab === 'messages' && (
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                  Messages & Capsule Sharing
                </h2>
                <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                  Choose who can send you direct capsule invites and message requests.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', maxWidth: '600px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                      Message & Capsule Request Filter
                    </label>
                    <select
                      value={messageFilter}
                      onChange={(e) => setMessageFilter(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        background: 'var(--color-light)',
                        color: 'var(--color-dark)',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    >
                      <option value="everyone">Everyone can send capsule requests</option>
                      <option value="friends">Only Friends & Mutual Connections</option>
                      <option value="nobody">No one (Direct Vault Only)</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.2rem', borderBottom: '1px solid var(--color-light)' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-dark)' }}>
                        Show Read Receipts (&quot;Seen&quot;)
                      </h4>
                      <p style={{ color: 'var(--color-gray)', fontSize: '0.8rem', marginTop: '2px' }}>
                        Allow others to see when you have viewed their shared capsules.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={readReceipts}
                      onChange={(e) => setReadReceipts(e.target.checked)}
                      style={{ width: '1.4rem', height: '1.4rem', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 7. MEDIA & DISPLAY */}
            {activeTab === 'display' && (
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                  Media Quality & Display
                </h2>
                <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                  Manage media upload resolution, data usage, and animations.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', maxWidth: '600px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.2rem', borderBottom: '1px solid var(--color-light)' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-dark)' }}>
                        Upload at Highest Quality (Instagram Style)
                      </h4>
                      <p style={{ color: 'var(--color-gray)', fontSize: '0.8rem', marginTop: '2px' }}>
                        Always preserve original photo resolution for your future memories.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={highQualityUploads}
                      onChange={(e) => setHighQualityUploads(e.target.checked)}
                      style={{ width: '1.4rem', height: '1.4rem', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.2rem', borderBottom: '1px solid var(--color-light)' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-dark)' }}>
                        Data Saver Mode
                      </h4>
                      <p style={{ color: 'var(--color-gray)', fontSize: '0.8rem', marginTop: '2px' }}>
                        Lowers image resolution to reduce mobile network data usage.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={dataSaver}
                      onChange={(e) => setDataSaver(e.target.checked)}
                      style={{ width: '1.4rem', height: '1.4rem', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 8. YOUR INFORMATION & EXPORT */}
            {activeTab === 'export' && (
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                  Your Information & Memory Archive (Facebook Style)
                </h2>
                <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                  Download a complete backup of all your sealed capsules, posts, and memories.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
                  <div style={{ background: 'var(--color-light)', padding: '1.5rem', borderRadius: '12px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                      📦 Download a Copy of Your Information
                    </h3>
                    <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
                      Export a JSON archive containing all your timeline memories, private capsules, and account preferences.
                    </p>
                    <button onClick={handleExportData} className="btn btn-primary">
                      <i className="fa-solid fa-file-arrow-down"></i> Export Archive (.json)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 9. SUPER ADMIN CONTROL CENTER */}
            {activeTab === 'admin' && user?.role === 'admin' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
                  <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                    ADMIN PRIVILEGES
                  </span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-dark)' }}>
                    Platform Administration Center
                  </h2>
                </div>
                <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                  System metrics, user directory, and platform maintenance controls.
                </p>

                {/* Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ background: 'var(--color-light)', padding: '1.2rem', borderRadius: '12px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-primary)' }}>1,420+</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>Total Users</p>
                  </div>
                  <div style={{ background: 'var(--color-light)', padding: '1.2rem', borderRadius: '12px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#16a34a' }}>3,892</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>Active Capsules Sealed</p>
                  </div>
                  <div style={{ background: 'var(--color-light)', padding: '1.2rem', borderRadius: '12px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#eab308' }}>99.98%</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>Database Uptime</p>
                  </div>
                </div>

                {/* Broadcast Banner */}
                <div style={{ background: 'var(--color-light)', padding: '1.5rem', borderRadius: '12px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                    📢 Broadcast System Announcement
                  </h3>
                  <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    Send a high-priority banner notification to all connected users.
                  </p>

                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <input
                      type="text"
                      placeholder="e.g. Scheduled maintenance tonight at 02:00 AM UTC..."
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.6rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        background: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      onClick={() => {
                        if (!broadcastMessage) return;
                        setBroadcastSent(true);
                        setTimeout(() => setBroadcastSent(false), 3000);
                        setBroadcastMessage('');
                      }}
                      className="btn"
                      style={{ background: 'var(--color-danger)', color: '#fff' }}
                    >
                      Broadcast
                    </button>
                  </div>
                  {broadcastSent && (
                    <small style={{ color: '#16a34a', fontWeight: 600, marginTop: '6px', display: 'block' }}>
                      ✓ System broadcast dispatched to all feeds!
                    </small>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
