/**
 * Application-wide constants.
 * Centralised so storage keys & config never drift between hooks.
 */

export const STORAGE_KEYS = {
  LANG: 'kurdamuz_lang',
  SETTINGS: 'kurdamuz_settings',
  PROGRESS: 'kurdamuz_progress',
  SRS: 'kurdamuz_srs',
  GAMIFICATION: 'kurdamuz_gamification',
  SAVED_WORDS: 'kurdamuz_saved_words',
} as const;

export const APP_NAME = 'KurdAmuz';
export const APP_TAGLINE_EN = 'Learn Kurdish — Sorani, Kalhori & Kurmanji';

/** SRS algorithm constants (Leitner-style boxes). */
export const SRS_STAGES = [
  { box: 1, intervalDays: 0 }, // review same session
  { box: 2, intervalDays: 1 },
  { box: 3, intervalDays: 3 },
  { box: 4, intervalDays: 7 },
  { box: 5, intervalDays: 14 },
  { box: 6, intervalDays: 30 },
  { box: 7, intervalDays: 90 },
] as const;

export const MAX_SRS_BOX = SRS_STAGES.length;

/** Gamification config. */
export const XP_PER_CORRECT = 10;
export const XP_PER_LESSON_COMPLETE = 50;
export const XP_PER_STREAK_DAY = 5;
export const DAILY_GOAL_XP = 100;

export const ACCENT_COLORS = [
  'amber',
  'cyan',
  'purple',
  'green',
  'rose',
] as const;

export type AccentColor = (typeof ACCENT_COLORS)[number];
