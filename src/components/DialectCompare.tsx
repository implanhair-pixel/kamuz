'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, RefreshCw, ArrowRight, BookOpen } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { vocabulary } from '@/data/vocabulary';
import { getText, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DialectColumn {
  id: 'sorani' | 'kalhori' | 'kurmanji';
  labelKey: string;
  color: string;
  bg: string;
  border: string;
  ring: string;
  isLatin: boolean;
}

const DIALECTS: DialectColumn[] = [
  {
    id: 'sorani',
    labelKey: 'dialect_sorani',
    color: 'text-amber-400',
    bg: 'bg-amber-500/8',
    border: 'border-amber-500/30',
    ring: 'ring-amber-500/40',
    isLatin: false,
  },
  {
    id: 'kalhori',
    labelKey: 'dialect_kalhori',
    color: 'text-green-400',
    bg: 'bg-green-500/8',
    border: 'border-green-500/30',
    ring: 'ring-green-500/40',
    isLatin: false,
  },
  {
    id: 'kurmanji',
    labelKey: 'dialect_kurmanji',
    color: 'text-cyan-300',
    bg: 'bg-cyan-500/8',
    border: 'border-cyan-500/30',
    ring: 'ring-cyan-500/40',
    isLatin: true,
  },
];

export default function DialectCompare() {
  const { t, lang, dir } = useApp();
  // Start with a random word on mount.
  const [seed, setSeed] = useState(0);

  const currentWord = useMemo(() => {
    // Deterministic-but-rotating pick so SSR and client agree per-render.
    const idx = (seed + Math.floor(Date.now() / 1000)) % vocabulary.length;
    return vocabulary[idx] ?? vocabulary[0];
  }, [seed]);

  const shuffle = useCallback(() => {
    setSeed((s) => s + 1 + Math.floor(Math.random() * 1000));
  }, []);

  const localizedMeaning =
    lang === 'fa'
      ? currentWord.fa
      : lang === 'ku'
        ? currentWord.ku
        : currentWord.en;

  const fontClass = lang === 'en' ? 'font-en' : 'font-ku';

  return (
    <section id="compare" className="relative py-20 px-4 scroll-mt-20" dir={dir}>
      <div className={cn('max-w-6xl mx-auto', fontClass)}>
        {/* Header */}
        <div className="text-center mb-10 fade-up space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold">{t('compare_title')}</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            {t('compare_subtitle')}
          </p>
        </div>

        {/* Random word showcase card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl border border-white/10 p-6 sm:p-8 mb-6"
        >
          {/* Top row: meaning label + shuffle button */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2 min-w-0">
              <BookOpen className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
              <span className={cn('text-xs', lang === 'en' ? 'uppercase tracking-wider' : '')}>
                {t('vocab_meaning')}
              </span>
              <span
                className="text-sm font-semibold truncate"
                dir={lang === 'en' ? 'ltr' : 'rtl'}
                lang={lang === 'ku' ? 'ckb' : lang}
              >
                — {localizedMeaning}
              </span>
            </div>
            <Button
              onClick={shuffle}
              variant="outline"
              size="sm"
              className="rounded-xl border-white/10 glass hover:bg-white/5 text-xs flex-shrink-0"
            >
              <Shuffle className="w-3.5 h-3.5 me-1.5" />
              {t('compare_shuffle')}
            </Button>
          </div>

          {/* Three centered dialect columns */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWord.id + String(seed)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
            >
              {DIALECTS.map((d, i) => {
                const word = currentWord.dialects[d.id] ?? currentWord.ku;
                return (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      'rounded-2xl border p-6 flex flex-col items-center text-center gap-3',
                      d.bg,
                      d.border
                    )}
                  >
                    <span className={cn(
                      'text-[10px] sm:text-xs font-semibold',
                      d.color,
                      lang === 'en' ? 'uppercase tracking-wider' : ''
                    )}>
                      {t(d.labelKey)}
                    </span>
                    <span
                      className={cn(
                        'text-3xl sm:text-4xl font-bold leading-tight break-words w-full',
                        d.color,
                        !d.isLatin ? 'font-kurdish' : ''
                      )}
                      dir={d.isLatin ? 'ltr' : 'rtl'}
                      lang={d.isLatin ? 'en' : 'ckb'}
                    >
                      {word}
                    </span>
                    <div className="h-px w-12 bg-white/10" />
                    <span className="text-[10px] text-muted-foreground">
                      {t(`dialect_script_value_${d.id}`)}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Refresh hint */}
          <p className="text-center text-xs text-muted-foreground mt-5">
            {t('compare_shuffle_hint')}
          </p>
        </motion.div>

        {/* Mini comparison table */}
        <div className="glass rounded-2xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-4 bg-white/5">
            <div className={cn('p-3 text-xs font-semibold text-muted-foreground', lang === 'en' ? 'uppercase tracking-wider' : '')}>
              {t('vocab_meaning')}
            </div>
            {DIALECTS.map((d) => (
              <div key={d.id} className={cn('p-3 text-xs font-semibold text-center', lang === 'en' ? 'uppercase tracking-wider' : '', d.color)}>
                {t(d.labelKey)}
              </div>
            ))}
          </div>
          {vocabulary.slice(0, 8).map((row, i) => {
            const meaning =
              lang === 'fa' ? row.fa : lang === 'ku' ? row.ku : row.en;
            return (
              <div
                key={row.id}
                className={cn(
                  'grid grid-cols-4 border-t border-white/5 text-sm hover:bg-white/[0.02] transition-colors',
                  i % 2 === 1 && 'bg-white/[0.015]'
                )}
              >
                <div className="p-3 text-muted-foreground truncate" dir={lang === 'en' ? 'ltr' : 'rtl'}>
                  {meaning}
                </div>
                {DIALECTS.map((d) => {
                  const word = row.dialects[d.id] ?? row.ku;
                  return (
                    <div
                      key={d.id}
                      className={cn(
                        'p-3 text-center font-semibold',
                        d.color,
                        !d.isLatin ? 'font-kurdish' : ''
                      )}
                      dir={d.isLatin ? 'ltr' : 'rtl'}
                      lang={d.isLatin ? 'en' : 'ckb'}
                    >
                      {word}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* CTA — go explore more vocabulary */}
        <div className="text-center mt-6">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-white/10 glass hover:bg-white/5"
            onClick={() => {
              const el = document.getElementById('vocabulary');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t('compare_explore_vocab')}
            <ArrowRight className="w-4 h-4 ms-1.5 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </section>
  );
}
