'use client';

import { useState, useMemo } from 'react';
import { Search, Bookmark, BookmarkCheck } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { vocabulary, vocabCategories } from '@/data/vocabulary';
import type { VocabCategory } from '@/types';
import { cn, getDir } from '@/lib/utils';

export default function VocabularyBrowser() {
  const { t, lang, isSaved, toggleSavedWord } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<VocabCategory | 'all'>('all');
  const [difficulty, setDifficulty] = useState<number | 'all'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vocabulary.filter((v) => {
      if (category !== 'all' && v.category !== category) return false;
      if (difficulty !== 'all' && v.difficulty !== difficulty) return false;
      if (!q) return true;
      return (
        v.en.toLowerCase().includes(q) ||
        v.fa.includes(q) ||
        v.ku.includes(q) ||
        Object.values(v.dialects).some((d) => d.toLowerCase().includes(q))
      );
    });
  }, [query, category, difficulty]);

  return (
    <section id="vocabulary" className="relative py-20 px-4 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">{t('vocab_title')}</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            {t('vocab_subtitle')}
          </p>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl border border-white/10 p-4 mb-6 space-y-3 fade-up delay-1">
          <div className="relative">
            <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('vocab_search')}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-2.5 text-sm focus:outline-none focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent)]/20 transition-colors"
              aria-label={t('vocab_search')}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory('all')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                category === 'all'
                  ? 'bg-[var(--accent)]/15 border-[var(--accent)]/40 text-[var(--accent)]'
                  : 'bg-white/5 border-white/10 text-muted-foreground hover:text-foreground'
              )}
            >
              {t('vocab_all')}
            </button>
            {vocabCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                  category === cat
                    ? 'bg-[var(--accent)]/15 border-[var(--accent)]/40 text-[var(--accent)]'
                    : 'bg-white/5 border-white/10 text-muted-foreground hover:text-foreground'
                )}
              >
                {t(`cat_${cat}`)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {([1, 2, 3] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(difficulty === d ? 'all' : d)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                  difficulty === d
                    ? 'bg-[var(--accent)]/15 border-[var(--accent)]/40 text-[var(--accent)]'
                    : 'bg-white/5 border-white/10 text-muted-foreground hover:text-foreground'
                )}
              >
                {t(`diff_${d}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground mb-4 fade-up delay-2">
          {filtered.length} / {vocabulary.length}
        </div>

        {/* Vocabulary grid */}
        {filtered.length === 0 ? (
          <div className="glass rounded-2xl border border-white/10 p-12 text-center text-muted-foreground">
            {t('vocab_empty')}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((v, i) => {
              const saved = isSaved(v.id);
              return (
                <div
                  key={v.id}
                  className={cn(
                    'glass rounded-2xl border border-white/10 p-5 hover:border-[var(--accent)]/30 transition-all fade-up',
                    `delay-${(i % 6) + 1}`
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                      {t(`cat_${v.category}`)}
                    </span>
                    <button
                      onClick={() => toggleSavedWord(v.id)}
                      aria-label={saved ? t('vocab_remove') : t('vocab_save')}
                      className={cn(
                        'p-1.5 rounded-lg transition-colors',
                        saved
                          ? 'text-[var(--accent)] bg-[var(--accent)]/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                      )}
                    >
                      {saved ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Localized meaning — shows Persian / Kurdish / English word depending on UI language */}
                  <div className="mb-3">
                    <p className={cn(
                      'text-xs text-muted-foreground mb-1',
                      lang === 'en' ? 'uppercase tracking-wider' : ''
                    )}>
                      {t('vocab_meaning')}
                    </p>
                    <p
                      className="text-lg font-semibold"
                      dir={lang === 'en' ? 'ltr' : 'rtl'}
                      lang={lang === 'ku' ? 'ckb' : lang}
                    >
                      {lang === 'fa' ? v.fa : lang === 'ku' ? v.ku : v.en}
                    </p>
                  </div>

                  {/* Dialect variants — all on one centered row */}
                  <div className="pt-3 border-t border-white/5">
                    <div className="grid grid-cols-3 gap-2">
                      {(['sorani', 'kalhori', 'kurmanji'] as const).map((d) => {
                        const word = v.dialects[d] ?? v.ku;
                        const isLatin = d === 'kurmanji';
                        const dialectColor =
                          d === 'kalhori'
                            ? 'text-green-400'
                            : isLatin
                              ? 'text-cyan-300'
                              : 'text-[var(--accent)]';
                        return (
                          <div
                            key={d}
                            className="flex flex-col items-center text-center gap-1"
                          >
                            <span
                              className={cn(
                                'text-lg font-bold leading-tight break-words w-full',
                                dialectColor,
                                !isLatin ? 'font-kurdish' : ''
                              )}
                              dir={isLatin ? 'ltr' : 'rtl'}
                              lang={isLatin ? 'en' : 'ckb'}
                            >
                              {word}
                            </span>
                            <span className={cn(
                              'text-[10px] text-muted-foreground',
                              lang === 'en' ? 'uppercase tracking-wider' : ''
                            )}>
                              {t(`dialect_${d}`)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
