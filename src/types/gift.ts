export type ThemeType = 'rose' | 'lavender' | 'sunset' | 'midnight';

export interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  date?: string;
  rotation?: number;
}

export interface GiftConfig {
  recipientName: string;
  senderName: string;
  welcomeGreeting: string;
  welcomeSubtitle: string;
  boxMessage: string;
  letterTitle: string;
  letterContent: string;
  letterClosing: string;
  photos: PhotoItem[];
  cakeTitle: string;
  cakeMessage: string;
  closingTitle: string;
  closingMessage: string;
  theme: ThemeType;
  musicTrack: string;
  customMusicUrl?: string;
  musicTitle?: string;
  enableSoundEffects: boolean;
  anniversaryDate?: string;
}

export const DEFAULT_GIFT_CONFIG: GiftConfig = {
  recipientName: "Bidadariku",
  senderName: "Orang yang selalu menyayangimu",
  welcomeGreeting: "Hai, ada sesuatu spesial buat kamu 💗",
  welcomeSubtitle: "Setiap detik bersamamu adalah anugerah terindah. Website kecil ini dibuat khusus untuk merayakan kehadiranmu.",
  boxMessage: "Kotak ini menyimpan seikat rasa, senyuman, dan kenangan kita. Ketuk untuk membukanya!",
  letterTitle: "Untuk Kamu yang Paling Berharga",
  letterContent: "Terima kasih sudah hadir dan melukiskan warna-warni terindah di dalam hidupku. Bersamamu, hal-hal sederhana berubah menjadi begitu istimewa.\n\nSemoga hari-harimu selalu dilingkupi kebahagiaan, tawa yang tulus, dan kesehatan yang berlimpah. Jangan pernah lupa bahwa kamu sangat dicintai, hari ini, esok, dan seterusnya. 🌸",
  letterClosing: "Dengan segenap cinta,",
  photos: [
    {
      id: "photo-1",
      url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
      caption: "Hari pertama kita tertawa lepas bareng ☕",
      date: "Momen Tak Terlupakan",
      rotation: -2
    },
    {
      id: "photo-2",
      url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
      caption: "Senyuman manismu yang selalu bikin tenang ✨",
      date: "Sunset Terindah",
      rotation: 3
    },
    {
      id: "photo-3",
      url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      caption: "Jalan santai di sore yang penuh cerita 🌷",
      date: "Kenangan Manis",
      rotation: -1
    },
    {
      id: "photo-4",
      url: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=800&q=80",
      caption: "Selalu bersyukur memiliki kamu di sampingku 💫",
      date: "Untuk Selamanya",
      rotation: 2
    }
  ],
  cakeTitle: "Tiup Lilin & Buat Harapanmu 🎂",
  cakeMessage: "Tutup matamu sejenak, bisikkan harapan terbaikmu dalam hati, lalu tiup lilin ini dengan penuh keyakinan bahwa semua impianmu akan terkabul.",
  closingTitle: "Terima Kasih Sudah Menjadi Bagian Terindah 💖",
  closingMessage: "Semoga hadiah digital kecil ini bisa mengukir senyuman hangat di wajahmu. Apapun yang terjadi nanti, ingatlah kamu selalu punya rumah di sini.",
  theme: 'rose',
  musicTrack: 'romantic-piano',
  enableSoundEffects: true,
  anniversaryDate: "2024-02-14"
};
