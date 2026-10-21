import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface MusicPlayerProps {
  currentTrackName?: string;
  musicTrack?: string;
  customMusicUrl?: string;
  themeStyle?: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  currentTrackName = 'Melodi Romantis',
  musicTrack = 'romantic-piano',
  customMusicUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (customMusicUrl) {
      soundManager.setCustomAudio(customMusicUrl);
    }
  }, [customMusicUrl]);

  useEffect(() => {
    // Autostart music on first user touch / click anywhere on window
    const handleFirstGesture = () => {
      if (!soundManager.getIsPlaying()) {
        soundManager.startBackgroundMusic(musicTrack, customMusicUrl);
        setIsPlaying(true);
      }
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, [musicTrack, customMusicUrl]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    const playing = soundManager.toggleMusic();
    setIsPlaying(playing);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundManager.setMuted(newMuted);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/90 backdrop-blur-md shadow-lg border border-pink-200 text-pink-700"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin" />
            <span>{currentTrackName}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className="flex items-center bg-white/80 hover:bg-white/95 backdrop-blur-md p-1.5 rounded-full shadow-lg shadow-pink-500/10 border border-white/60 transition-all duration-300"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Vinyl / Spinning Disc Button */}
        <motion.button
          onClick={togglePlay}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
            isPlaying ? 'bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow-md shadow-rose-400/40' : 'bg-slate-100 text-slate-500'
          }`}
          title={isPlaying ? "Jeda Musik" : "Putar Musik"}
          aria-label={isPlaying ? "Jeda Musik" : "Putar Musik"}
        >
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={isPlaying ? { duration: 4, repeat: Infinity, ease: 'linear' } : {}}
            className="flex items-center justify-center"
          >
            <Music className="w-4 h-4" />
          </motion.div>
          {isPlaying && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          )}
        </motion.button>

        {/* Mute/Unmute Toggle Button */}
        <motion.button
          onClick={toggleMute}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-rose-600 transition-colors"
          title={isMuted ? "Bunyikan Suara" : "Senyapkan Suara"}
          aria-label={isMuted ? "Bunyikan Suara" : "Senyapkan Suara"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-red-400" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </motion.button>
      </div>
    </div>
  );
};
