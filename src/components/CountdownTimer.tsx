'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface CountdownTimerProps {
  targetDate: string;
  onUnlocked?: () => void;
}

export default function CountdownTimer({ targetDate, onUnlocked }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPassed: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: false });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isPassed: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  if (timeLeft.isPassed) {
    return (
      <div
        onClick={triggerConfetti}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(34, 197, 94, 0.15)',
          color: '#16a34a',
          padding: '4px 12px',
          borderRadius: '20px',
          fontWeight: 600,
          fontSize: '0.8rem',
          cursor: 'pointer',
        }}
      >
        <span>🔓</span>
        <span>Vault Unlocked! (Click for 🎉)</span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(112, 0, 255, 0.1)',
        color: 'var(--color-primary)',
        padding: '5px 12px',
        borderRadius: '20px',
        fontWeight: 600,
        fontSize: '0.8rem',
        border: '1px solid rgba(112, 0, 255, 0.2)',
      }}
    >
      <span>⏳</span>
      <span>
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s left
      </span>
    </div>
  );
}
