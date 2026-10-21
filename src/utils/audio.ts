// Enhanced SoundManager supporting both custom MP3 audio files & synthesized fallback melodies

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isMusicPlaying: boolean = false;
  private musicIntervalId: number | null = null;
  private currentTrack: string = 'romantic-piano';
  private masterGain: GainNode | null = null;
  private customAudio: HTMLAudioElement | null = null;

  constructor() {
    // Initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setCustomAudio(url: string | null) {
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio.src = '';
      this.customAudio = null;
    }

    if (url) {
      this.customAudio = new Audio(url);
      this.customAudio.loop = true;
      this.customAudio.volume = this.isMuted ? 0 : 0.45;
      
      // If already playing, immediately start new track
      if (this.isMusicPlaying) {
        this.stopSynthesizedMusic();
        this.customAudio.play().catch(e => console.log('Audio autoplay prevented:', e));
      }
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.35, this.ctx.currentTime);
    }
    if (this.customAudio) {
      this.customAudio.volume = muted ? 0 : 0.45;
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isMusicPlaying;
  }

  // --- Sound FX ---

  public playClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Ignored
    }
  }

  public playChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);

        const startTime = this.ctx.currentTime + idx * 0.07;
        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.65);
      });
    } catch {
      // Ignored
    }
  }

  public playGiftOpen() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const arpeggio = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
      arpeggio.forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.05);

        const startTime = this.ctx.currentTime + i * 0.05;
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.7);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.75);
      });
    } catch {
      // Ignored
    }
  }

  public playPaperRustle() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      filter.Q.setValueAtTime(2, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      whiteNoise.start();
    } catch {
      // Ignored
    }
  }

  public playBlowCandle() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const bufferSize = this.ctx.sampleRate * 0.6;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.6);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start();
    } catch {
      // Ignored
    }
  }

  public playCheer() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const chords = [
        [523.25, 659.25, 783.99],
        [587.33, 698.46, 880.00],
        [659.25, 783.99, 987.77],
        [783.99, 987.77, 1174.66, 1567.98]
      ];

      chords.forEach((chord, cIdx) => {
        chord.forEach((freq) => {
          if (!this.ctx || !this.masterGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          const startTime = this.ctx.currentTime + cIdx * 0.16;
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.12, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(startTime);
          osc.stop(startTime + 0.55);
        });
      });
    } catch {
      // Ignored
    }
  }

  // --- Background Music (MP3 or Synthesized) ---

  public startBackgroundMusic(trackName?: string, customUrl?: string) {
    if (trackName) this.currentTrack = trackName;
    if (customUrl) this.setCustomAudio(customUrl);

    this.isMusicPlaying = true;

    // If custom audio (MP3) is set, play it
    if (this.customAudio) {
      this.stopSynthesizedMusic();
      this.customAudio.play().catch(e => console.log('Custom audio autoplay prevented:', e));
      return;
    }

    // Otherwise play synthesized peaceful melody
    this.startSynthesizedMusic(this.currentTrack);
  }

  private startSynthesizedMusic(trackName: string = 'romantic-piano') {
    this.initContext();
    this.stopSynthesizedMusic();

    const melodyA = [
      { f: 523.25, d: 0.5 }, { f: 659.25, d: 0.5 }, { f: 783.99, d: 0.8 }, { f: 659.25, d: 0.4 },
      { f: 880.00, d: 0.6 }, { f: 783.99, d: 0.6 }, { f: 659.25, d: 0.8 }, { f: 587.33, d: 0.6 },
      { f: 523.25, d: 0.8 }, { f: 440.00, d: 0.5 }, { f: 493.88, d: 0.5 }, { f: 523.25, d: 1.0 },
      { f: 659.25, d: 0.6 }, { f: 587.33, d: 0.8 }, { f: 523.25, d: 1.2 }
    ];

    let noteIndex = 0;
    const playNextNote = () => {
      if (!this.isMusicPlaying || this.customAudio || !this.ctx || !this.masterGain) return;

      const note = melodyA[noteIndex % melodyA.length];
      noteIndex++;

      if (!this.isMuted) {
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = trackName === 'music-box' ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(note.f, this.ctx.currentTime);

          const duration = note.d;
          gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start();
          osc.stop(this.ctx.currentTime + duration);
        } catch {
          // Ignored
        }
      }

      this.musicIntervalId = window.setTimeout(playNextNote, note.d * 750);
    };

    playNextNote();
  }

  private stopSynthesizedMusic() {
    if (this.musicIntervalId !== null) {
      clearTimeout(this.musicIntervalId);
      this.musicIntervalId = null;
    }
  }

  public stopBackgroundMusic() {
    this.isMusicPlaying = false;
    this.stopSynthesizedMusic();
    if (this.customAudio) {
      this.customAudio.pause();
    }
  }

  public toggleMusic(trackName?: string, customUrl?: string) {
    if (this.isMusicPlaying) {
      this.stopBackgroundMusic();
    } else {
      this.startBackgroundMusic(trackName, customUrl);
    }
    return this.isMusicPlaying;
  }
}

export const soundManager = new SoundManager();
