'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, Check } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { FlashcardItem, Lang } from '@/types';
import { getText, cn } from '@/lib/utils';

interface Props {
  cards: FlashcardItem[];
  lang: Lang;
  onComplete?: (known: number, total: number) => void;
}

export default function FlashcardGame({ cards, lang, onComplete }: Props) {
  const { t } = useApp();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [finished, setFinished] = useState(false);

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // refs to avoid stale closures in keyboard handler
  const indexRef = useRef(index);
  const knownRef = useRef(known);
  const finishedRef = useRef(finished);
  const lenRef = useRef(cards.length);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);
  useEffect(() => {
    knownRef.current = known;
  }, [known]);
  useEffect(() => {
    finishedRef.current = finished;
  }, [finished]);
  useEffect(() => {
    lenRef.current = cards.length;
  }, [cards.length]);

  const current = cards[index];

  const goNext = useCallback(() => {
    const cur = indexRef.current;
    const len = lenRef.current;
    if (cur + 1 < len) {
      setFlipped(false);
      setTimeout(() => {
        if (isMounted.current) setIndex((i) => i + 1);
      }, 150);
    } else {
      if (!isMounted.current) return;
      setFinished(true);
    }
  }, []);

  const handleKnown = useCallback(() => {
    const cur = indexRef.current;
    const newKnown = new Set(knownRef.current);
    newKnown.add(cur);
    setKnown(newKnown);
    goNext();
  }, [goNext]);

  const handleUnknown = useCallback(() => {
    goNext();
  }, [goNext]);

  const handleRestart = useCallback(() => {
    if (!isMounted.current) return;
    setIndex(0);
    setFlipped(false);
    setKnown(new Set());
    setFinished(false);
  }, []);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (finishedRef.current) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleKnown();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleUnknown();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleKnown, handleUnknown]);

  // Notify on finish
  useEffect(() => {
    if (finished && onComplete) {
      onComplete(known.size, cards.length);
    }
  }, [finished, known, cards.length, onComplete]);

  if (finished) {
    return (
      <div className="glass rounded-2xl p-8 text-center border border-[var(--accent)]/20">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/40 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-[var(--accent)]" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold mb-2">{t('flashcard_complete')}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {known.size} / {cards.length} {t('flashcard_mastered')}
        </p>
        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 text-sm font-medium hover:bg-[var(--accent)]/20 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {t('flashcard_review_again')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {t('flashcard_card_of', { index: index + 1, total: cards.length })}
        </span>
        <span className="text-xs text-[var(--accent)] flex items-center gap-1">
          <Check className="w-3 h-3" />
          {t('flashcard_known')}: {known.size}
        </span>
      </div>
      {/* Progress bar */}
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-300"
          style={{ width: `${((index + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div
        className="relative h-56 cursor-pointer perspective-1000 select-none"
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        aria-label={t('flashcard_flip_hint')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setFlipped((f) => !f);
          }
        }}
      >
        <div
          className={cn('absolute inset-0 rounded-2xl border transition-transform duration-500 preserve-3d', flipped ? 'rotate-y-180' : '')}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 glass rounded-2xl flex items-center justify-center p-6 border border-white/10 backface-hidden"
            aria-hidden={flipped}
          >
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
                {t('flashcard_front')}
              </p>
              <p
                className="text-3xl font-bold font-kurdish"
                dir={lang === 'en' ? 'ltr' : 'rtl'}
                lang={lang === 'ku' ? 'ckb' : lang}
              >
                {getText(current.front, lang)}
              </p>
              {current.dialect && (
                <p
                  className="text-sm text-muted-foreground mt-3"
                  dir={lang === 'en' ? 'ltr' : 'rtl'}
                >
                  {getText(current.dialect, lang)}
                </p>
              )}
            </div>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 glass rounded-2xl flex items-center justify-center p-6 border border-[var(--accent)]/30 backface-hidden"
            style={{ transform: 'rotateY(180deg)' }}
            aria-hidden={!flipped}
          >
            <div className="text-center">
              <p className="text-xs text-[var(--accent)] mb-3 uppercase tracking-wider">
                {t('flashcard_back')}
              </p>
              <p
                className="text-2xl font-semibold"
                dir={lang === 'en' ? 'ltr' : 'rtl'}
                lang={lang === 'ku' ? 'ckb' : lang}
              >
                {getText(current.back, lang)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-center text-muted-foreground">{t('flashcard_flip_hint')}</p>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleUnknown}
          className="flex-1 py-3 rounded-xl bg-white/5 text-foreground text-sm font-medium border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {t('flashcard_still_learning')}
        </button>
        <button
          onClick={handleKnown}
          className="flex-1 py-3 rounded-xl bg-green-500/10 text-green-400 text-sm font-medium border border-green-500/20 hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2"
        >
          {t('flashcard_got_it')}
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}
