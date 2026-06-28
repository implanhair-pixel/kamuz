'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, ChevronDown, Search, SlidersHorizontal, Music, Loader2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import VoiceRecorder from '@/components/VoiceRecorder';
import VoiceCard, { type VoiceItem } from '@/components/VoiceCard';
import TopVoices from '@/components/TopVoices';

interface Props {
  onNavigate?: (view: string) => void;
}

export default function VoiceSection({ onNavigate }: Props) {
  const { t, lang, dir } = useApp();

  const [voices, setVoices] = useState<VoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('newest');
  const [dialect, setDialect] = useState('');
  const [search, setSearch] = useState('');
  const [showRecorder, setShowRecorder] = useState(false);
  const [top3Ids, setTop3Ids] = useState<string[]>([]);

  const limit = 20;

  // Fetch voices
  const fetchVoices = useCallback(async (p: number, reset = false) => {
    setLoading(reset || p === 1);
    try {
      const params = new URLSearchParams({
        page: String(p),
        limit: String(limit),
        sort,
        dialect,
      });
      const res = await fetch(`/api/voices?${params}`);
      const data = await res.json();
      if (reset || p === 1) {
        setVoices(data.voices || []);
      } else {
        setVoices((prev) => [...prev, ...(data.voices || [])]);
      }
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || 0);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [sort, dialect]);

  // Fetch top 3 IDs for badge calculation
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/voices/top');
        const data = await res.json();
        setTop3Ids((data.voices || []).map((v: VoiceItem) => v.id));
      } catch { /* ignore */ }
    })();
  }, []);

  // Initial load + reload on filter change
  useEffect(() => {
    fetchVoices(1, true);
  }, [fetchVoices]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [sort, dialect]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchVoices(next);
  };

  const handleUploaded = useCallback(() => {
    fetchVoices(1, true);
    setShowRecorder(false);
  }, [fetchVoices]);

  const handleRated = useCallback((id: string, likes: number, dislikes: number) => {
    setVoices((prev) =>
      prev.map((v) => (v.id === id ? { ...v, likes, dislikes } : v))
    );
  }, []);

  const handleNeedLogin = useCallback(() => {
    onNavigate?.('login');
  }, [onNavigate]);

  // Filter by search (client-side since API doesn't support it)
  const filteredVoices = useMemo(() => {
    if (!search.trim()) return voices;
    const q = search.toLowerCase();
    return voices.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.nickname.toLowerCase().includes(q) ||
        (v.description || '').toLowerCase().includes(q)
    );
  }, [voices, search]);

  const fontClass = lang === 'en' ? 'font-en' : 'font-ku';

  return (
    <section className="py-8 sm:py-12 px-4" dir={dir}>
      <div className={cn('max-w-5xl mx-auto space-y-8', fontClass)}>
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold gradient-text"
          >
            {t('voices_title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-xl mx-auto"
          >
            {t('voices_subtitle')}
          </motion.p>
        </div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold text-center">{t('voices_top_title')}</h3>
          <TopVoices />
        </motion.div>

        {/* Upload section (collapsible) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => setShowRecorder(!showRecorder)}
            className="w-full flex items-center justify-between p-4 rounded-2xl border border-white/10 glass hover:border-[var(--accent)]/30 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center">
                <Mic className="w-5 h-5" />
              </div>
              <div className="text-start">
                <p className="font-bold">{t('voices_record')}</p>
                <p className="text-sm text-muted-foreground">{t('voices_record_hint')}</p>
              </div>
            </div>
            <ChevronDown
              className={cn(
                'w-5 h-5 text-muted-foreground transition-transform duration-300',
                showRecorder && 'rotate-180'
              )}
            />
          </button>

          <AnimatePresence>
            {showRecorder && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="pt-4">
                  <VoiceRecorder onUploaded={handleUploaded} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stats bar */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">{t('voices_all')}</h3>
          {total > 0 && (
            <span className="text-sm text-muted-foreground">
              {total} {t('stats_voices').toLowerCase()}
            </span>
          )}
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={cn('absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground', dir === 'rtl' ? 'right-3' : 'left-3')} />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('voices_search')}
              className={cn('rounded-xl border-white/10 bg-white/5', dir === 'rtl' ? 'pr-10' : 'pl-10')}
              dir={dir}
            />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full sm:w-44 rounded-xl border-white/10 bg-white/5" dir={dir}>
              <SlidersHorizontal className="w-4 h-4 me-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent dir={dir}>
              <SelectItem value="newest">{t('voices_newest')}</SelectItem>
              <SelectItem value="top">{t('voices_top_sort')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dialect} onValueChange={(v) => setDialect(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-full sm:w-44 rounded-xl border-white/10 bg-white/5" dir={dir}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent dir={dir}>
              <SelectItem value="all">{t('voices_filter_dialect')}</SelectItem>
              <SelectItem value="sorani">{t('dialect_sorani')}</SelectItem>
              <SelectItem value="kalhori">{t('dialect_kalhori')}</SelectItem>
              <SelectItem value="kurmanji">{t('dialect_kurmanji')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Voice grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filteredVoices.map((voice) => (
              <VoiceCard
                key={voice.id}
                voice={voice}
                allVoices={voices}
                top3Ids={top3Ids}
                onRated={handleRated}
                onNeedLogin={handleNeedLogin}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-56 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredVoices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 space-y-3"
          >
            <Music className="w-12 h-12 mx-auto text-muted-foreground/30" />
            <p className="text-muted-foreground">{t('voices_empty')}</p>
          </motion.div>
        )}

        {/* Load more */}
        {!loading && page < totalPages && filteredVoices.length > 0 && (
          <div className="flex justify-center">
            <Button
              onClick={handleLoadMore}
              variant="outline"
              className="rounded-xl border-white/10 glass px-8 hover:bg-white/5"
            >
              {t('voices_load_more')}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}