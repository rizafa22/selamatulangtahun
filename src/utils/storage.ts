import type { GiftConfig } from '../types/gift';
import { DEFAULT_GIFT_CONFIG } from '../types/gift';

const STORAGE_KEY = 'kado_virtual_config_v1';

export function saveConfigToStorage(config: GiftConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save config to localStorage', e);
  }
}

export function loadConfigFromStorage(): GiftConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_GIFT_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load config from localStorage', e);
  }
  return DEFAULT_GIFT_CONFIG;
}

// Encode config to URL safe Base64 string
export function encodeConfigToUrl(config: GiftConfig): string {
  try {
    const jsonStr = JSON.stringify(config);
    // encodeURIComponent + btoa handles utf-8 unicode properly
    const base64 = btoa(encodeURIComponent(jsonStr));
    const url = new URL(window.location.href);
    url.hash = `gift=${base64}`;
    return url.toString();
  } catch (e) {
    console.error('Error encoding config to URL', e);
    return window.location.href;
  }
}

// Decode config from URL hash
export function decodeConfigFromUrl(): GiftConfig | null {
  try {
    const hash = window.location.hash;
    if (hash && hash.includes('gift=')) {
      const base64 = hash.split('gift=')[1]?.split('&')[0];
      if (base64) {
        const jsonStr = decodeURIComponent(atob(base64));
        const parsed = JSON.parse(jsonStr);
        return { ...DEFAULT_GIFT_CONFIG, ...parsed };
      }
    }
  } catch (e) {
    console.error('Failed to parse config from URL hash', e);
  }
  return null;
}

export function getInitialConfig(): GiftConfig {
  const urlConfig = decodeConfigFromUrl();
  if (urlConfig) {
    return urlConfig;
  }
  return loadConfigFromStorage();
}
