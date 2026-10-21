import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Gift } from 'lucide-react';
import type { GiftConfig } from '../../types/gift';
import { THEMES } from '../../utils/themes';
import { soundManager } from '../../utils/audio';

interface StageWelcomeProps {
  config: GiftConfig;
  onNext: () => void;
}

export const StageWelcome: React.FC<StageWelcomeProps> = ({ config, onNext }) => {
  const currentTheme = THEMES[config.theme];

  const handleStart = () => {
    soundManager.playChime();
    onNext();
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-8 max-w-lg mx-auto">
      {/* Decorative floating cute badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide border shadow-sm backdrop-blur-md mb-6 ${currentTheme.accentBadge}`}
      >
        <Sparkles className="w-4 h-4 animate-spin text-pink-500" />
        <span>Spesial Untuk {config.recipientName}</span>
        <Heart className="w-3.5 h-3.5 fill-current text-rose-500 animate-pulse" />
      </motion.div>

      {/* Main glowing Heart illustration */}
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 14, stiffness: 120, delay: 0.2 }}
        className="relative mb-8 cursor-pointer"
        onClick={() => soundManager.playChime()}
      >
        <div className="absolute inset-0 bg-pink-400/25 blur-3xl rounded-full scale-125 animate-pulse" />
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-rose-400 via-pink-400 to-amber-200 p-1 shadow-xl shadow-rose-500/20 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Heart className="w-14 h-14 sm:w-16 sm:h-16 text-rose-500 fill-rose-500 drop-shadow-md" />
            </motion.div>
          </div>
        </div>

        {/* Small floating sparkles around heart */}
        <motion.div
          animate={{ y: [-4, 4, -4], rotate: [0, 20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-2 -right-1 text-2xl select-none"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ y: [4, -4, 4], rotate: [0, -15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute -bottom-2 -left-2 text-2xl select-none"
        >
          🌸
        </motion.div>
      </motion.div>

      {/* Romantic Greeting Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 px-2"
      >
        <span className={`bg-gradient-to-r ${currentTheme.textTitle} bg-clip-text text-transparent drop-shadow-xs font-serif-title`}>
          {config.welcomeGreeting}
        </span>
      </motion.h1>

      {/* Subtitle / Sweet description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55 }}
        className={`text-base sm:text-lg leading-relaxed mb-9 px-4 max-w-md ${currentTheme.textSubtitle}`}
      >
        {config.welcomeSubtitle}
      </motion.p>

      {/* Action Button: Buka Kejutannya */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 15, delay: 0.7 }}
        className="relative group w-full sm:w-auto"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-300 group-hover:scale-105" />
        
        <button
          onClick={handleStart}
          className={`relative w-full sm:w-auto px-8 py-4 rounded-full font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all duration-300 transform active:scale-95 shadow-xl ${currentTheme.primaryButton}`}
        >
          <Gift className="w-5 h-5 animate-bounce" />
          <span>Buka Kejutannya 🎁</span>
        </button>
      </motion.div>

      {/* Subtle hint footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="text-xs text-slate-500 mt-8 flex items-center gap-1.5"
      >
        <span>💡 Pastikan suaramu aktif untuk pengalaman terbaik</span>
      </motion.p>
    </div>
  );
};
