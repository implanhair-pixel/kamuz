'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import type {
  Lang,
  ThemeState,
  AccentColor,
  ThemeMode,
  FontSize,
  GamificationState,
  ProgressState,
  SRSItem,
  SavedWord,
} from '@/types';
import { en, fa, ku } from '@/i18n';
import { STORAGE_KEYS, XP_PER_CORRECT, DAILY_GOAL_XP } from '@/lib/constants';
import { lsGet, lsSet, todayISODate } from '@/lib/utils';
import { vocabulary, vocabById } from '@/data/vocabulary';
import { SRS_STAGES, MAX_SRS_BOX } from '@/lib/constants';

/* ────────────────────────────────────────────────────────────────
 * i18n
 * ──────────────────────────────────────────────────────────────── */

const dict = { en, fa, ku };

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const saved = window.localStorage.getItem(STORAGE_KEYS.LANG) as Lang | null;
  if (saved && ['en', 'fa', 'ku'].includes(saved)) return saved;
  // Auto-detect from browser
  const nav = navigator.language.slice(0, 2);
  if (nav === 'fa') return 'fa';
  if (nav === 'ckb' || nav === 'ku') return 'ku';
  return 'en';
}

/* ────────────────────────────────────────────────────────────────
 * Theme
 * ──────────────────────────────────────────────────────────────── */

const DEFAULT_THEME: ThemeState = {
  mode: 'dark',
  accent: 'amber',
  fontSize: 'base',
  reducedMotion: false,
};

const ACCENT_HEX: Record<AccentColor, string> = {
  amber: '#f59e0b',
  cyan: '#22d3ee',
  purple: '#a78bfa',
  green: '#4ade80',
  rose: '#fb7185',
};

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveMode(mode: ThemeMode): 'dark' | 'light' {
  return mode === 'system' ? getSystemTheme() : mode;
}

function applyThemeToDom(theme: ThemeState): 'dark' | 'light' {
  const resolved = resolveMode(theme.mode);
  if (typeof document === 'undefined') return resolved;
  const html = document.documentElement;
  const body = document.body;
  html.classList.toggle('dark', resolved === 'dark');
  html.classList.toggle('light', resolved === 'light');
  body.classList.toggle('dark', resolved === 'dark');
  body.classList.toggle('light', resolved === 'light');
  const accent = ACCENT_HEX[theme.accent];
  body.style.setProperty('--accent', accent);
  body.style.setProperty('--accent-rgb', hexToRgb(accent));
  body.style.fontSize = theme.fontSize === 'sm' ? '14px' : theme.fontSize === 'lg' ? '18px' : '16px';
  body.classList.toggle('reduce-motion', theme.reducedMotion);
  return resolved;
}

function hexToRgb(hex: string): string {
  const m = hex.replace('#', '').match(/.{2}/g);
  if (!m) return '245, 158, 11';
  return m.map((x) => parseInt(x, 16)).join(', ');
}

/* ────────────────────────────────────────────────────────────────
 * Gamification
 * ──────────────────────────────────────────────────────────────── */

const DEFAULT_GAMIFICATION: GamificationState = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActivityDate: null,
  totalCorrect: 0,
  totalReviews: 0,
  achievements: [],
  xpHistory: {},
};

function levelFromXp(xp: number): number {
  // Level n requires 100 * n * (n-1) / 2 XP cumulative (triangular)
  return Math.max(1, Math.floor((1 + Math.sqrt(1 + 8 * (xp / 50))) / 2));
}

function levelProgress(xp: number): { current: number; needed: number; pct: number } {
  const level = levelFromXp(xp);
  const cumForLevel = (50 * level * (level - 1)) / 2;
  const cumForNext = (50 * level * (level + 1)) / 2;
  const current = xp - cumForLevel;
  const needed = cumForNext - cumForLevel;
  return { current, needed, pct: Math.min(100, (current / needed) * 100) };
}

/* ────────────────────────────────────────────────────────────────
 * SRS
 * ──────────────────────────────────────────────────────────────── */

function newSRSItem(vocabId: string): SRSItem {
  return {
    vocabId,
    box: 1,
    nextReview: todayISODate(),
    lastReviewed: null,
    correctStreak: 0,
    totalReviews: 0,
    correctReviews: 0,
    isDifficult: false,
  };
}

function advanceSRS(item: SRSItem, correct: boolean): SRSItem {
  const next: SRSItem = {
    ...item,
    lastReviewed: todayISODate(),
    totalReviews: item.totalReviews + 1,
  };
  if (correct) {
    next.box = Math.min(MAX_SRS_BOX, item.box + 1);
    next.correctStreak = item.correctStreak + 1;
    next.correctReviews = item.correctReviews + 1;
    next.isDifficult = item.correctStreak + 1 >= 3 ? false : item.isDifficult;
  } else {
    next.box = Math.max(1, Math.floor(item.box / 2));
    next.correctStreak = 0;
    next.isDifficult = true;
  }
  const stage = SRS_STAGES[next.box - 1];
  const d = new Date();
  d.setDate(d.getDate() + stage.intervalDays);
  const tz = d.getTimezoneOffset() * 60000;
  next.nextReview = new Date(d.getTime() - tz).toISOString().slice(0, 10);
  return next;
}

/* ────────────────────────────────────────────────────────────────
 * XP Toast events
 * ──────────────────────────────────────────────────────────────── */

export interface XPToastData {
  id: number;
  amount: number;
  reason: string;
}

/* ────────────────────────────────────────────────────────────────
 * Context type
 * ──────────────────────────────────────────────────────────────── */

interface AppContextValue {
  // i18n
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
  dir: 'ltr' | 'rtl';

  // theme
  theme: ThemeState;
  resolvedMode: 'dark' | 'light';
  setTheme: (updates: Partial<ThemeState>) => void;

  // gamification
  gamification: GamificationState;
  level: number;
  levelProgress: { current: number; needed: number; pct: number };
  addXP: (amount: number, reason: string) => void;
  recordAnswer: (correct: boolean) => void;
  checkStreak: () => void;
  xpToasts: XPToastData[];
  dismissXPToast: (id: number) => void;

  // progress
  progress: ProgressState;
  completeLesson: (lessonId: string, score: number) => void;
  isLessonCompleted: (lessonId: string) => boolean;

  // SRS
  srsItems: Record<string, SRSItem>;
  dueQueue: SRSItem[];
  reviewSRS: (vocabId: string, correct: boolean) => void;
  addNewSRSWords: (count: number) => void;
  resetSRS: () => void;

  // saved words
  savedWords: SavedWord[];
  toggleSavedWord: (vocabId: string) => void;
  isSaved: (vocabId: string) => boolean;

  // settings
  resetAll: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

/* ────────────────────────────────────────────────────────────────
 * Provider
 * ──────────────────────────────────────────────────────────────── */

export function AppProvider({ children }: { children: ReactNode }) {
  /* ── i18n ── */
  const [lang, setLangState] = useState<Lang>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLangState(getInitialLang());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    html.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');
    html.setAttribute('lang', lang === 'ku' ? 'ckb' : lang);
    window.localStorage.setItem(STORAGE_KEYS.LANG, lang);
  }, [lang, mounted]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const translated = dict[lang]?.[key] ?? dict.en[key];
      let result = translated ?? '';
      if (!translated && process.env.NODE_ENV === 'development') {
        console.warn(`[i18n] missing key "${key}" in ${lang}`);
      }
      if (params) {
        result = result.replace(/\{\{(\w+)\}\}/g, (_, k) =>
          params[k] !== undefined ? String(params[k]) : `{{${k}}}`
        );
      }
      return result;
    },
    [lang]
  );

  const isRTL = lang !== 'en';
  const dir = lang === 'en' ? 'ltr' : 'rtl';

  /* ── theme ── */
  const [theme, setThemeState] = useState<ThemeState>(DEFAULT_THEME);
  const [resolvedMode, setResolvedMode] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (!mounted) return;
    const saved = lsGet<Partial<ThemeState> | null>(STORAGE_KEYS.SETTINGS, null);
    if (saved && typeof saved === 'object') {
      setThemeState({ ...DEFAULT_THEME, ...saved });
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const r = applyThemeToDom(theme);
    setResolvedMode(r);
    lsSet(STORAGE_KEYS.SETTINGS, theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (theme.mode !== 'system' || !mounted) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setResolvedMode(getSystemTheme());
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme.mode, mounted]);

  const setTheme = useCallback((updates: Partial<ThemeState>) => {
    setThemeState((prev) => ({ ...prev, ...updates }));
  }, []);

  /* ── gamification ── */
  const [gamification, setGamification] = useState<GamificationState>(DEFAULT_GAMIFICATION);
  const [xpToasts, setXpToasts] = useState<XPToastData[]>([]);
  const toastIdRef = useRef(0);

  useEffect(() => {
    if (!mounted) return;
    setGamification(lsGet<GamificationState>(STORAGE_KEYS.GAMIFICATION, DEFAULT_GAMIFICATION));
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    lsSet(STORAGE_KEYS.GAMIFICATION, gamification);
  }, [gamification, mounted]);

  const pushXPToast = useCallback((amount: number, reason: string) => {
    const id = ++toastIdRef.current;
    setXpToasts((prev) => [...prev, { id, amount, reason }]);
    // auto-dismiss after 3s
    setTimeout(() => {
      setXpToasts((prev) => prev.filter((x) => x.id !== id));
    }, 3000);
  }, []);

  const dismissXPToast = useCallback((id: number) => {
    setXpToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const checkStreak = useCallback(() => {
    setGamification((prev) => {
      const today = todayISODate();
      if (prev.lastActivityDate === today) return prev; // already counted today
      let streak = prev.streak;
      if (prev.lastActivityDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yIso = yesterday.toISOString().slice(0, 10);
        if (prev.lastActivityDate === yIso) {
          streak = prev.streak + 1;
        } else {
          streak = 1; // reset
        }
      } else {
        streak = 1;
      }
      return { ...prev, streak, lastActivityDate: today };
    });
  }, []);

  const addXP = useCallback(
    (amount: number, reason: string) => {
      setGamification((prev) => {
        const today = todayISODate();
        const xpHistory = { ...prev.xpHistory };
        xpHistory[today] = (xpHistory[today] || 0) + amount;
        const xp = prev.xp + amount;
        const level = levelFromXp(xp);
        let achievements = prev.achievements;
        if (level > prev.level) {
          // level up
        }
        if (xp >= 100 && !achievements.includes('achievement_100_words')) {
          // handled elsewhere based on mastered count
        }
        return { ...prev, xp, level, xpHistory };
      });
      pushXPToast(amount, reason);
      checkStreak();
    },
    [pushXPToast, checkStreak]
  );

  const recordAnswer = useCallback((correct: boolean) => {
    setGamification((prev) => ({
      ...prev,
      totalReviews: prev.totalReviews + 1,
      totalCorrect: prev.totalCorrect + (correct ? 1 : 0),
    }));
  }, []);

  /* ── progress ── */
  const [progress, setProgress] = useState<ProgressState>({ lessons: {} });

  useEffect(() => {
    if (!mounted) return;
    setProgress(lsGet<ProgressState>(STORAGE_KEYS.PROGRESS, { lessons: {} }));
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    lsSet(STORAGE_KEYS.PROGRESS, progress);
  }, [progress, mounted]);

  const completeLesson = useCallback(
    (lessonId: string, score: number) => {
      setProgress((prev) => ({
        ...prev,
        lessons: {
          ...prev.lessons,
          [lessonId]: {
            lessonId,
            completed: true,
            score: Math.max(prev.lessons[lessonId]?.score ?? 0, score),
            completedAt: todayISODate(),
          },
        },
      }));
    },
    []
  );

  const isLessonCompleted = useCallback(
    (lessonId: string) => !!progress.lessons[lessonId]?.completed,
    [progress.lessons]
  );

  /* ── SRS ── */
  const [srsItems, setSrsItems] = useState<Record<string, SRSItem>>({});

  useEffect(() => {
    if (!mounted) return;
    setSrsItems(lsGet<Record<string, SRSItem>>(STORAGE_KEYS.SRS, {}));
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    lsSet(STORAGE_KEYS.SRS, srsItems);
  }, [srsItems, mounted]);

  const dueQueue = useMemo(() => {
    const today = todayISODate();
    return Object.values(srsItems).filter((i) => i.nextReview <= today);
  }, [srsItems]);

  const reviewSRS = useCallback(
    (vocabId: string, correct: boolean) => {
      setSrsItems((prev) => {
        const item = prev[vocabId] ?? newSRSItem(vocabId);
        return { ...prev, [vocabId]: advanceSRS(item, correct) };
      });
      recordAnswer(correct);
      if (correct) addXP(XP_PER_CORRECT, 'srs');
    },
    [recordAnswer, addXP]
  );

  const addNewSRSWords = useCallback(
    (count: number) => {
      setSrsItems((prev) => {
        const existing = new Set(Object.keys(prev));
        const candidates = vocabulary.filter((v) => !existing.has(v.id)).slice(0, count);
        const next = { ...prev };
        for (const v of candidates) {
          next[v.id] = newSRSItem(v.id);
        }
        return next;
      });
    },
    []
  );

  const resetSRS = useCallback(() => setSrsItems({}), []);

  /* ── saved words ── */
  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);

  useEffect(() => {
    if (!mounted) return;
    setSavedWords(lsGet<SavedWord[]>(STORAGE_KEYS.SAVED_WORDS, []));
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    lsSet(STORAGE_KEYS.SAVED_WORDS, savedWords);
  }, [savedWords, mounted]);

  const toggleSavedWord = useCallback((vocabId: string) => {
    setSavedWords((prev) => {
      const exists = prev.some((w) => w.vocabId === vocabId);
      if (exists) return prev.filter((w) => w.vocabId !== vocabId);
      return [...prev, { vocabId, savedAt: todayISODate() }];
    });
  }, []);

  const isSaved = useCallback(
    (vocabId: string) => savedWords.some((w) => w.vocabId === vocabId),
    [savedWords]
  );

  /* ── reset all ── */
  const resetAll = useCallback(() => {
    setGamification(DEFAULT_GAMIFICATION);
    setProgress({ lessons: {} });
    setSrsItems({});
    setSavedWords([]);
    Object.values(STORAGE_KEYS).forEach((k) => window.localStorage.removeItem(k));
  }, []);

  const level = levelFromXp(gamification.xp);
  const lp = levelProgress(gamification.xp);

  const value: AppContextValue = {
    lang,
    setLang,
    t,
    isRTL,
    dir,
    theme,
    resolvedMode,
    setTheme,
    gamification,
    level,
    levelProgress: lp,
    addXP,
    recordAnswer,
    checkStreak,
    xpToasts,
    dismissXPToast,
    progress,
    completeLesson,
    isLessonCompleted,
    srsItems,
    dueQueue,
    reviewSRS,
    addNewSRSWords,
    resetSRS,
    savedWords,
    toggleSavedWord,
    isSaved,
    resetAll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

/* Convenience sub-hooks for ergonomic imports */
export function useI18n() {
  const { lang, setLang, t, isRTL, dir } = useApp();
  return { lang, setLang, t, isRTL, dir };
}

export function useTheme() {
  const { theme, resolvedMode, setTheme } = useApp();
  return { theme, resolvedMode, setTheme };
}

export function useGamification() {
  const { gamification, level, levelProgress, addXP, recordAnswer, checkStreak } = useApp();
  return { gamification, level, levelProgress, addXP, recordAnswer, checkStreak };
}
