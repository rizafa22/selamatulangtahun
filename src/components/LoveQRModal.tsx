import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import { X, Download, Share2, Sparkles, Check, Globe } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface LoveQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
  recipientName: string;
}

export const LoveQRModal: React.FC<LoveQRModalProps> = ({
  isOpen,
  onClose,
  url,
  recipientName
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrColor, setQrColor] = useState<'rose' | 'magenta' | 'purple'>('rose');
  
  // Clean URL for QR scanning (phones need a clean web link that fits in QR code without overflowing)
  const defaultCleanUrl = typeof window !== 'undefined' 
    ? (window.location.origin + window.location.pathname) 
    : 'http://localhost:5173';

  const [targetUrl, setTargetUrl] = useState<string>(defaultCleanUrl);

  const colorPalettes = {
    rose: { dark: '#e11d48', light: '#ffffff', name: 'Rose Pink 🌸' },
    magenta: { dark: '#db2777', light: '#ffffff', name: 'Hot Pink 💖' },
    purple: { dark: '#9333ea', light: '#ffffff', name: 'Lavender 💜' }
  };

  // Sync target URL when modal opens
  useEffect(() => {
    if (isOpen) {
      // Use clean URL without long hash by default so QR code never overflows
      const clean = window.location.origin + window.location.pathname;
      setTargetUrl(clean);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const selectedColor = colorPalettes[qrColor];
    
    // Choose what string to encode: if targetUrl is too long (>1000 chars), fall back to base URL
    let dataToEncode = targetUrl.trim() || defaultCleanUrl;
    if (dataToEncode.length > 1100) {
      dataToEncode = window.location.origin + window.location.pathname;
    }

    // Generate QR Code on canvas
    QRCode.toCanvas(
      canvas,
      dataToEncode,
      {
        width: 230,
        margin: 2,
        errorCorrectionLevel: 'M', // Medium error correction allows center logo and high density
        color: {
          dark: selectedColor.dark,
          light: selectedColor.light
        }
      },
      (error) => {
        if (error) {
          console.error('Error generating QR Code, attempting fallback to base url:', error);
          // Fallback to base origin
          QRCode.toCanvas(canvas, window.location.origin, {
            width: 230,
            margin: 2,
            color: { dark: selectedColor.dark, light: '#ffffff' }
          });
          return;
        }

        // Draw Heart Icon in the center of the QR canvas
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const center = canvas.width / 2;
          const radius = 22;

          // Draw round circle backdrop
          ctx.beginPath();
          ctx.arc(center, center, radius, 0, 2 * Math.PI);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = selectedColor.dark;
          ctx.stroke();

          // Draw Heart Emoji in center
          ctx.font = '22px "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('💖', center, center + 2);
        }
      }
    );
  }, [isOpen, targetUrl, qrColor, defaultCleanUrl]);

  if (!isOpen) return null;

  const handleDownloadQR = () => {
    soundManager.playChime();
    if (!canvasRef.current) return;

    // Create a composite printable card canvas
    const sourceCanvas = canvasRef.current;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 420;
    exportCanvas.height = 560;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 420, 560);
    gradient.addColorStop(0, '#ffe4e6'); // rose-100
    gradient.addColorStop(0.5, '#fce7f3'); // pink-100
    gradient.addColorStop(1, '#fef3c7'); // amber-100
    ctx.fillStyle = gradient;
    ctx.roundRect(0, 0, 420, 560, 32);
    ctx.fill();

    // White card in center
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(225, 29, 72, 0.25)';
    ctx.shadowBlur = 25;
    ctx.shadowOffsetY = 10;
    ctx.roundRect(24, 24, 372, 512, 24);
    ctx.fill();
    ctx.shadowColor = 'transparent'; // Reset shadow

    // Header Title
    ctx.fillStyle = colorPalettes[qrColor].dark;
    ctx.font = 'bold 24px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Kado Spesial Untukmu 🎁', 210, 80);

    // Subtitle
    ctx.fillStyle = '#64748b';
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Khusus untuk ${recipientName || 'Sayang'}`, 210, 110);

    // Draw QR in center
    ctx.drawImage(sourceCanvas, 95, 140, 230, 230);

    // Bottom Instructions
    ctx.fillStyle = colorPalettes[qrColor].dark;
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Scan Barcode Ini Lewat Kamera HP 📸', 210, 420);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Buka kamera HP untuk membuka website kado', 210, 445);

    // Bottom Love signature
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'italic 18px "Caveat", cursive';
    ctx.fillText('Dibuat dengan segenap cinta & rasa 💖', 210, 490);

    // Trigger download
    const link = document.createElement('a');
    link.download = `QR-Love-${recipientName || 'Kado'}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyLink = () => {
    soundManager.playChime();
    const linkToCopy = targetUrl || url || defaultCleanUrl;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(linkToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } else {
      window.prompt('Salin link kado:', linkToCopy);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl relative border border-rose-100 flex flex-col items-center text-center max-h-[95vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>QR Code Hadiah Pink Love</span>
          </div>

          <h3 className="text-xl font-extrabold text-slate-800 font-serif-title mb-1">
            Barcode Kado Cinta 💖
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            Bisa di-print pada kartu ucapan, kotak kado fisik, atau dikirim langsung ke pasangan!
          </p>

          {/* Color Palette Switcher */}
          <div className="flex gap-2 mb-3">
            {(['rose', 'magenta', 'purple'] as const).map((color) => (
              <button
                key={color}
                onClick={() => {
                  soundManager.playClick();
                  setQrColor(color);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                  qrColor === color
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {colorPalettes[color].name}
              </button>
            ))}
          </div>

          {/* PRINTABLE CARD PREVIEW */}
          <div className="w-full p-3.5 rounded-2xl bg-gradient-to-tr from-rose-100/60 via-pink-50/80 to-amber-50/60 border-2 border-rose-200/70 shadow-lg relative flex flex-col items-center mb-4">
            {/* Top mini ribbon */}
            <div className="absolute -top-3 w-10 h-5 bg-rose-500 rounded-sm shadow-xs flex items-center justify-center text-[10px] text-white font-bold">
              🎀
            </div>

            {/* QR Canvas Container */}
            <div className="p-2.5 bg-white rounded-xl shadow-md border border-rose-100 relative min-w-[230px] min-h-[230px] flex items-center justify-center">
              <canvas ref={canvasRef} className="rounded-lg block" />
            </div>

            <p className="font-handwriting text-base font-bold text-rose-600 mt-2">
              Spesial untuk {recipientName || 'Kamu'} 💖
            </p>
            <p className="text-[10px] text-slate-500">
              Arahkan kamera HP ke barcode untuk membuka kado
            </p>
          </div>

          {/* Target URL input so user can put their deployed URL or local IP */}
          <div className="w-full mb-3 text-left">
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Globe className="w-3 h-3 text-rose-500" />
              <span>Link Website yang di-scan QR:</span>
            </label>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://..."
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-rose-400 font-mono text-slate-700"
            />
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-2">
            <button
              onClick={handleDownloadQR}
              className="w-full py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-md shadow-rose-500/25 transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download Kartu QR (PNG)</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full py-2 px-4 rounded-full font-semibold text-xs flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Berhasil Disalin!' : 'Salin Link Website'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
