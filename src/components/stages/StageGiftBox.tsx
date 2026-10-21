import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import type { GiftConfig } from '../../types/gift';
import { THEMES } from '../../utils/themes';
import { soundManager } from '../../utils/audio';

interface StageGiftBoxProps {
  config: GiftConfig;
  onNext: () => void;
}

export const StageGiftBox: React.FC<StageGiftBoxProps> = ({ config, onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tapsLeft, setTapsLeft] = useState(1);
  const currentTheme = THEMES[config.theme];

  const triggerConfetti = () => {
    // Multi-stage confetti burst
    const colors = currentTheme.particleColors;
    
    // Center cannon
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors
    });

    // Side cannons for full screen celebration
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors
      });
    }, 250);
  };

  const handleBoxClick = () => {
    if (isOpen) return;

    if (tapsLeft > 1) {
      soundManager.playClick();
      setTapsLeft(prev => prev - 1);
    } else {
      soundManager.playGiftOpen();
      setIsOpen(true);
      triggerConfetti();
    }
  };

  const handleContinue = () => {
    soundManager.playChime();
    onNext();
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-8 max-w-lg mx-auto">
      {/* Stage Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${currentTheme.accentBadge}`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>Langkah 2 dari 6: Kotak Misteri</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold mt-3 font-serif-title">
          <span className={`bg-gradient-to-r ${currentTheme.textTitle} bg-clip-text text-transparent`}>
            {isOpen ? "Kejutan Untukmu Terbuka!" : "Ada Hadiah Buat Kamu 🎁"}
          </span>
        </h2>
        <p className={`text-sm sm:text-base mt-2 max-w-sm mx-auto ${currentTheme.textSubtitle}`}>
          {isOpen 
            ? "Di dalamnya tersimpan pesan tulus yang ditulis dari lubuk hati terdalam..." 
            : config.boxMessage}
        </p>
      </motion.div>

      {/* Gift Box Container */}
      <div className="relative my-8 cursor-pointer select-none" onClick={handleBoxClick}>
        {/* Glow backdrop */}
        <motion.div
          animate={{
            scale: isOpen ? [1, 1.4, 1.2] : [1, 1.15, 1],
            opacity: isOpen ? [0.6, 1, 0.8] : [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 blur-3xl rounded-full"
        />

        {/* The 3D / Layered Gift Box Illustration */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex flex-col items-center justify-center">
          {/* LID OF GIFT BOX */}
          <motion.div
            initial={false}
            animate={
              isOpen
                ? {
                    y: -90,
                    x: -25,
                    rotate: -28,
                    scale: 1.1,
                    opacity: 0.95,
                  }
                : {
                    y: [0, -6, 0],
                    rotate: [0, 1.5, 0],
                  }
            }
            transition={
              isOpen
                ? { type: 'spring', damping: 12, stiffness: 100 }
                : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            }
            className="relative z-20 w-44 sm:w-52 h-14 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 rounded-xl shadow-lg border-b-4 border-rose-700/60 flex items-center justify-center"
          >
            {/* Ribbon Ribbon Bow on top */}
            <div className="absolute -top-7 flex items-center justify-center">
              {/* Bow loops */}
              <div className="relative flex items-center">
                <div className="w-8 h-8 rounded-full border-4 border-amber-300 bg-amber-400/90 -rotate-45 shadow-sm transform -translate-x-1" />
                <div className="w-4 h-4 rounded-full bg-amber-300 shadow-md z-10" />
                <div className="w-8 h-8 rounded-full border-4 border-amber-300 bg-amber-400/90 rotate-45 shadow-sm transform translate-x-1" />
              </div>
            </div>

            {/* Vertical Ribbon band across lid */}
            <div className="w-9 h-full bg-amber-300 shadow-inner flex items-center justify-center">
              <span className="text-amber-700 font-bold text-xs select-none">🎀</span>
            </div>
          </motion.div>

          {/* BOX BASE */}
          <motion.div
            animate={
              isOpen
                ? { scale: [1, 1.05, 1] }
                : { rotate: [0, -2, 2, 0] }
            }
            transition={
              isOpen
                ? { duration: 0.5 }
                : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
            }
            className="relative z-10 w-40 sm:w-48 h-36 bg-gradient-to-b from-rose-600 via-pink-600 to-rose-700 rounded-b-2xl shadow-2xl flex items-center justify-center overflow-hidden border-t-2 border-rose-400/40"
          >
            {/* Vertical ribbon on base */}
            <div className="w-9 h-full bg-amber-300 shadow-lg flex items-center justify-center" />
            
            {/* Horizontal ribbon on base */}
            <div className="absolute w-full h-8 bg-amber-300/90 shadow-md" />

            {/* Content emerging when opened: Glowing Hearts */}
            {isOpen && (
              <motion.div
                initial={{ scale: 0, y: 30, opacity: 0 }}
                animate={{ scale: [0, 1.3, 1], y: -10, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="absolute z-20 flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-white/95 shadow-xl flex items-center justify-center">
                  <Heart className="w-10 h-10 text-rose-500 fill-rose-500 animate-pulse" />
                </div>
              </motion.div>
            )}

            {/* Subtle box sheen/reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
          </motion.div>

          {/* Floating magical sparkles out of box */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -top-16 inset-x-0 flex justify-around pointer-events-none text-2xl"
            >
              <motion.span animate={{ y: [-10, -35], opacity: [1, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>✨</motion.span>
              <motion.span animate={{ y: [-5, -45], opacity: [1, 0] }} transition={{ duration: 1.7, repeat: Infinity, delay: 0.3 }}>💖</motion.span>
              <motion.span animate={{ y: [-15, -40], opacity: [1, 0] }} transition={{ duration: 1.6, repeat: Infinity, delay: 0.6 }}>🌸</motion.span>
            </motion.div>
          )}
        </div>

        {/* Tap Prompt or Helper */}
        {!isOpen && (
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-2 text-xs font-semibold text-rose-600 bg-white/80 px-3.5 py-1 rounded-full shadow-sm border border-rose-200 inline-block"
          >
            👆 Ketuk kotak kado untuk membuka!
          </motion.div>
        )}
      </div>

      {/* Button to proceed once opened */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="w-full sm:w-auto mt-2"
          >
            <button
              onClick={handleContinue}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-base flex items-center justify-center gap-2.5 shadow-xl transition-all duration-300 transform active:scale-95 ${currentTheme.primaryButton}`}
            >
              <span>Baca Surat Spesial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
