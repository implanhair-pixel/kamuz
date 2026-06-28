'use client';

import { useState, useCallback, useRef } from 'react';
import { Brain, Check, X, RotateCcw, Trophy, Plus } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { vocabById } from '@/data/vocabulary';
import { cn, getText, getDir } from '@/lib/utils';

export default function SRSReview() {
  const { t, lang, dueQueue, reviewSRS, addNewSRSWords, srsItems } = useApp();
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0 });
  const [finished, setFinished] = useState(false);

  // Reset when queue changes length — render-phase reset pattern.
  const prevQueueLenRef = useRef(dueQueue.length);
  if (prevQueueLenRef.current !== dueQueue.length) {
    prevQueueLenRef.current = dueQueue.length;
    setIndex(0);
    setRevealed(false);
    setSessionStats({ correct: 0, wrong: 0 });
    setFinished(false);
  }

  const current = dueQueue[index];

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (!current) return;
      reviewSRS(current.vocabId, correct);
      setSessionStats((s) => ({
        correct: s.correct + (correct ? 1 : 0),
        wrong: s.wrong + (correct ? 0 : 1),
      }));
      if (index + 1 < dueQueue.length) {
        setIndex((i) => i + 1);
        setRevealed(false);
      } else {
        setFinished(true);
      }
    },
    [current, index, dueQueue.length, reviewSRS]
  );

  const handleAddNew = useCallback(() => {
    addNewSRSWords(5);
  }, [addNewSRSWords]);

  const totalReviewed = sessionStats.correct + sessionStats.wrong;
  const accuracy = totalReviewed > 0 ? Math.round((sessionStats.correct / totalReviewed) * 100) : 0;

  if (finished) {
    return (
      <div className="glass rounded-2xl p-8 text-center border border-[var(--accent)]/20">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/40 flex items-center justify-center">
          <Trophy className="w-10 h-10 text-[var(--accent)]" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold mb-3">{t('srs_complete')}</h3>
        <div className="flex justify-center gap-6 mb-4">
          <div>
            <div className="text-xs text-muted-foreground">{t('srs_reviewed')}</div>
            <div className="text-2xl font-bold text-[var(--accent)]">{totalReviewed}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">{t('srs_accuracy')}</div>
            <div className="text-2xl font-bold text-green-400">{accuracy}%</div>
          </div>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 text-sm font-medium hover:bg-[var(--accent)]/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('srs_add_new')}
        </button>
      </div>
    );
  }

  if (dueQueue.length === 0) {
    const totalWords = Object.keys(srsItems).length;
    const difficultCount = Object.values(srsItems).filter((i) => i.isDifficult).length;
    return (
      <div className="glass rounded-2xl p-8 text-center border border-white/10">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
          <Brain className="w-8 h-8 text-green-400" aria-hidden="true" />
        </div>
        <p className="text-base text-foreground mb-1">{t('srs_empty')}</p>
        <p className="text-xs text-muted-foreground mb-5">
          {t('srs_new_words')}: {totalWords} · {t('srs_difficult')}: {difficultCount}
        </p>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-[#0a0a0f] text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          {t('srs_add_new')}
        </button>
      </div>
    );
  }

  const vocab = vocabById.get(current.vocabId);
  if (!vocab) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {index + 1} / {dueQueue.length}
        </span>
        <span className="text-xs text-muted-foreground">
          {t('srs_box')}: {current.box} · {current.isDifficult && t('srs_difficult')}
        </span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-300"
          style={{ width: `${((index + 1) / dueQueue.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div className="glass rounded-2xl border border-white/10 p-8 min-h-[200px] flex flex-col items-center justify-center text-center">
        {!revealed ? (
          <>
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
              {vocab.category}
            </p>
            <p
              className="text-4xl font-bold mb-2 font-kurdish"
              dir={getDir(lang)}
              lang={lang === 'ku' ? 'ckb' : lang}
            >
              {vocab.dialects.sorani ?? vocab.ku}
            </p>
            <p className="text-sm text-muted-foreground">
              {vocab.dialects.kurmanji}
            </p>
            <button
              onClick={() => setRevealed(true)}
              className="mt-6 px-6 py-2.5 rounded-xl bg-[var(--accent)] text-[#0a0a0f] text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              {t('flashcard_flip_hint')}
            </button>
          </>
        ) : (
          <>
            <p className="text-xs text-[var(--accent)] mb-3 uppercase tracking-wider">
              {t('vocab_meaning')}
            </p>
            <p className="text-3xl font-bold mb-2" dir="ltr">
              {vocab.en}
            </p>
            <p className="text-base text-muted-foreground" dir="rtl" lang="fa">
              {vocab.fa}
            </p>
          </>
        )}
      </div>

      {/* Actions */}
      {revealed && (
        <div className="flex gap-3 fade-in">
          <button
            onClick={() => handleAnswer(false)}
            className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium border border-red-500/20 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            {t('srs_wrong')}
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="flex-1 py-3 rounded-xl bg-green-500/10 text-green-400 text-sm font-medium border border-green-500/20 hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            {t('srs_correct')}
          </button>
        </div>
      )}
    </div>
  );
}
