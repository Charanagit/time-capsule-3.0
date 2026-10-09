'use client';

import React, { useState, useEffect } from 'react';

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

const colors = [
  { id: '1', hue: '252', bg: 'hsl(252, 75%, 60%)' },
  { id: '2', hue: '52', bg: 'hsl(52, 75%, 60%)' },
  { id: '3', hue: '352', bg: 'hsl(352, 75%, 60%)' },
  { id: '4', hue: '152', bg: 'hsl(152, 75%, 60%)' },
  { id: '5', hue: '202', bg: 'hsl(202, 75%, 60%)' },
];

export default function ThemeCustomizer({ isOpen, onClose }: ThemeCustomizerProps) {
  const [fontSize, setFontSize] = useState('14px');
  const [activeColor, setActiveColor] = useState('1');
  const [bgMode, setBgMode] = useState<'light' | 'dim' | 'dark'>('light');

  const handleFontSize = (size: string) => {
    setFontSize(size);
    document.documentElement.style.fontSize = size;
  };

  const handleColor = (id: string, hue: string) => {
    setActiveColor(id);
    document.documentElement.style.setProperty('--Hue', hue);
  };

  const handleBgMode = (mode: 'light' | 'dim' | 'dark') => {
    setBgMode(mode);
    document.body.classList.remove('bg-theme-1', 'bg-theme-2', 'bg-theme-3');
    if (mode === 'light') {
      document.body.classList.add('bg-theme-1');
    } else if (mode === 'dim') {
      document.body.classList.add('bg-theme-2');
    } else {
      document.body.classList.add('bg-theme-3');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        backdropFilter: 'blur(5px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-white)',
          padding: '2.5rem',
          borderRadius: 'var(--card-border-radius)',
          width: '90%',
          maxWidth: '560px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
          Customize Your View
        </h2>
        <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Manage your font size, primary accent color, and background theme.
        </p>

        {/* Font Size Selector */}
        <div style={{ marginBottom: '1.8rem', textAlign: 'left' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-dark)', marginBottom: '0.8rem' }}>
            Font Size
          </h4>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--color-light)',
              padding: '0.8rem 1.2rem',
              borderRadius: 'var(--border-radius)',
            }}
          >
            <h6 style={{ fontSize: '10px', color: 'var(--color-dark)' }}>Aa</h6>
            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
              {['11px', '13px', '14px', '16px', '18px'].map((size) => (
                <span
                  key={size}
                  onClick={() => handleFontSize(size)}
                  style={{
                    width: '1rem',
                    height: '1rem',
                    borderRadius: '50%',
                    background: fontSize === size ? 'var(--color-primary)' : 'var(--color-gray)',
                    cursor: 'pointer',
                    transform: fontSize === size ? 'scale(1.2)' : 'scale(1)',
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>
            <h3 style={{ fontSize: '18px', color: 'var(--color-dark)' }}>Aa</h3>
          </div>
        </div>

        {/* Primary Color Palette */}
        <div style={{ marginBottom: '1.8rem', textAlign: 'left' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-dark)', marginBottom: '0.8rem' }}>
            Color Palette
          </h4>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              background: 'var(--color-light)',
              padding: '0.8rem',
              borderRadius: 'var(--border-radius)',
            }}
          >
            {colors.map((c) => (
              <span
                key={c.id}
                onClick={() => handleColor(c.id, c.hue)}
                style={{
                  width: '2.2rem',
                  height: '2.2rem',
                  borderRadius: '50%',
                  background: c.bg,
                  cursor: 'pointer',
                  border: activeColor === c.id ? '3px solid white' : 'none',
                  boxShadow: activeColor === c.id ? '0 0 10px rgba(0,0,0,0.3)' : 'none',
                  transform: activeColor === c.id ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
        </div>

        {/* Background Theme */}
        <div style={{ marginBottom: '1.8rem', textAlign: 'left' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-dark)', marginBottom: '0.8rem' }}>
            Background
          </h4>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <div
              onClick={() => handleBgMode('light')}
              style={{
                flex: 1,
                padding: '0.8rem',
                borderRadius: 'var(--card-border-radius)',
                background: '#fff',
                color: '#1a1a2e',
                border: bgMode === 'light' ? '2px solid var(--color-primary)' : '2px solid #ddd',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              Light
            </div>
            <div
              onClick={() => handleBgMode('dim')}
              style={{
                flex: 1,
                padding: '0.8rem',
                borderRadius: 'var(--card-border-radius)',
                background: 'hsl(252, 30%, 17%)',
                color: '#fff',
                border: bgMode === 'dim' ? '2px solid var(--color-primary)' : '2px solid transparent',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              Dim
            </div>
            <div
              onClick={() => handleBgMode('dark')}
              style={{
                flex: 1,
                padding: '0.8rem',
                borderRadius: 'var(--card-border-radius)',
                background: 'hsl(252, 30%, 10%)',
                color: '#fff',
                border: bgMode === 'dark' ? '2px solid var(--color-primary)' : '2px solid transparent',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              Lights Out
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.8rem' }}
        >
          Save & Apply
        </button>
      </div>
    </div>
  );
}
