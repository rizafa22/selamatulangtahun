import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Wind, ArrowRight, Heart } from 'lucide-react';
import type { GiftConfig } from '../../types/gift';
import { THEMES } from '../../utils/themes';
import { soundManager } from '../../utils/audio';

interface StageCakeProps {
  config: GiftConfig;
  onNext: () => void;
}

export const StageCake: React.FC<StageCakeProps> = ({ config, onNext }) => {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [showWishes, setShowWishes] = useState(false);
  const currentTheme = THEMES[config.theme];

  const handleBlowCandles = () => {
    if (candlesBlown) return;

    soundManager.playBlowCandle();
    setCandlesBlown(true);

    // Multi-angle festive fireworks confetti
    setTimeout(() => {
      soundManager.playCheer();
      setShowWishes(true);

      const colors = currentTheme.particleColors;
      // High blast confetti
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
        colors
      });

      // Side cannons
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0.1, y: 0.6 },
          colors
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 0.9, y: 0.6 },
          colors
        });
      }, 300);
    }, 600);
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
        className="mb-4"
      >
        <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${currentTheme.accentBadge}`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>Langkah 5 dari 6: Kejutan Spesial</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold mt-3 font-serif-title">
          <span className={`bg-gradient-to-r ${currentTheme.textTitle} bg-clip-text text-transparent`}>
            {candlesBlown ? "Harapanmu Telah Terkirim! 🌟" : config.cakeTitle}
          </span>
        </h2>
        <p className={`text-sm sm:text-base mt-2 max-w-sm mx-auto ${currentTheme.textSubtitle}`}>
          {candlesBlown
            ? "Semoga semesta mendengar doa dan harapan tulusmu hari ini..."
            : config.cakeMessage}
        </p>
      </motion.div>

      {/* BIRTHDAY CAKE ILLUSTRATION WITH CANDLES */}
      <div className="relative my-6 select-none flex flex-col items-center justify-center">
        {/* Glow backdrop behind cake */}
        <div 
          className={`absolute inset-0 blur-3xl rounded-full transition-all duration-700 ${
            candlesBlown ? 'bg-pink-300/20' : 'bg-amber-300/40'
          }`} 
        />

        {/* The Candle Flames row */}
        <div className="flex justify-center items-end gap-6 sm:gap-8 mb-1 relative z-20">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center relative">
              {/* FLAME or SMOKE */}
              {!candlesBlown ? (
                <div className="relative cursor-pointer" onClick={handleBlowCandles}>
                  {/* Outer Flame Glow */}
                  <div className="w-4 h-7 bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 rounded-full animate-flame shadow-lg" />
                  {/* Inner Flame Core */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-white/90 rounded-full" />
                </div>
              ) : (
                /* Smoke puff after blown */
                <div className="w-4 h-7 relative flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-slate-400/50 blur-xs animate-smoke" />
                </div>
              )}

              {/* Wick */}
              <div className="w-0.5 h-2 bg-slate-800" />

              {/* Candle Body */}
              <div 
                className={`w-3.5 sm:w-4 h-12 rounded-t-sm shadow-md border-x border-white/40 ${
                  i === 1 
                    ? 'bg-gradient-to-b from-pink-300 via-rose-400 to-pink-500' 
                    : i === 0 
                      ? 'bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400' 
                      : 'bg-gradient-to-b from-purple-200 via-purple-300 to-purple-400'
                }`}
              >
                {/* Spiral stripes on candle */}
                <div className="w-full h-full opacity-30 bg-repeat-y bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.8)_50%,transparent_75%)] bg-[length:10px_10px]" />
              </div>
            </div>
          ))}
        </div>

        {/* 2-TIER ROMANTIC CAKE */}
        <div className="relative flex flex-col items-center">
          {/* Top Layer */}
          <div className="relative w-44 sm:w-48 h-16 bg-gradient-to-r from-pink-200 via-rose-100 to-pink-200 rounded-t-2xl shadow-md border-t-4 border-rose-300/80 flex items-center justify-center overflow-hidden">
            {/* Strawberry Cream Frosting drips */}
            <div className="absolute top-0 inset-x-0 flex justify-around">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="w-6 h-4 bg-white/95 rounded-b-full shadow-xs -mt-1" />
              ))}
            </div>

            {/* Cake Cherry / Berry Toppings */}
            <div className="absolute -top-3 inset-x-0 flex justify-between px-3">
              <span className="text-sm">🍓</span>
              <span className="text-sm">💖</span>
              <span className="text-sm">🍓</span>
            </div>

            <span className="text-xs font-semibold text-rose-500 font-handwriting text-base">
              Spesial Untukmu
            </span>
          </div>

          {/* Bottom Layer */}
          <div className="relative w-56 sm:w-64 h-20 bg-gradient-to-r from-rose-300 via-pink-200 to-rose-300 rounded-b-2xl shadow-xl border-t-2 border-rose-400/40 flex items-center justify-center overflow-hidden">
            {/* Cream borders */}
            <div className="absolute top-0 inset-x-0 h-3 bg-white/90 shadow-xs" />
            
            {/* Heart decorations on cake */}
            <div className="flex items-center gap-4 text-rose-400 text-sm">
              <Heart className="w-3.5 h-3.5 fill-rose-400 animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase text-rose-700/80 font-sans">
                {config.recipientName}
              </span>
              <Heart className="w-3.5 h-3.5 fill-rose-400 animate-pulse" />
            </div>
          </div>

          {/* Cake Stand / Plate */}
          <div className="w-64 sm:w-72 h-4 bg-gradient-to-r from-slate-200 via-white to-slate-200 rounded-full shadow-lg -mt-1 border border-slate-300/50" />
          <div className="w-32 h-3 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-300 rounded-b-md shadow-sm" />
        </div>
      </div>

      {/* Blow Candle Action Button */}
      {!candlesBlown && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-3 w-full sm:w-auto"
        >
          <button
            onClick={handleBlowCandles}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-base flex items-center justify-center gap-2.5 shadow-xl transition-all duration-300 transform active:scale-95 ${currentTheme.primaryButton}`}
          >
            <Wind className="w-5 h-5 animate-pulse" />
            <span>Tiup Lilin Sekarang 🕯️💨</span>
          </button>
          <p className="text-xs text-slate-500 mt-2">
            💡 Tekan tombol di atas untuk meniup lilin dan membuat permohonan!
          </p>
        </motion.div>
      )}

      {/* Wishes card revealed after blowing */}
      <AnimatePresence>
        {showWishes && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="w-full mt-4"
          >
            <div className="p-4 sm:p-5 rounded-2xl bg-white/85 backdrop-blur-md border border-rose-200/80 shadow-lg text-center mb-6">
              <span className="text-2xl mb-1 block">✨🎉🥳</span>
              <h4 className="text-lg font-bold text-rose-700 font-serif-title">
                Semoga Semua Harapanmu Terkabul!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Tersenyumlah, karena hari ini adalah hari yang paling indah untukmu.
              </p>
            </div>

            <button
              onClick={handleContinue}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-base flex items-center justify-center gap-2.5 shadow-xl transition-all duration-300 transform active:scale-95 ${currentTheme.primaryButton}`}
            >
              <span>Pesan Terakhir Dari Hatiku</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
