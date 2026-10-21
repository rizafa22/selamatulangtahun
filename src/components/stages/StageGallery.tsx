import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Heart, X, ZoomIn, ImagePlus } from 'lucide-react';
import type { GiftConfig, PhotoItem } from '../../types/gift';
import { THEMES } from '../../utils/themes';
import { soundManager } from '../../utils/audio';

import { compressImage } from '../../utils/imageCompressor';

interface StageGalleryProps {
  config: GiftConfig;
  onUpdatePhotos: (photos: PhotoItem[]) => void;
  onNext: () => void;
}

export const StageGallery: React.FC<StageGalleryProps> = ({ 
  config, 
  onUpdatePhotos, 
  onNext 
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const currentTheme = THEMES[config.theme];

  const handlePhotoClick = (photo: PhotoItem) => {
    soundManager.playChime();
    setSelectedPhoto(photo);
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playChime();
    setLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  // Allow uploading a custom photo directly with automatic compression
  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedUrl = await compressImage(file);
        const newPhoto: PhotoItem = {
          id: `photo-${Date.now()}`,
          url: compressedUrl,
          caption: 'Momen berharga bersama kamu 💖',
          date: 'Baru saja diunggah',
          rotation: (Math.random() - 0.5) * 6
        };
        onUpdatePhotos([...config.photos, newPhoto]);
        soundManager.playChime();
      } catch (err) {
        console.error('Gagal memproses foto', err);
      }
    }
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 max-w-xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${currentTheme.accentBadge}`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>Langkah 4 dari 6: Galeri Kenangan</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold mt-3 font-serif-title">
          <span className={`bg-gradient-to-r ${currentTheme.textTitle} bg-clip-text text-transparent`}>
            Momen Manis Kita 📸
          </span>
        </h2>
        <p className={`text-sm mt-1.5 max-w-sm mx-auto ${currentTheme.textSubtitle}`}>
          Setiap senyuman, canda, dan cerita yang terukir abadi dalam ingatan.
        </p>
      </motion.div>

      {/* Polaroid Grid (Mobile responsive: 2 columns on mobile/tablet) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full mb-8">
        {config.photos.map((photo, index) => {
          const rot = photo.rotation ?? (index % 2 === 0 ? -2 : 2.5);
          const photoLikes = likes[photo.id] || 0;

          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.12, duration: 0.5 }}
              whileHover={{ scale: 1.03, rotate: 0, zIndex: 10 }}
              style={{ rotate: `${rot}deg` }}
              onClick={() => handlePhotoClick(photo)}
              className="polaroid-frame bg-white p-3.5 pb-5 rounded-sm cursor-pointer border border-slate-200/60 relative group"
            >
              {/* Decorative Washi Tape on top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-rose-200/70 -rotate-2 rounded-xs shadow-xs pointer-events-none backdrop-blur-xs" />

              {/* Photo Image Container */}
              <div className="relative aspect-4/3 sm:aspect-square overflow-hidden rounded-xs bg-slate-100">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Overlay hover prompt */}
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <div className="flex items-center gap-1.5 text-xs font-semibold bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Perbesar</span>
                  </div>
                </div>

                {/* Like Heart Button */}
                <button
                  onClick={(e) => handleLike(photo.id, e)}
                  className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-rose-500 shadow-md backdrop-blur-xs transition transform active:scale-125 flex items-center gap-1 text-xs font-bold"
                  title="Beri Cinta"
                >
                  <Heart className={`w-3.5 h-3.5 ${photoLikes > 0 ? 'fill-rose-500' : ''}`} />
                  {photoLikes > 0 && <span>{photoLikes}</span>}
                </button>
              </div>

              {/* Polaroid Caption */}
              <div className="mt-3 px-1 text-left">
                <p className="font-handwriting text-base sm:text-lg text-slate-800 leading-tight">
                  {photo.caption}
                </p>
                {photo.date && (
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-sans">
                    {photo.date}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Upload Button to add more memories */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full mb-6">
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white/80 hover:bg-white text-slate-700 shadow-sm border border-slate-200 hover:border-pink-300 transition">
          <ImagePlus className="w-4 h-4 text-pink-500" />
          <span>Tambah Foto Kenangan</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUploadPhoto}
          />
        </label>
      </div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full sm:w-auto"
      >
        <button
          onClick={() => {
            soundManager.playChime();
            onNext();
          }}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-base flex items-center justify-center gap-2.5 shadow-xl transition-all duration-300 transform active:scale-95 ${currentTheme.primaryButton}`}
        >
          <span>Lanjut ke Kejutan Spesial</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Fullscreen Photo Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-4 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-4 sm:p-5 pb-6 rounded-2xl max-w-md w-full shadow-2xl relative border border-white/20"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg hover:bg-rose-600 transition"
                title="Tutup"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="rounded-xl overflow-hidden aspect-4/3 sm:aspect-square bg-slate-100 mb-4">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center px-2">
                <p className="font-handwriting text-xl sm:text-2xl text-slate-800">
                  {selectedPhoto.caption}
                </p>
                {selectedPhoto.date && (
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
                    {selectedPhoto.date}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
