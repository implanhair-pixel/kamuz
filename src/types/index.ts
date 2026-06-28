/**
 * Canonical type definitions for KurdAmuz.
 * Single source of truth — no duplicate types in hooks/components.
 */

export type Lang = 'en' | 'fa' | 'ku';

export interface Translations {
  [key: string]: string;
}

export interface I18nDict {
  en: Translations;
  fa: Translations;
  ku: Translations;
}

/** Localised text bag. `en` is the required fallback key. */
export interface LocalizedText {
  en: string;
  fa?: string;
  ku?: string;
  [k: string]: string | undefined;
}

export type DialectVariants = Record<string, string>;

export interface DialectInfo {
  id: string;
  name: LocalizedText;
  script: string;
  region: LocalizedText;
  speakers: string;
  description: LocalizedText;
  exampleWord: { word: string; meaning: LocalizedText };
  color: string;
  glow: string;
  border: string;
}

export interface VocabItem {
  id: string;
  en: string;
  fa: string;
  ku: string;
  /** Per-dialect variant spellings (e.g. sorani, kalhori, kurmanji). */
  dialects: DialectVariants;
  category: VocabCategory;
  difficulty: 1 | 2 | 3;
}

export type VocabCategory =
  | 'greetings'
  | 'family'
  | 'food'
  | 'numbers'
  | 'nature'
  | 'verbs'
  | 'travel'
  | 'colors';

export interface LearningPath {
  id: string;
  titleKey: string;
  descKey: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  lessonIds: string[];
  color: string;
  icon: string;
}

export interface VocabEntry {
  term: LocalizedText;
  meaning: LocalizedText;
}

export interface QuizOption {
  en: string;
  fa: string;
  ku: string;
  [k: string]: string;
}

export interface QuizItem {
  id: string;
  question: LocalizedText;
  options: QuizOption[];
  correctIndex: number;
  explanation?: LocalizedText;
}

export interface FlashcardItem {
  id: string;
  front: LocalizedText;
  back: LocalizedText;
  dialect?: LocalizedText;
}

export interface MatchingPair {
  id: string;
  term: LocalizedText;
  meaning: LocalizedText;
}

export interface Lesson {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  content: LocalizedText;
  vocab?: VocabEntry[];
  quiz?: QuizItem[];
  flashcards?: FlashcardItem[];
  matching?: MatchingPair[];
  pathId: string;
  order: number;
}

/** SRS item stored in localStorage. */
export interface SRSItem {
  vocabId: string;
  box: number; // 1..MAX_SRS_BOX (Leitner)
  nextReview: string; // ISO date (YYYY-MM-DD)
  lastReviewed: string | null;
  correctStreak: number;
  totalReviews: number;
  correctReviews: number;
  isDifficult: boolean;
}

export interface SRSReviewQueueItem {
  item: SRSItem;
  vocab: VocabItem;
}

export interface SavedWord {
  vocabId: string;
  savedAt: string;
}

export interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  lastActivityDate: string | null;
  totalCorrect: number;
  totalReviews: number;
  achievements: string[];
  xpHistory: Record<string, number>; // YYYY-MM-DD -> xp earned
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score: number | null;
  completedAt: string | null;
}

export interface ProgressState {
  lessons: Record<string, LessonProgress>;
}

export type ThemeMode = 'dark' | 'light' | 'system';
export type AccentColor = 'amber' | 'cyan' | 'purple' | 'green' | 'rose';
export type FontSize = 'sm' | 'base' | 'lg';

export interface ThemeState {
  mode: ThemeMode;
  accent: AccentColor;
  fontSize: FontSize;
  reducedMotion: boolean;
}

export interface SettingsState {
  theme: ThemeState;
  soundEnabled: boolean;
  dailyGoal: number;
}

export type LearningActivity = 'flashcards' | 'quiz' | 'matching' | 'srs' | null;
