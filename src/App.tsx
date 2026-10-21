import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Smartphone, Monitor, QrCode } from 'lucide-react';
import type { GiftConfig, PhotoItem } from './types/gift';
import { getInitialConfig, saveConfigToStorage, encodeConfigToUrl } from './utils/storage';
import { THEMES } from './utils/themes';
import { BackgroundParticles } from './components/BackgroundParticles';
import { MusicPlayer } from './components/MusicPlayer';
import { StageWelcome } from './components/stages/StageWelcome';
import { StageGiftBox } from './components/stages/StageGiftBox';
import { StageLetter } from './components/stages/StageLetter';
import { StageGallery } from './components/stages/StageGallery';
import { StageCake } from './components/stages/StageCake';
import { StageClosing } from './components/stages/StageClosing';
import { EditorModal } from './components/EditorModal';
import { LoveQRModal } from './components/LoveQRModal';
import { soundManager } from './utils/audio';

export const App: React.FC = () => {
  const [config, setConfig] = useState<GiftConfig>(getInitialConfig);
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isQROpen, setIsQROpen] = useState<boolean>(false);
  const [isPhoneFrameMode, setIsPhoneFrameMode] = useState<boolean>(false);

  const currentTheme = THEMES[config.theme] || THEMES.rose;

  // Persist config whenever updated
  useEffect(() => {
    saveConfigToStorage(config);
  }, [config]);

  const handleNextStage = () => {
    if (currentStage < 6) {
      setCurrentStage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRestart = () => {
    setCurrentStage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveConfig = (newConfig: GiftConfig) => {
    setConfig(newConfig);
  };

  const handleUpdatePhotos = (photos: PhotoItem[]) => {
    setConfig(prev => ({ ...prev, photos }));
  };

  return (
    <div className={`min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br ${currentTheme.bgGradient} transition-colors duration-700 font-sans`}>
      {/* Background Animated Floating Hearts & Ambient Glow */}
      <BackgroundParticles theme={config.theme} />

      {/* Music Player & Sound Controls */}
      <MusicPlayer 
        musicTrack={config.musicTrack}
        customMusicUrl={config.customMusicUrl}
        currentTrackName={config.musicTitle || (config.musicTrack === 'music-box' ? 'Kotak Musik' : config.customMusicUrl ? 'Lagu Pilihanmu' : 'Melodi Romantis')}
      />

      {/* Top Floating Navigation Bar */}
      <header className="fixed top-4 left-4 z-40 flex items-center gap-2">
        {/* Editor Modal Open Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundManager.playClick();
            setIsEditorOpen(true);
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold bg-white/80 hover:bg-white text-slate-700 shadow-lg shadow-pink-500/10 border border-white/60 backdrop-blur-md transition-all"
          title="Buka Editor Personalisasi"
        >
          <Settings className="w-4 h-4 text-rose-500 animate-spin-slow" />
          <span className="hidden sm:inline">Kustomisasi Kado</span>
          <span className="sm:hidden">Edit</span>
        </motion.button>

        {/* QR Code Love Modal Open Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundManager.playChime();
            setIsQROpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white shadow-lg shadow-pink-500/20 backdrop-blur-md transition-all"
          title="Lihat & Download QR Love Pink"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>QR Love 💖</span>
        </motion.button>

        {/* Device Frame View Toggle (Only visible on larger screens) */}
        <button
          onClick={() => {
            soundManager.playClick();
            setIsPhoneFrameMode(!isPhoneFrameMode);
          }}
          className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold bg-white/70 hover:bg-white text-slate-600 shadow-sm border border-white/60 backdrop-blur-md transition"
          title="Ubah Mode Tampilan HP/Layar Penuh"
        >
          {isPhoneFrameMode ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-blue-500" />
              <span>Layar Penuh</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-pink-500" />
              <span>Frame HP</span>
            </>
          )}
        </button>
      </header>

      {/* Subtle Step Dots Indicator at Top Center */}
      <div className="fixed top-5 inset-x-0 z-30 pointer-events-none flex justify-center">
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/50 backdrop-blur-md shadow-xs border border-white/40 pointer-events-auto">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <button
              key={step}
              onClick={() => {
                soundManager.playClick();
                setCurrentStage(step);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentStage === step
                  ? 'w-6 bg-gradient-to-r from-rose-500 to-pink-500 shadow-xs'
                  : currentStage > step
                    ? 'w-2 bg-rose-300'
                    : 'w-2 bg-slate-300/70'
              }`}
              title={`Beralih ke Langkah ${step}`}
            />
          ))}
        </div>
      </div>

      {/* Main Content Layout Container */}
      <main className="relative z-10 w-full min-h-screen flex items-center justify-center p-3 sm:p-6 pt-16 sm:pt-20">
        <div 
          className={`w-full transition-all duration-500 ${
            isPhoneFrameMode 
              ? 'max-w-sm rounded-[40px] border-8 border-slate-900 bg-white/40 shadow-2xl backdrop-blur-lg overflow-hidden my-4 ring-1 ring-slate-800' 
              : 'max-w-2xl'
          }`}
        >
          {/* Animated Stage Transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className="w-full"
            >
              {currentStage === 1 && (
                <StageWelcome 
                  config={config} 
                  onNext={handleNextStage} 
                />
              )}

              {currentStage === 2 && (
                <StageGiftBox 
                  config={config} 
                  onNext={handleNextStage} 
                />
              )}

              {currentStage === 3 && (
                <StageLetter 
                  config={config} 
                  onNext={handleNextStage} 
                />
              )}

              {currentStage === 4 && (
                <StageGallery 
                  config={config} 
                  onUpdatePhotos={handleUpdatePhotos}
                  onNext={handleNextStage} 
                />
              )}

              {currentStage === 5 && (
                <StageCake 
                  config={config} 
                  onNext={handleNextStage} 
                />
              )}

              {currentStage === 6 && (
                <StageClosing 
                  config={config} 
                  onRestart={handleRestart}
                  onOpenEditor={() => setIsEditorOpen(true)}
                  onOpenQR={() => setIsQROpen(true)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Personalization Editor Modal */}
      <EditorModal
        isOpen={isEditorOpen}
        config={config}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveConfig}
      />

      {/* Pink Love QR Code Modal */}
      <LoveQRModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        url={encodeConfigToUrl(config)}
        recipientName={config.recipientName}
      />
    </div>
  );
};

export default App;
