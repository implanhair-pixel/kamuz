'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Check, X, RotateCcw, Trophy, ChevronRight } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { QuizItem, Lang } from '@/types';
import { getText, cn, shuffle } from '@/lib/utils';

interface Props {
  quiz: QuizItem[];
  lang: Lang;
  onComplete?: (score: number, total: number) => void;
}

export default function QuizGame({ quiz, lang, onComplete }: Props) {
  const { t, addXP, recordAnswer } = useApp();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const current = quiz[index];

  const handleSelect = useCallback(
    (i: number) => {
      if (answered) return;
      setSelected(i);
      setAnswered(true);
      const correct = i === current.correctIndex;
      recordAnswer(correct);
      if (correct) {
        setScore((s) => s + 1);
        addXP(10, 'quiz');
      }
    },
    [answered, current.correctIndex, recordAnswer, addXP]
  );

  const handleNext = useCallback(() => {
    if (index + 1 < quiz.length) {
      setIndex((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  }, [index, quiz.length]);

  // Finish → notify
  useEffect(() => {
    if (finished) {
      onCompleteRef.current?.(score, quiz.length);
    }
  }, [finished, score, quiz.length]);

  const handleRestart = useCallback(() => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswered(false);
  }, []);

  if (finished) {
    const pct = Math.round((score / quiz.length) * 100);
    const perfect = score === quiz.length;
    return (
      <div className="glass rounded-2xl p-8 text-center border border-[var(--accent)]/20">
        <div
          className={cn(
            'w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center',
            perfect
              ? 'bg-[var(--accent)]/15 border border-[var(--accent)]/40'
              : 'bg-white/5 border border-white/10'
          )}
        >
          <Trophy className={cn('w-10 h-10', perfect ? 'text-[var(--accent)]' : 'text-muted-foreground')} aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold mb-2">{t('lesson_complete')}</h3>
        <p className="text-2xl font-bold text-[var(--accent)] mb-1">
          {t('quiz_score', { score, total: quiz.length })}
        </p>
        <p className="text-sm text-muted-foreground mb-4">{pct}%</p>
        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 text-sm font-medium hover:bg-[var(--accent)]/20 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {t('quiz_restart')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {t('quiz_question', { index: index + 1, total: quiz.length })}
        </span>
        <span className="text-xs text-[var(--accent)]">
          {t('lesson_score')}: {score}
        </span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-300"
          style={{ width: `${((index + 1) / quiz.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="glass rounded-2xl p-5 border border-white/10">
        <p
          className="text-lg font-semibold leading-relaxed"
          dir={lang === 'en' ? 'ltr' : 'rtl'}
          lang={lang === 'ku' ? 'ckb' : lang}
        >
          {getText(current.question, lang)}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {current.options.map((opt, i) => {
          const isCorrect = i === current.correctIndex;
          const isSelected = i === selected;
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={cn(
                'w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3',
                !answered &&
                  'glass border-white/10 hover:border-[var(--accent)]/40 hover:bg-white/5 cursor-pointer',
                answered && isCorrect && 'bg-green-500/10 border-green-500/40 text-green-400',
                answered && isSelected && !isCorrect && 'bg-red-500/10 border-red-500/40 text-red-400',
                answered && !isCorrect && !isSelected && 'glass border-white/5 opacity-50'
              )}
            >
              <span
                className="font-medium"
                dir={lang === 'en' ? 'ltr' : 'rtl'}
                lang={lang === 'ku' ? 'ckb' : lang}
              >
                {getText(opt, lang)}
              </span>
              {answered && isCorrect && <Check className="w-5 h-5 flex-shrink-0" />}
              {answered && isSelected && !isCorrect && <X className="w-5 h-5 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && current.explanation && (
        <div className="glass rounded-xl p-4 border border-[var(--accent)]/20 fade-in">
          <p className="text-xs text-[var(--accent)] uppercase tracking-wider mb-1">
            {t('quiz_explanation')}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {getText(current.explanation, lang)}
          </p>
        </div>
      )}

      {/* Next */}
      {answered && (
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-xl bg-[var(--accent)] text-[#0a0a0f] font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          {index + 1 < quiz.length ? t('quiz_next') : t('quiz_finish')}
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      )}
    </div>
  );
}
