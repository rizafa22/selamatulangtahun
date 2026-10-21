import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Save, Sparkles, ImagePlus, Trash2, Palette, Music, 
  FileText, User, Share2, Check, RefreshCw
} from 'lucide-react';
import type { GiftConfig, PhotoItem, ThemeType } from '../types/gift';
import { DEFAULT_GIFT_CONFIG } from '../types/gift';
import { THEMES } from '../utils/themes';
import { soundManager } from '../utils/audio';
import { encodeConfigToUrl } from '../utils/storage';

import { compressImage } from '../utils/imageCompressor';

interface EditorModalProps {
  isOpen: boolean;
  config: GiftConfig;
  onClose: () => void;
  onSave: (newConfig: GiftConfig) => void;
}

type TabType = 'identity' | 'letter' | 'photos' | 'theme';

export const EditorModal: React.FC<EditorModalProps> = ({
  isOpen,
  config,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<GiftConfig>(config);
  const [activeTab, setActiveTab] = useState<TabType>('identity');
  const [copied, setCopied] = useState(false);

  // Sync internal state if config changes
  React.useEffect(() => {
    setFormData(config);
  }, [config]);

  if (!isOpen) return null;

  const handleTextChange = (field: keyof GiftConfig, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleThemeChange = (theme: ThemeType) => {
    soundManager.playClick();
    setFormData(prev => ({ ...prev, theme }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: PhotoItem[] = [];
    for (const file of Array.from(files)) {
      try {
        const compressed = await compressImage(file);
        newPhotos.push({
          id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          url: compressed,
          caption: 'Kenangan terindah bersamamu 💖',
          date: 'Momen Spesial',
          rotation: (Math.random() - 0.5) * 6
        });
      } catch (err) {
        console.error('Error compressing image', err);
      }
    }

    if (newPhotos.length > 0) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
      soundManager.playChime();
    }
  };

  const handleDeletePhoto = (id: string) => {
    soundManager.playClick();
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(p => p.id !== id)
    }));
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.map(p => p.id === id ? { ...p, caption } : p)
    }));
  };

  const handleSave = () => {
    soundManager.playChime();
    onSave(formData);
    onClose();
  };

  const handleResetToDefault = () => {
    if (window.confirm('Kembalikan semua pengaturan kado ke teks dan foto default?')) {
      setFormData(DEFAULT_GIFT_CONFIG);
      soundManager.playClick();
    }
  };

  const handleShareLink = () => {
    soundManager.playChime();
    const url = encodeConfigToUrl(formData);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } else {
      window.prompt('Salin link kado kustom ini:', url);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50 via-pink-50 to-white">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Personalisasi Kado Virtual</h3>
                <p className="text-xs text-slate-500">Sesuaikan nama, surat cinta, foto, dan tema sesuai hatimu</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-100 px-4 pt-2 bg-slate-50/70 overflow-x-auto gap-2">
            {[
              { id: 'identity', label: 'Identitas', icon: User },
              { id: 'letter', label: 'Surat & Pesan', icon: FileText },
              { id: 'photos', label: `Foto (${formData.photos.length})`, icon: ImagePlus },
              { id: 'theme', label: 'Tema & Musik', icon: Palette },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundManager.playClick();
                    setActiveTab(tab.id as TabType);
                  }}
                  className={`flex items-center gap-2 py-2.5 px-3.5 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-rose-500 text-rose-600 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Modal Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {/* TAB 1: IDENTITAS */}
            {activeTab === 'identity' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Nama Penerima 💖
                    </label>
                    <input
                      type="text"
                      value={formData.recipientName}
                      onChange={(e) => handleTextChange('recipientName', e.target.value)}
                      placeholder="Contoh: Sayangku, Adinda, Putri..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none text-sm transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Nama Pengirim 💌
                    </label>
                    <input
                      type="text"
                      value={formData.senderName}
                      onChange={(e) => handleTextChange('senderName', e.target.value)}
                      placeholder="Contoh: Rian, Pacarmu yang bawel..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none text-sm transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Judul Sambutan (Halaman 1)
                  </label>
                  <input
                    type="text"
                    value={formData.welcomeGreeting}
                    onChange={(e) => handleTextChange('welcomeGreeting', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none text-sm transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Deskripsi Sambutan (Halaman 1)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.welcomeSubtitle}
                    onChange={(e) => handleTextChange('welcomeSubtitle', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none text-sm transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Pesan Kotak Kado (Halaman 2)
                  </label>
                  <input
                    type="text"
                    value={formData.boxMessage}
                    onChange={(e) => handleTextChange('boxMessage', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none text-sm transition"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: SURAT & PESAN */}
            {activeTab === 'letter' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Judul Surat Spesial (Halaman 3)
                  </label>
                  <input
                    type="text"
                    value={formData.letterTitle}
                    onChange={(e) => handleTextChange('letterTitle', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none text-sm transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Isi Surat Cinta (Muncul dengan Animasi Ketik)
                  </label>
                  <textarea
                    rows={6}
                    value={formData.letterContent}
                    onChange={(e) => handleTextChange('letterContent', e.target.value)}
                    placeholder="Tuliskan ungkapan perasaan tulusmu di sini..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none text-sm transition leading-relaxed font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Penutup Surat (Contoh: Dengan segenap cinta,)
                    </label>
                    <input
                      type="text"
                      value={formData.letterClosing}
                      onChange={(e) => handleTextChange('letterClosing', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none text-sm transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Judul Kue & Harapan (Halaman 5)
                    </label>
                    <input
                      type="text"
                      value={formData.cakeTitle}
                      onChange={(e) => handleTextChange('cakeTitle', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none text-sm transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Pesan Akhir / Penutup (Halaman 6)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.closingMessage}
                    onChange={(e) => handleTextChange('closingMessage', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none text-sm transition"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: FOTO KENANGAN */}
            {activeTab === 'photos' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Daftar Foto Polaroid</h4>
                    <p className="text-xs text-slate-500">Unggah foto momen indah kalian untuk ditampilkan di Halaman 4</p>
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white shadow-sm transition">
                    <ImagePlus className="w-4 h-4" />
                    <span>Upload Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {formData.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex gap-3 items-center relative"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-200">
                        <img src={photo.url} alt="Thumbnail" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="block text-[10px] text-slate-400 uppercase font-semibold">
                          Caption Polaroid
                        </label>
                        <input
                          type="text"
                          value={photo.caption}
                          onChange={(e) => handleUpdateCaption(photo.id, e.target.value)}
                          className="w-full text-xs px-2 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-rose-400"
                        />
                      </div>
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition"
                        title="Hapus foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {formData.photos.length === 0 && (
                  <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                    <p className="text-sm">Belum ada foto yang diunggah.</p>
                    <p className="text-xs mt-1">Klik tombol Upload Foto di atas untuk menambahkan kenangan manis.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: TEMA & MUSIK */}
            {activeTab === 'theme' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Pilih Tema Warna Eksklusif 🎨
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.values(THEMES).map((th) => {
                      const isSelected = formData.theme === th.id;
                      return (
                        <div
                          key={th.id}
                          onClick={() => handleThemeChange(th.id)}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-center gap-3 ${
                            isSelected
                              ? 'border-rose-500 bg-rose-50/50 shadow-md'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <span className="text-2xl">{th.emoji}</span>
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-slate-800">{th.name}</p>
                            <p className="text-[11px] text-slate-500 capitalize">{th.id}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Musik Latar & Lagu Romantis 🎵
                    </label>
                    {formData.customMusicUrl && (
                      <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Lagu Kustom Aktif
                      </span>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {/* Option 1: Romantic Piano */}
                    <div 
                      onClick={() => {
                        soundManager.playClick();
                        setFormData(prev => ({ 
                          ...prev, 
                          musicTrack: 'romantic-piano',
                          customMusicUrl: undefined,
                          musicTitle: 'Melodi Piano Romantis' 
                        }));
                        soundManager.setCustomAudio(null);
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition ${
                        formData.musicTrack === 'romantic-piano' && !formData.customMusicUrl
                          ? 'border-rose-500 bg-rose-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Music className="w-4 h-4 text-rose-500" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Melodi Piano Romantis (Default)</p>
                          <p className="text-[10px] text-slate-500">Alunan melodi lembut, tenang, dan menyentuh</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundManager.toggleMusic('romantic-piano');
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                      >
                        Uji
                      </button>
                    </div>

                    {/* Option 2: Music Box */}
                    <div 
                      onClick={() => {
                        soundManager.playClick();
                        setFormData(prev => ({ 
                          ...prev, 
                          musicTrack: 'music-box',
                          customMusicUrl: undefined,
                          musicTitle: 'Kotak Musik Vintage' 
                        }));
                        soundManager.setCustomAudio(null);
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition ${
                        formData.musicTrack === 'music-box' && !formData.customMusicUrl
                          ? 'border-purple-500 bg-purple-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Kotak Musik Vintage (Music Box)</p>
                          <p className="text-[10px] text-slate-500">Suara denting khas kotak musik bernuansa kenangan</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundManager.toggleMusic('music-box');
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                      >
                        Uji
                      </button>
                    </div>

                    {/* Option 3: Upload Custom MP3 File */}
                    <div className="p-3.5 rounded-xl border-2 border-dashed border-rose-300 bg-gradient-to-r from-rose-50/40 via-pink-50/30 to-amber-50/40">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Music className="w-4 h-4 text-rose-500" />
                          <p className="text-xs font-bold text-slate-800">Gunakan Lagu MP3 Sendiri 🎧</p>
                        </div>
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-xs transition">
                          <span>Pilih File MP3</span>
                          <input
                            type="file"
                            accept="audio/*,.mp3,.m4a,.wav,.ogg"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  if (typeof reader.result === 'string') {
                                    const audioData = reader.result;
                                    setFormData(prev => ({
                                      ...prev,
                                      customMusicUrl: audioData,
                                      musicTitle: file.name.replace(/\.[^/.]+$/, ''),
                                      musicTrack: 'custom'
                                    }));
                                    soundManager.setCustomAudio(audioData);
                                    soundManager.playChime();
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>

                      {formData.customMusicUrl ? (
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-rose-200/60 text-xs">
                          <span className="text-slate-700 font-medium truncate max-w-[200px]">
                            🎵 {formData.musicTitle || 'Lagu Custom Pilihan'}
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => soundManager.toggleMusic(undefined, formData.customMusicUrl)}
                              className="px-2 py-0.5 rounded text-xs bg-white border border-rose-200 text-rose-600 font-semibold"
                            >
                              Putar
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  customMusicUrl: undefined,
                                  musicTrack: 'romantic-piano',
                                  musicTitle: 'Melodi Piano Romantis'
                                }));
                                soundManager.setCustomAudio(null);
                              }}
                              className="px-2 py-0.5 rounded text-xs text-red-500 hover:underline"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500 leading-tight">
                          Unggah lagu romantis favorit kalian (MP3/WAV/M4A) dari HP atau Laptop. Lagu akan langsung berputar otomatis saat pasangan membuka kado!
                        </p>
                      )}

                      {/* Manual Audio URL input */}
                      <div className="mt-3 pt-2 border-t border-rose-200/50">
                        <label className="block text-[10px] text-slate-500 uppercase font-semibold mb-1">
                          Atau Masukkan URL File Audio / Lokasi File Lokal:
                        </label>
                        <input
                          type="text"
                          value={formData.customMusicUrl && !formData.customMusicUrl.startsWith('data:') ? formData.customMusicUrl : ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              customMusicUrl: val || undefined,
                              musicTitle: val ? 'Lagu Kustom' : 'Melodi Piano Romantis',
                              musicTrack: val ? 'custom' : 'romantic-piano'
                            }));
                            if (val) {
                              soundManager.setCustomAudio(val);
                            }
                          }}
                          placeholder="Contoh: /music/lagu-kita.mp3 atau https://..."
                          className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-rose-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 transition"
              title="Reset ke template default"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleShareLink}
                className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition shadow-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Link Disalin!' : 'Salin Link'}</span>
              </button>

              <button
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-md shadow-rose-500/25 transition active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Simpan & Terapkan</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
