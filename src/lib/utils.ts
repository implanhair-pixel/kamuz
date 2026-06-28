import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Lang } from '@/types';

/** Tailwind class merge helper (shadcn convention). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Localised text bag — must contain at least an `en` key. */
export type TextObject = { en: string; fa?: string; ku?: string; [k: string]: string | undefined };

/** Extract localised text; falls back to `en`, then empty string. */
export function getText(obj: TextObject | undefined, lang: Lang): string {
  if (!obj) return '';
  return (obj[lang] ?? obj['en'] ?? '').toString();
}

/** Font class per language for proper script rendering. */
export function getFontClass(lang: Lang): string {
  switch (lang) {
    case 'fa':
      return 'font-fa';
    case 'ku':
      return 'font-ku';
    default:
      return 'font-en';
  }
}

/** HTML dir for a language. */
export function getDir(lang: Lang): 'ltr' | 'rtl' {
  return lang === 'en' ? 'ltr' : 'rtl';
}

/** HTML lang code for a language (Kurdish → ckb for better font matching). */
export function getHtmlLang(lang: Lang): string {
  return lang === 'ku' ? 'ckb' : lang;
}

/** Open Graph locale code. */
export function getOgLocale(lang: Lang): string {
  switch (lang) {
    case 'fa':
      return 'fa_IR';
    case 'ku':
      return 'ckb';
    default:
      return 'en_US';
  }
}

/** Format a number with thousands separators. */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

/** Clamp a number between min and max. */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

/** Days between two ISO date strings (positive = future). */
export function daysBetween(isoA: string, isoB: string): number {
  const a = new Date(isoA).getTime();
  const b = new Date(isoB).getTime();
  return Math.round((a - b) / (1000 * 60 * 60 * 24));
}

/** Today's date as YYYY-MM-DD (local). */
export function todayISODate(): string {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

/** Safe localStorage JSON get with fallback. */
export function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Safe localStorage JSON set. */
export function lsSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode — ignore */
  }
}

/** Shuffle an array (Fisher-Yates, non-mutating). */
export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
