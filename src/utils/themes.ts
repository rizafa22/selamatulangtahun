import type { ThemeType } from '../types/gift';

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  emoji: string;
  bgGradient: string;
  bgOverlay: string;
  primaryButton: string;
  secondaryButton: string;
  accentBadge: string;
  textTitle: string;
  textSubtitle: string;
  cardBg: string;
  particleColors: string[];
  ribbonColor: string;
}

export const THEMES: Record<ThemeType, ThemeConfig> = {
  rose: {
    id: 'rose',
    name: 'Romantic Pink Pastel',
    emoji: '🌸',
    bgGradient: 'from-rose-100 via-pink-50 to-amber-50',
    bgOverlay: 'radial-gradient(ellipse at 50% 20%, rgba(254, 205, 211, 0.45) 0%, rgba(253, 242, 248, 0.2) 100%)',
    primaryButton: 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white shadow-rose-300/60',
    secondaryButton: 'bg-white/80 hover:bg-white text-rose-700 border-rose-200/80 shadow-rose-200/40',
    accentBadge: 'bg-rose-100/90 text-rose-700 border-rose-200',
    textTitle: 'from-rose-600 via-pink-600 to-rose-500',
    textSubtitle: 'text-rose-900/80',
    cardBg: 'bg-white/75 border-rose-100/80 shadow-rose-200/30',
    particleColors: ['#f43f5e', '#ec4899', '#fda4af', '#f472b6', '#fb7185', '#ffffff'],
    ribbonColor: '#e11d48'
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender Dream',
    emoji: '💜',
    bgGradient: 'from-purple-100 via-violet-50 to-indigo-50',
    bgOverlay: 'radial-gradient(ellipse at 50% 20%, rgba(233, 213, 255, 0.5) 0%, rgba(243, 232, 255, 0.2) 100%)',
    primaryButton: 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-500 hover:from-violet-700 hover:to-purple-700 text-white shadow-purple-300/60',
    secondaryButton: 'bg-white/80 hover:bg-white text-violet-700 border-violet-200/80 shadow-violet-200/40',
    accentBadge: 'bg-purple-100/90 text-purple-700 border-purple-200',
    textTitle: 'from-violet-700 via-purple-600 to-indigo-600',
    textSubtitle: 'text-violet-900/80',
    cardBg: 'bg-white/75 border-purple-100/80 shadow-purple-200/30',
    particleColors: ['#a855f7', '#8b5cf6', '#c084fc', '#e9d5ff', '#ddd6fe', '#ffffff'],
    ribbonColor: '#7c3aed'
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Peach',
    emoji: '🌅',
    bgGradient: 'from-amber-100 via-orange-50 to-rose-100',
    bgOverlay: 'radial-gradient(ellipse at 50% 20%, rgba(254, 215, 170, 0.45) 0%, rgba(255, 237, 213, 0.2) 100%)',
    primaryButton: 'bg-gradient-to-r from-orange-500 via-amber-500 to-rose-400 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-300/60',
    secondaryButton: 'bg-white/80 hover:bg-white text-orange-700 border-orange-200/80 shadow-orange-200/40',
    accentBadge: 'bg-orange-100/90 text-orange-700 border-orange-200',
    textTitle: 'from-orange-600 via-rose-500 to-amber-600',
    textSubtitle: 'text-orange-950/80',
    cardBg: 'bg-white/75 border-orange-100/80 shadow-orange-200/30',
    particleColors: ['#f97316', '#fb923c', '#f43f5e', '#fdba74', '#fef08a', '#ffffff'],
    ribbonColor: '#ea580c'
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Starlight',
    emoji: '🌌',
    bgGradient: 'from-slate-950 via-purple-950 to-slate-900 text-slate-100',
    bgOverlay: 'radial-gradient(ellipse at 50% 20%, rgba(147, 51, 234, 0.25) 0%, rgba(15, 23, 42, 0.6) 100%)',
    primaryButton: 'bg-gradient-to-r from-fuchsia-600 via-pink-600 to-purple-600 hover:from-fuchsia-500 hover:to-pink-500 text-white shadow-fuchsia-500/40',
    secondaryButton: 'bg-slate-800/80 hover:bg-slate-800 text-purple-200 border-purple-800/60 shadow-purple-950/50',
    accentBadge: 'bg-purple-950/80 text-purple-300 border-purple-700/60',
    textTitle: 'from-pink-300 via-purple-200 to-indigo-200',
    textSubtitle: 'text-purple-200/80',
    cardBg: 'bg-slate-900/80 border-purple-500/20 shadow-purple-900/40 text-slate-100',
    particleColors: ['#e879f9', '#c084fc', '#f472b6', '#38bdf8', '#fbbf24', '#ffffff'],
    ribbonColor: '#c026d3'
  }
};
