'use client';

import { useEffect, useState, useRef } from 'react';
import { X, BookOpen, Layers, HelpCircle, Shuffle, ArrowLeft } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { lessonById } from '@/data/lessons';
import { getText, cn } from '@/lib/utils';
import type { LearningActivity } from '@/types';
import FlashcardGame from './FlashcardGame';
import QuizGame from './QuizGame';
import MatchingGame from './MatchingGame';

interface Props {
  lessonId: string | null;
  onClose: () => void;
}

type Tab = 'overview' | 'flashcards' | 'quiz' | 'matching';

const TABS: { id: Tab; labelKey: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', labelKey: 'lesson_vocab', icon: BookOpen },
  { id: 'flashcards', labelKey: 'lesson_flashcards', icon: Layers },
  { id: 'quiz', labelKey: 'lesson_quiz', icon: HelpCircle },
  { id: 'matching', labelKey: 'lesson_matching', icon: Shuffle },
];

export default function LessonModal({ lessonId, onClose }: Props) {
  const { t, lang, completeLesson, addXP } = useApp();
  const [tab, setTab] = useState<Tab>('overview');

  const lesson = lessonId ? lessonById.get(lessonId) : null;

  // Reset tab when the active lesson changes.
  // Uses the documented "setState during render based on previous prop" pattern
  // rather than setState-in-effect (which the lint rule disallows).
  const prevLessonRef = useRef<string | null>(lessonId);
  if (prevLessonRef.current !== lessonId) {
    prevLessonRef.current = lessonId;
    setTab('overview');
  }

  useEffect(() => {
    if (!lessonId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    // lock scroll
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lessonId, onClose]);

  if (!lesson) return null;

  const handleFlashcardComplete = (known: number, total: number) => {
    const xp = Math.round((known / total) * 30) + 10;
    addXP(xp, 'flashcards');
    if (known / total >= 0.6) {
      completeLesson(lesson.id, Math.round((known / total) * 100));
    }
  };

  const handleQuizComplete = (score: number, total: number) => {
    const xp = score * 15;
    addXP(xp, 'quiz');
    completeLesson(lesson.id, Math.round((score / total) * 100));
  };

  const handleMatchingComplete = (moves: number, matched: number) => {
    // XP already added inside MatchingGame
    completeLesson(lesson.id, 100);
  };

  return (
    <div
      className="fixed inset-0 z-[85] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={getText(lesson.title, lang)}
    >
      <div
        className="glass rounded-3xl border border-white/10 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onClose}
              aria-label={t('lesson_back')}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </button>
            <div className="min-w-0">
              <h2 className="text-lg font-bold truncate">
                {getText(lesson.title, lang)}
              </h2>
              <p className="text-xs text-muted-foreground truncate">
                {getText(lesson.description, lang)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t('close')}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-3 py-2 border-b border-white/5 flex gap-1 overflow-x-auto">
          {TABS.map((tb) => {
            const Icon = tb.icon;
            const active = tab === tb.id;
            const disabled = tb.id !== 'overview' && tb.id === 'matching' && !lesson.matching?.length;
            return (
              <button
                key={tb.id}
                onClick={() => !disabled && setTab(tb.id)}
                disabled={disabled}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                  active
                    ? 'bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent',
                  disabled && 'opacity-40 cursor-not-allowed'
                )}
              >
                <Icon className="w-4 h-4" />
                {t(tb.labelKey)}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'overview' && (
            <div className="space-y-5">
              {/* Content */}
              <div className="glass rounded-2xl p-4 border border-white/10">
                <p
                  className="text-sm leading-relaxed text-muted-foreground"
                  dir={lang === 'en' ? 'ltr' : 'rtl'}
                >
                  {getText(lesson.content, lang)}
                </p>
              </div>

              {/* Vocab list */}
              {lesson.vocab && lesson.vocab.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[var(--accent)]" />
                    {t('lesson_vocab')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {lesson.vocab.map((v, i) => (
                      <div
                        key={i}
                        className="glass rounded-xl p-3 border border-white/10 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="font-medium truncate" dir={lang === 'en' ? 'ltr' : 'rtl'}>
                            {getText(v.term, lang)}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {getText(v.meaning, lang)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick start CTA */}
              <div className="glass rounded-2xl p-4 border border-[var(--accent)]/20 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  {t('lessons_start')}
                </p>
                <button
                  onClick={() => setTab('flashcards')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-[#0a0a0f] text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Layers className="w-4 h-4" />
                  {t('lesson_flashcards')}
                </button>
              </div>
            </div>
          )}

          {tab === 'flashcards' && lesson.flashcards && lesson.flashcards.length > 0 && (
            <FlashcardGame
              cards={lesson.flashcards}
              lang={lang}
              onComplete={handleFlashcardComplete}
            />
          )}

          {tab === 'quiz' && lesson.quiz && lesson.quiz.length > 0 && (
            <QuizGame quiz={lesson.quiz} lang={lang} onComplete={handleQuizComplete} />
          )}

          {tab === 'matching' && lesson.matching && lesson.matching.length > 0 && (
            <MatchingGame pairs={lesson.matching} lang={lang} onComplete={handleMatchingComplete} />
          )}
        </div>
      </div>
    </div>
  );
}
