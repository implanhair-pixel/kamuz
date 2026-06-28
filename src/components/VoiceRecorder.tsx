'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, RotateCcw, Upload, X, Loader2, BookOpen, Search, Check } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { vocabulary, vocabCategories } from '@/data/vocabulary';
import type { VocabItem } from '@/types';

interface Props {
  onUploaded?: () => void;
}

type RecorderState = 'idle' | 'recording' | 'recorded';

const DIALECT_OPTIONS: { id: string; labelKey: string }[] = [
  { id: 'sorani', labelKey: 'dialect_sorani' },
  { id: 'kalhori', labelKey: 'dialect_kalhori' },
  { id: 'kurmanji', labelKey: 'dialect_kurmanji' },
];

export default function VoiceRecorder({ onUploaded }: Props) {
  const { t, lang, dir } = useApp();
  const { toast } = useToast();

  const [state, setState] = useState<RecorderState>('idle');
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');
  const [description, setDescription] = useState('');
  const [dialect, setDialect] = useState('sorani');
  const [selectedVocabId, setSelectedVocabId] = useState<string>('');
  const [vocabSearch, setVocabSearch] = useState('');
  const [vocabDropdownOpen, setVocabDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [audioUrl]);

  // Click-outside for vocab dropdown
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setVocabDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const selectedVocab = useMemo(
    () => vocabulary.find((v) => v.id === selectedVocabId),
    [selectedVocabId]
  );

  const filteredVocab = useMemo(() => {
    const q = vocabSearch.trim().toLowerCase();
    if (!q) return vocabulary;
    return vocabulary.filter(
      (v) =>
        v.en.toLowerCase().includes(q) ||
        v.fa.includes(q) ||
        v.ku.includes(q) ||
        Object.values(v.dialects).some((d) => d.toLowerCase().includes(q))
    );
  }, [vocabSearch]);

  // Auto-update dialect preview when vocab changes
  useEffect(() => {
    if (selectedVocab && selectedVocab.dialects) {
      // If user hasn't started recording yet, sync dialect to a value that exists in the vocab.
      // But always keep the user's manual selection if they made one — we don't override here.
    }
  }, [selectedVocab]);

  // The "title" is now derived from the selected vocab word — show as a read-only display.
  const localizedMeaning = selectedVocab
    ? (lang === 'fa' ? selectedVocab.fa : lang === 'ku' ? selectedVocab.ku : selectedVocab.en)
    : '';
  const title = selectedVocab
    ? `${selectedVocab.dialects[dialect] ?? selectedVocab.ku} — ${localizedMeaning}`
    : '';

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setState('recorded');
      };

      recorder.start(100);
      mediaRecorderRef.current = recorder;
      setState('recording');
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((d) => {
          if (d >= 120) {
            if (mediaRecorderRef.current?.state === 'recording') {
              mediaRecorderRef.current.stop();
            }
            return d;
          }
          return d + 1;
        });
      }, 1000);
    } catch {
      setError(t('voices_error_generic'));
    }
  }, [t]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const reRecord = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setState('idle');
    setError(null);
  }, [audioUrl]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const allowed = ['audio/webm', 'audio/ogg', 'audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/m4a'];
      if (!allowed.includes(file.type) && !file.name.match(/\.(webm|ogg|mp3|wav|m4a)$/i)) {
        setError(t('voices_error_type'));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError(t('voices_error_size'));
        return;
      }
      setError(null);
      const url = URL.createObjectURL(file);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioBlob(file);
      setAudioUrl(url);

      // Get duration from audio element
      const audio = new Audio();
      audio.src = url;
      audio.addEventListener('loadedmetadata', () => {
        setDuration(Math.floor(audio.duration));
        setState('recorded');
      });
    },
    [audioUrl, t]
  );

  const handleSubmit = useCallback(async () => {
    if (!selectedVocab) {
      setError(t('voices_error_no_vocab'));
      return;
    }
    if (!audioBlob) {
      setError(t('voices_no_audio'));
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const form = new FormData();
      const ext = audioBlob.type.includes('mp3') ? 'mp3' : audioBlob.type.includes('wav') ? 'wav' : 'webm';
      form.append('audio', audioBlob, `recording.${ext}`);
      form.append('title', title);
      form.append('description', description.trim());
      form.append('dialect', dialect);
      // Send the user-entered nickname (or empty string — server falls back to the
      // authenticated user's name when this is blank).
      form.append('nickname', nickname.trim());
      form.append('duration', String(duration));
      form.append('vocabId', selectedVocab.id);

      const res = await fetch('/api/voices', { method: 'POST', body: form });
      const data = await res.json();

      if (!res.ok) {
        const errKey = data.error === 'rate_limit'
          ? 'voices_error_rate_limit'
          : data.error === 'invalid_type'
            ? 'voices_error_type'
            : data.error === 'file_too_large'
              ? 'voices_error_size'
              : data.error === 'too_long'
                ? 'voices_error_length'
                : data.error === 'no_vocab'
                  ? 'voices_error_no_vocab'
                  : 'voices_error_generic';
        setError(t(errKey));
        return;
      }

      toast({ title: t('voices_success'), variant: 'default' });

      // Reset form
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioBlob(null);
      setAudioUrl(null);
      setDuration(0);
      setDescription('');
      setNickname('');
      setDialect('sorani');
      setSelectedVocabId('');
      setVocabSearch('');
      setState('idle');
      setError(null);

      onUploaded?.();
    } catch {
      setError(t('voices_error_generic'));
    } finally {
      setSubmitting(false);
    }
  }, [selectedVocab, audioBlob, title, description, dialect, nickname, duration, audioUrl, t, toast, onUploaded]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const fontClass = lang === 'en' ? 'font-en' : 'font-ku';

  return (
    <div dir={dir} className={cn('w-full', fontClass)}>
      <div className="relative rounded-2xl border border-white/10 glass p-6 space-y-5 overflow-hidden">
        {/* Gradient border glow effect */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-30 bg-gradient-to-br from-[var(--accent)]/20 via-transparent to-[var(--accent)]/10" />

        {/* Header */}
        <div className="relative flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">{t('voices_upload_title')}</h3>
            <p className="text-sm text-muted-foreground">{t('voices_record_hint_vocab')}</p>
          </div>
        </div>

        {/* Vocabulary selector (required) */}
        <div className="relative space-y-2" ref={dropdownRef}>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            {t('voices_select_vocab')} *
          </label>

          {/* Selected vocab display / trigger */}
          <button
            type="button"
            onClick={() => setVocabDropdownOpen((v) => !v)}
            className={cn(
              'w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border bg-white/5 text-start transition-colors',
              vocabDropdownOpen ? 'border-[var(--accent)]/40' : 'border-white/10 hover:border-white/20',
              !selectedVocab && 'text-muted-foreground'
            )}
          >
            {selectedVocab ? (
              <span className="flex items-center gap-3 min-w-0">
                <span
                  className="font-bold text-base text-[var(--accent)] truncate"
                  dir={dialect === 'kurmanji' ? 'ltr' : 'rtl'}
                  lang={dialect === 'kurmanji' ? 'en' : 'ckb'}
                >
                  {selectedVocab.dialects[dialect] ?? selectedVocab.ku}
                </span>
                <span className="text-xs text-muted-foreground truncate" dir={lang === 'en' ? 'ltr' : 'rtl'}>
                  — {lang === 'fa' ? selectedVocab.fa : lang === 'ku' ? selectedVocab.ku : selectedVocab.en}
                </span>
                <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full border-white/10 text-muted-foreground flex-shrink-0">
                  {t(`cat_${selectedVocab.category}`)}
                </Badge>
              </span>
            ) : (
              <span className="text-sm">{t('voices_select_vocab_placeholder')}</span>
            )}
            <svg
              className={cn('w-4 h-4 text-muted-foreground transition-transform flex-shrink-0', vocabDropdownOpen && 'rotate-180')}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {/* Dropdown panel */}
          <AnimatePresence>
            {vocabDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute z-30 top-full inset-x-0 mt-1 rounded-xl border border-white/10 glass shadow-2xl overflow-hidden"
              >
                {/* Search input */}
                <div className="relative p-2 border-b border-white/10">
                  <Search className="absolute top-1/2 -translate-y-1/2 start-4 w-4 h-4 text-muted-foreground" />
                  <input
                    type="search"
                    autoFocus
                    value={vocabSearch}
                    onChange={(e) => setVocabSearch(e.target.value)}
                    placeholder={t('vocab_search')}
                    className="w-full bg-white/5 border border-white/10 rounded-lg ps-10 pe-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]/40"
                    dir={dir}
                  />
                </div>

                {/* Category quick-filter chips */}
                <div className="flex flex-wrap gap-1.5 p-2 border-b border-white/10 max-h-24 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => setVocabSearch('')}
                    className="px-2 py-1 rounded-md text-[10px] font-medium bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground"
                  >
                    {t('vocab_all')}
                  </button>
                  {vocabCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setVocabSearch(t(`cat_${cat}`))}
                      className="px-2 py-1 rounded-md text-[10px] font-medium bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground"
                    >
                      {t(`cat_${cat}`)}
                    </button>
                  ))}
                </div>

                {/* Vocabulary list */}
                <div className="max-h-64 overflow-y-auto p-1.5">
                  {filteredVocab.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-6">{t('vocab_empty')}</p>
                  ) : (
                    filteredVocab.map((v: VocabItem) => {
                      const isSelected = v.id === selectedVocabId;
                      const dialectWord = v.dialects[dialect] ?? v.ku;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            setSelectedVocabId(v.id);
                            setVocabDropdownOpen(false);
                            setVocabSearch('');
                            setError(null);
                          }}
                          className={cn(
                            'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-start transition-colors',
                            isSelected
                              ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                              : 'hover:bg-white/5'
                          )}
                        >
                          <span className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="font-semibold truncate"
                              dir={dialect === 'kurmanji' ? 'ltr' : 'rtl'}
                              lang={dialect === 'kurmanji' ? 'en' : 'ckb'}
                            >
                              {dialectWord}
                            </span>
                            <span className="text-xs text-muted-foreground truncate" dir={lang === 'en' ? 'ltr' : 'rtl'}>
                              — {lang === 'fa' ? v.fa : lang === 'ku' ? v.ku : v.en}
                            </span>
                          </span>
                          <span className="flex items-center gap-2 flex-shrink-0">
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 rounded-full border-white/10 text-muted-foreground">
                              {t(`cat_${v.category}`)}
                            </Badge>
                            {isSelected && <Check className="w-4 h-4 text-[var(--accent)]" />}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dialect selector */}
        <div className="relative space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t('voices_dialect')} *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {DIALECT_OPTIONS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDialect(d.id)}
                className={cn(
                  'px-3 py-2 rounded-xl border text-xs font-medium transition-all',
                  dialect === d.id
                    ? 'bg-[var(--accent)]/15 border-[var(--accent)]/40 text-[var(--accent)]'
                    : 'bg-white/5 border-white/10 text-muted-foreground hover:text-foreground'
                )}
              >
                {t(d.labelKey)}
              </button>
            ))}
          </div>
          {selectedVocab && (
            <p className="text-[11px] text-muted-foreground">
              {t('voices_dialect_preview')}:{' '}
              <span
                className="text-[var(--accent)] font-semibold"
                dir={dialect === 'kurmanji' ? 'ltr' : 'rtl'}
                lang={dialect === 'kurmanji' ? 'en' : 'ckb'}
              >
                {selectedVocab.dialects[dialect] ?? selectedVocab.ku}
              </span>
            </p>
          )}
        </div>

        {/* Recording area — only enabled once a vocab word is selected */}
        <div className={cn('relative flex flex-col items-center gap-4 py-4', !selectedVocab && 'opacity-50 pointer-events-none')}>
          <AnimatePresence mode="wait">
            {state === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center gap-4"
              >
                <button
                  type="button"
                  onClick={startRecording}
                  className="group relative w-20 h-20 rounded-full bg-gradient-to-br from-[var(--accent)] to-amber-600 flex items-center justify-center text-white shadow-lg shadow-[var(--accent)]/30 hover:scale-110 hover:shadow-xl hover:shadow-[var(--accent)]/40 transition-all duration-300"
                >
                  <Mic className="w-8 h-8" />
                  <span className="absolute inset-0 rounded-full animate-pulse-ring" />
                </button>
                <span className="text-sm text-muted-foreground">{t('voices_record_btn')}</span>
              </motion.div>
            )}

            {state === 'recording' && (
              <motion.div
                key="recording"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center gap-4"
              >
                {/* Animated waveform bars (CSS only) */}
                <div className="flex items-center justify-center gap-1 h-16 mb-2">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 rounded-full bg-red-400"
                      animate={{ height: [8, 20 + Math.random() * 36, 8] }}
                      transition={{
                        duration: 0.6 + Math.random() * 0.4,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        delay: i * 0.05,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>

                {/* Pulsing red dot + timer */}
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                  </span>
                  <span className="text-2xl font-mono font-bold text-red-400 tabular-nums">
                    {formatTime(duration)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={stopRecording}
                  className="group relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white shadow-lg shadow-red-500/30 hover:scale-110 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300"
                >
                  <Square className="w-7 h-7" />
                </button>
                <span className="text-sm text-muted-foreground">{t('voices_stop_btn')}</span>
              </motion.div>
            )}

            {state === 'recorded' && audioUrl && (
              <motion.div
                key="recorded"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center gap-3 w-full max-w-sm"
              >
                <audio src={audioUrl} className="hidden" id="recorder-audio" />
                {/* Mini waveform visual */}
                <div className="flex items-center justify-center gap-[2px] h-10 w-full max-w-xs">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-[var(--accent)]/60"
                      style={{
                        height: `${6 + Math.random() * 28}px`,
                        opacity: 0.4 + Math.random() * 0.6,
                      }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <AudioPlayButton src={audioUrl} />
                  <span className="text-sm font-mono text-muted-foreground tabular-nums">
                    {formatTime(duration)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={reRecord}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 glass text-sm hover:bg-white/5 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {t('voices_re_record')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              <X className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Optional form fields */}
        <div className="relative grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t('voices_nickname')}
            </label>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={t('voices_nickname_placeholder')}
              className="rounded-xl border-white/10 bg-white/5"
              dir={dir}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t('voices_description')}
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('voices_description_placeholder')}
              rows={2}
              className="rounded-xl border-white/10 bg-white/5 resize-none"
              dir={dir}
            />
          </div>
        </div>

        {/* Submit + Upload alternative */}
        <div className="relative flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button
            onClick={handleSubmit}
            disabled={!audioBlob || submitting || !selectedVocab}
            className="w-full sm:w-auto rounded-xl px-6 py-2.5 bg-[var(--accent)] text-black font-semibold hover:opacity-90 transition-all disabled:opacity-40"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('voices_submitting')}
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                {t('voices_submit')}
              </>
            )}
          </Button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground w-full sm:w-auto">
            <span>{t('voices_or_upload')}</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={!selectedVocab}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Upload className="w-3.5 h-3.5" />
              {t('voices_choose_file')}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Mini play/pause button for recorded audio preview */
function AudioPlayButton({ src }: { src: string }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.addEventListener('ended', () => setPlaying(false));
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="w-10 h-10 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center hover:bg-[var(--accent)]/25 transition-colors"
    >
      {playing ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
    </button>
  );
}
