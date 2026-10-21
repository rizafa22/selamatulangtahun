import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { THEMES } from '../utils/themes';
import type { ThemeType } from '../types/gift';

interface BackgroundParticlesProps {
  theme: ThemeType;
}

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  type: 'heart' | 'star' | 'circle';
  opacity: number;
  color: string;
}

export const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({ theme }) => {
  const currentTheme = THEMES[theme];

  // Pre-generate random particles with fixed seeds for smooth rendering
  const particles: Particle[] = useMemo(() => {
    const list: Particle[] = [];
    const colors = currentTheme.particleColors;
    const count = 28;

    for (let i = 0; i < count; i++) {
      const typeChoice = Math.random();
      const type = typeChoice > 0.45 ? 'heart' : typeChoice > 0.2 ? 'star' : 'circle';
      list.push({
        id: i,
        x: Math.random() * 100, // percentage 0-100vw
        size: Math.floor(Math.random() * 18) + 12,
        duration: Math.random() * 9 + 8, // 8-17s
        delay: Math.random() * 6,
        type,
        opacity: Math.random() * 0.45 + 0.25,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    return list;
  }, [currentTheme]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dynamic ambient gradient glow */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ background: currentTheme.bgOverlay }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            bottom: '-40px',
            color: p.color,
            fontSize: `${p.size}px`,
          }}
          initial={{ y: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: ['0vh', '-110vh'],
            x: [0, (p.id % 2 === 0 ? 30 : -30), 0],
            opacity: [0, p.opacity, p.opacity * 0.9, 0],
            rotate: [0, p.id % 2 === 0 ? 45 : -45, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        >
          {p.type === 'heart' && (
            <svg
              viewBox="0 0 24 24"
              width={p.size}
              height={p.size}
              fill="currentColor"
              className="drop-shadow-sm filter"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
          {p.type === 'star' && (
            <span className="inline-block select-none drop-shadow-sm filter">✨</span>
          )}
          {p.type === 'circle' && (
            <div
              className="rounded-full blur-xs"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                opacity: 0.5,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};
