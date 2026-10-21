import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MailOpen, ArrowRight, Heart, Sparkles, FastForward } from 'lucide-react';
import type { GiftConfig } from '../../types/gift';
import { THEMES } from '../../utils/themes';
import { soundManager } from '../../utils/audio';

interface StageLetterProps {
  config: GiftConfig;
  onNext: () => void;
}

export const StageLetter: React.FC<StageLetterProps> = ({ config, onNext }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const currentTheme = THEMES[config.theme];

  const fullLetterContent = config.letterContent;

  // Envelope open handler
  const handleOpenEnvelope = () => {
    if (isOpened) return;
    soundManager.playPaperRustle();
    setIsOpened(true);
  };

  // Typewriter effect after envelope opens
  useEffect(() => {
    if (!isOpened) return;

    let index = 0;
    const speed = 28; // ms per character
    const timer = setInterval(() => {
      if (index < fullLetterContent.length) {
        setDisplayedText(fullLetterContent.slice(0, index + 1));
        index++;
      } else {
        setIsTypingComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [isOpened, fullLetterContent]);

  const handleSkipTyping = () => {
    setDisplayedText(fullLetterContent);
    setIsTypingComplete(true);
  };

  const handleContinue = () => {
    soundManager.playChime();
    onNext();
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 max-w-lg mx-auto">
      {/* Stage Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-5"
      >
        <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${currentTheme.accentBadge}`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>Langkah 3 dari 6: Surat Dari Hati</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold mt-3 font-serif-title">
          <span className={`bg-gradient-to-r ${currentTheme.textTitle} bg-clip-text text-transparent`}>
            {config.letterTitle}
          </span>
        </h2>
      </motion.div>

      {/* ENVELOPE / LETTER CARD CONTAINER */}
      <div className="w-full relative">
        {!isOpened ? (
          // Sealed Romantic Envelope
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenEnvelope}
            className="cursor-pointer mx-auto w-full max-w-sm rounded-2xl bg-gradient-to-b from-rose-50 to-pink-100 p-6 shadow-2xl border-2 border-rose-200 flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[280px]"
          >
            {/* Vintage postage stamp */}
            <div className="absolute top-4 right-4 w-12 h-14 border-2 border-dashed border-rose-300 bg-white rounded flex flex-col items-center justify-center text-[10px] text-rose-500 font-bold shadow-xs">
              <span>POST</span>
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500 my-0.5" />
              <span>LOVE</span>
            </div>

            {/* Envelope flap aesthetic */}
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600 mb-4 group-hover:scale-110 transition-transform">
              <Mail className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-rose-900 mb-1">
              Surat Tertutup Khusus Untukmu
            </h3>
            <p className="text-xs text-rose-700/80 mb-6">
              Dikirim dengan segenap rasa oleh <span className="font-semibold underline">{config.senderName}</span>
            </p>

            {/* Wax Seal Button */}
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-sm shadow-md group-hover:shadow-rose-400/50 transition">
              <MailOpen className="w-4 h-4" />
              <span>Buka Segel Amplop 💌</span>
            </div>
          </motion.div>
        ) : (
          // Unfolded Letter Paper with Typewriter Effect
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="w-full rounded-2xl bg-gradient-to-b from-amber-50/95 via-rose-50/80 to-white/95 backdrop-blur-md p-6 sm:p-7 shadow-2xl border border-rose-200/80 relative text-left"
          >
            {/* Header of the letter */}
            <div className="flex items-center justify-between border-b border-rose-200/60 pb-3 mb-4">
              <div className="flex items-center gap-2 text-rose-600 font-semibold text-sm">
                <Heart className="w-4 h-4 fill-rose-500" />
                <span>Untuk {config.recipientName} tercinta</span>
              </div>
              
              {!isTypingComplete && (
                <button
                  onClick={handleSkipTyping}
                  className="flex items-center gap-1 text-xs text-rose-600/80 hover:text-rose-700 font-medium px-2 py-1 rounded bg-rose-100/60 hover:bg-rose-100 transition"
                  title="Lewati Animasi Ketik"
                >
                  <FastForward className="w-3 h-3" />
                  <span>Lewati</span>
                </button>
              )}
            </div>

            {/* Letter Body with Handwritten / Elegant Serif Font */}
            <div className="min-h-[170px] text-base sm:text-lg leading-relaxed text-slate-800 font-handwriting font-medium whitespace-pre-line tracking-wide">
              {displayedText}
              {!isTypingComplete && (
                <span className="inline-block w-1.5 h-4 bg-rose-500 ml-1 animate-pulse" />
              )}
            </div>

            {/* Closing & Sender Signature */}
            {isTypingComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-6 pt-4 border-t border-rose-200/60 flex flex-col items-end text-right font-handwriting"
              >
                <span className="text-sm text-slate-600">{config.letterClosing}</span>
                <span className="text-xl font-bold text-rose-600 mt-0.5">{config.senderName}</span>
                <span className="text-xs text-slate-400 mt-1 font-sans">Dibuat penuh cinta 💖</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Button to proceed to next stage */}
      {isOpened && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isTypingComplete ? 1 : 0.8, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 w-full sm:w-auto"
        >
          <button
            onClick={handleContinue}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-base flex items-center justify-center gap-2.5 shadow-xl transition-all duration-300 transform active:scale-95 ${currentTheme.primaryButton}`}
          >
            <span>Lihat Galeri Kenangan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
};
