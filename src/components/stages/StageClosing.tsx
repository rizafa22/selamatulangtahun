import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, RotateCcw, Share2, Sparkles, Check, Edit3, MessageCircle, QrCode } from 'lucide-react';
import type { GiftConfig } from '../../types/gift';
import { THEMES } from '../../utils/themes';
import { soundManager } from '../../utils/audio';
import { encodeConfigToUrl } from '../../utils/storage';

interface StageClosingProps {
  config: GiftConfig;
  onRestart: () => void;
  onOpenEditor: () => void;
  onOpenQR: () => void;
}

export const StageClosing: React.FC<StageClosingProps> = ({ 
  config, 
  onRestart, 
  onOpenEditor,
  onOpenQR 
}) => {
  const [copied, setCopied] = useState(false);
  const currentTheme = THEMES[config.theme];

  const handleShareLink = () => {
    soundManager.playChime();
    const shareableUrl = encodeConfigToUrl(config);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareableUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
    } else {
      // Fallback
      window.prompt('Salin link kado ini:', shareableUrl);
    }
  };

  const handleShareWhatsApp = () => {
    soundManager.playClick();
    const shareableUrl = encodeConfigToUrl(config);
    const text = encodeURIComponent(`Hai ${config.recipientName}! Aku punya kado virtual spesial yang kubuat khusus buat kamu 🎁 Buka di sini: ${shareableUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-8 max-w-lg mx-auto">
      {/* Decorative top icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, delay: 0.1 }}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-300 p-1 shadow-xl shadow-rose-500/20 mb-6 flex items-center justify-center"
      >
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-rose-500 fill-rose-500" />
          </motion.div>
        </div>
      </motion.div>

      {/* Main Closing Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-card w-full rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden"
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-300/30 rounded-full blur-2xl pointer-events-none" />

        <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md mb-4 ${currentTheme.accentBadge}`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>Dari Hati Terdalam</span>
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 font-serif-title leading-tight">
          <span className={`bg-gradient-to-r ${currentTheme.textTitle} bg-clip-text text-transparent`}>
            {config.closingTitle}
          </span>
        </h2>

        <p className={`text-base sm:text-lg leading-relaxed mb-6 font-handwriting text-slate-800 text-xl`}>
          "{config.closingMessage}"
        </p>

        <div className="pt-4 border-t border-rose-100 flex flex-col items-center">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Tersimpan Selamanya Untuk
          </p>
          <p className="text-lg font-bold text-rose-600 mt-0.5">
            {config.recipientName} 💖 {config.senderName}
          </p>
        </div>
      </motion.div>

      {/* Interactive Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full flex flex-col gap-3.5"
      >
        {/* Share via WhatsApp */}
        <button
          onClick={handleShareWhatsApp}
          className="w-full py-3.5 px-6 rounded-full font-bold text-base flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 transition-all transform active:scale-95"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>Kirim Hadiah Lewat WhatsApp</span>
        </button>

        {/* Copy Shareable Link */}
        <button
          onClick={handleShareLink}
          className={`w-full py-3.5 px-6 rounded-full font-bold text-base flex items-center justify-center gap-2.5 shadow-lg transition-all transform active:scale-95 ${
            copied 
              ? 'bg-slate-900 text-white shadow-slate-900/30' 
              : currentTheme.primaryButton
          }`}
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-emerald-400" />
              <span>Link Hadiah Berhasil Disalin!</span>
            </>
          ) : (
            <>
              <Share2 className="w-5 h-5" />
              <span>Salin Link Hadiah Pribadi</span>
            </>
          )}
        </button>

        {/* Barcode / QR Code Love Button */}
        <button
          onClick={() => {
            soundManager.playChime();
            onOpenQR();
          }}
          className="w-full py-3.5 px-6 rounded-full font-bold text-base flex items-center justify-center gap-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/25 transition-all transform active:scale-95"
        >
          <QrCode className="w-5 h-5 animate-pulse" />
          <span>Lihat & Download QR Love Pink 💖</span>
        </button>

        {/* Secondary options: Restart & Customize */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => {
              soundManager.playClick();
              onRestart();
            }}
            className="flex-1 py-3 px-4 rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 shadow-xs transition transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-rose-500" />
            <span>Putar Ulang</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenEditor();
            }}
            className="flex-1 py-3 px-4 rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 shadow-xs transition transform active:scale-95"
          >
            <Edit3 className="w-4 h-4 text-purple-500" />
            <span>Edit Kado</span>
          </button>
        </div>
      </motion.div>

      {/* Footer Branding for Viral Digital Gift Business */}
      <div className="mt-10 text-[11px] text-slate-400 flex flex-col items-center gap-1">
        <span>✨ Dibuat dengan cinta menggunakan Virtual Gift Experience</span>
        <span>Siap dijadikan bisnis kado digital & website romantis</span>
      </div>
    </div>
  );
};
