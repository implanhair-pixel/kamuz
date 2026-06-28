'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ThumbsUp, ThumbsDown, Award, ChevronRight, X, Clock, LogIn } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useApp } from '@/contexts/AppContext';
import { cn, getText } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { vocabById } from '@/data/vocabulary';
import { BookOpen } from 'lucide-react';

export interface VoiceItem {
  id: string;
  title: string;
  description: string | null;
  dialect: string;
  filePath: string;
  duration: number;
  nickname: string;
  vocabId?: string;
  likes: number;
  dislikes: number;
  createdAt: string;
}

interface Props {
  voice: VoiceItem;
  /** All voices from the current page — used for badge/profile calculations */
  allVoices?: VoiceItem[];
  top3Ids?: string[];
  onRated?: (id: string, likes: number, dislikes: number) => void;
  onNeedLogin?: () => void;
}

/* ── Dialect badge colors ── */
const DIALECT_STYLES: Record<string, string> = {
  sorani: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  kalhori: 'bg-green-500/15 text-green-400 border-green-500/25',
  kurmanji: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
};

/* ── Badge definitions ── */
interface BadgeInfo {
  key: string;
  icon: string;
}

const BADGE_DEFS: BadgeInfo[] = [
  { key: 'first_voice', icon: '🎙️' },
  { key: 'voice_5', icon: '📰' },
  { key: 'voice_10', icon: '🎤' },
  { key: 'top_3', icon: '⭐' },
  { key: 'multi_dialect', icon: '🌐' },
  { key: 'high_rated', icon: '💎' },
];

function computeUserBadges(
  nickname: string,
  userVoices: VoiceItem[],
  top3Ids: string[]
): string[] {
  const badges: string[] = [];
  if (userVoices.length >= 1) badges.push('first_voice');
  if (userVoices.length >= 5) badges.push('voice_5');
  if (userVoices.length >= 10) badges.push('voice_10');

  const userDialects = new Set(userVoices.map((v) => v.dialect));
  if (userDialects.size >= 3) badges.push('multi_dialect');

  const totalLikes = userVoices.reduce((s, v) => s + (v.likes || 0), 0);
  if (totalLikes >= 20) badges.push('high_rated');

  const userHasTop = userVoices.some((v) => top3Ids.includes(v.id));
  if (userHasTop) badges.push('top_3');

  return badges;
}

/* ── Relative time helper ── */
function relativeTime(iso: string, timeStr: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return timeStr.split('|')[0];
  if (diff < 3600) return timeStr.split('|')[1].replace('{{count}}', String(Math.floor(diff / 60)));
  if (diff < 86400) return timeStr.split('|')[2].replace('{{count}}', String(Math.floor(diff / 3600)));
  if (diff < 604800) return timeStr.split('|')[3].replace('{{count}}', String(Math.floor(diff / 86400)));
  return timeStr.split('|')[4].replace('{{count}}', String(Math.floor(diff / 604800)));
}

export default function VoiceCard({ voice, allVoices = [], top3Ids = [], onRated, onNeedLogin }: Props) {
  const { t, lang, dir } = useApp();
  const { toast } = useToast();
  const { data: session, status } = useSession();

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);
  const [likes, setLikes] = useState(voice.likes);
  const [dislikes, setDislikes] = useState(voice.dislikes);
  const [voting, setVoting] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animFrameRef = useRef<number>(0);

  // Sync local state if voice prop changes (e.g. parent refetch).
  useEffect(() => {
    setLikes(voice.likes);
    setDislikes(voice.dislikes);
  }, [voice.likes, voice.dislikes, voice.id]);

  // Fetch the current user's vote (if logged in) on mount.
  useEffect(() => {
    let cancelled = false;
    if (status === 'authenticated' && session?.user?.id) {
      fetch(`/api/voices/${voice.id}/rate`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d: { voted?: 'like' | 'dislike' | null } | null) => {
          if (!cancelled && d) setUserVote(d.voted ?? null);
        })
        .catch(() => {});
    } else {
      setUserVote(null);
    }
    return () => { cancelled = true; };
  }, [voice.id, session?.user?.id, status]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const togglePlay = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(voice.filePath);
      audioRef.current.addEventListener('ended', () => {
        setPlaying(false);
        setProgress(0);
        setCurrentTime(0);
      });
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      cancelAnimationFrame(animFrameRef.current);
    } else {
      audioRef.current.play();
      setPlaying(true);

      const update = () => {
        if (audioRef.current) {
          const cur = audioRef.current.currentTime;
          const dur = audioRef.current.duration || 1;
          setCurrentTime(cur);
          setProgress((cur / dur) * 100);
          animFrameRef.current = requestAnimationFrame(update);
        }
      };
      animFrameRef.current = requestAnimationFrame(update);
    }
  }, [playing, voice.filePath]);

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = dir === 'rtl'
      ? (rect.right - e.clientX) / rect.width
      : (e.clientX - rect.left) / rect.width;
    const newTime = ratio * (audioRef.current.duration || 0);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(ratio * 100);
  };

  const handleVote = async (kind: 'like' | 'dislike') => {
    // Auth gate — must be signed in to vote.
    if (status !== 'authenticated' || !session?.user?.id) {
      toast({ title: t('voices_login_to_vote'), description: t('voices_login_to_vote_desc') });
      onNeedLogin?.();
      return;
    }
    if (voting) return;
    setVoting(true);
    try {
      const res = await fetch(`/api/voices/${voice.id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind }),
      });
      const data = await res.json();
      if (!res.ok) {
        const errKey =
          data.error === 'own_voice'
            ? 'voices_rate_error_own'
            : data.error === 'rate_limit'
              ? 'voices_rate_error_limit'
              : data.error === 'unauthorized'
                ? 'voices_login_to_vote'
                : 'error_generic';
        toast({ title: t(errKey), variant: 'destructive' });
        if (data.error === 'unauthorized') onNeedLogin?.();
        return;
      }
      // Optimistic update with the server response.
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setUserVote(data.action === 'removed' ? null : kind);
      onRated?.(voice.id, data.likes, data.dislikes);
    } catch {
      toast({ title: t('error_generic'), variant: 'destructive' });
    } finally {
      setVoting(false);
    }
  };

  const fontClass = lang === 'en' ? 'font-en' : 'font-ku';

  // Compute profile data
  const userVoices = allVoices.filter((v) => v.nickname === voice.nickname);
  const userBadges = computeUserBadges(voice.nickname, userVoices, top3Ids);
  const userTotalLikes = userVoices.reduce((s, v) => s + (v.likes || 0), 0);

  const isAuthed = status === 'authenticated' && !!session?.user?.id;

  // Linked vocabulary word (if any)
  const linkedVocab = voice.vocabId ? vocabById.get(voice.vocabId) : undefined;
  const linkedWord =
    linkedVocab
      ? getText({ en: linkedVocab.en, fa: linkedVocab.fa, ku: linkedVocab.ku }, lang)
      : '';
  const linkedDialectWord = linkedVocab?.dialects?.[voice.dialect] ?? linkedWord;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative rounded-2xl border border-white/10 glass overflow-hidden group hover:border-[var(--accent)]/30 transition-colors duration-300"
        dir={dir}
      >
        {/* Subtle top gradient line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className={cn('p-5 space-y-4', fontClass)}>
          {/* Top row: avatar + nickname + dialect + time */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setProfileOpen(true)}
                className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)]/30 to-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] font-bold text-sm hover:scale-105 transition-transform border border-[var(--accent)]/20"
              >
                {voice.nickname.charAt(0).toUpperCase()}
              </button>
              <button
                onClick={() => setProfileOpen(true)}
                className="text-sm font-semibold truncate hover:text-[var(--accent)] transition-colors"
              >
                {voice.nickname}
              </button>
              {/* Mini badges preview */}
              {userBadges.length > 0 && (
                <div className="hidden sm:flex items-center gap-1">
                  {userBadges.slice(0, 2).map((b) => (
                    <span
                      key={b}
                      className="text-xs"
                      title={t(`voices_badge_${b}_desc`)}
                    >
                      {BADGE_DEFS.find((d) => d.key === b)?.icon}
                    </span>
                  ))}
                  {userBadges.length > 2 && (
                    <span className="text-xs text-muted-foreground">+{userBadges.length - 2}</span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge
                variant="outline"
                className={cn('text-[10px] px-2 py-0.5 rounded-full border', DIALECT_STYLES[voice.dialect] || '')}
              >
                {t(`dialect_${voice.dialect}`)}
              </Badge>
              <span className="text-[11px] text-muted-foreground hidden sm:inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {relativeTime(voice.createdAt, t('voices_time_ago'))}
              </span>
            </div>
          </div>

          {/* Title */}
          <h4 className="text-base font-bold leading-snug">{voice.title}</h4>
          {voice.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{voice.description}</p>
          )}

          {/* Linked vocabulary word badge */}
          {linkedVocab && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--accent)]/8 border border-[var(--accent)]/20 text-sm">
              <BookOpen className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0" />
              <span className="text-xs text-muted-foreground">{t('voices_pronouncing')}:</span>
              <span
                className="font-semibold text-[var(--accent)] truncate"
                dir={voice.dialect === 'kurmanji' ? 'ltr' : 'rtl'}
                lang={voice.dialect === 'kurmanji' ? 'en' : 'ckb'}
              >
                {linkedDialectWord}
              </span>
            </div>
          )}

          {/* Audio player */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="shrink-0 w-10 h-10 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center hover:bg-[var(--accent)]/25 transition-colors"
              >
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-[11px] font-mono text-muted-foreground tabular-nums w-8 text-right">
                  {formatTime(currentTime)}
                </span>
                <div
                  className="flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer group/progress"
                  onClick={seekTo}
                >
                  <div
                    className="h-full bg-[var(--accent)] rounded-full relative transition-[width] duration-100"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--accent)] opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                  </div>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground tabular-nums w-8">
                  {formatTime(voice.duration)}
                </span>
              </div>
            </div>
          </div>

          {/* Like / Dislike bar */}
          <div className="flex items-center justify-between pt-1 gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVote('like')}
                disabled={voting}
                aria-pressed={userVote === 'like'}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                  userVote === 'like'
                    ? 'bg-green-500/15 border-green-500/40 text-green-400'
                    : 'bg-white/5 border-white/10 text-muted-foreground hover:text-green-400 hover:border-green-500/30',
                  !isAuthed && 'opacity-80'
                )}
                title={isAuthed ? t('voices_like') : t('voices_login_to_vote')}
              >
                <ThumbsUp className={cn('w-3.5 h-3.5', userVote === 'like' && 'fill-green-400')} />
                <span className="tabular-nums">{likes}</span>
              </button>
              <button
                onClick={() => handleVote('dislike')}
                disabled={voting}
                aria-pressed={userVote === 'dislike'}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                  userVote === 'dislike'
                    ? 'bg-red-500/15 border-red-500/40 text-red-400'
                    : 'bg-white/5 border-white/10 text-muted-foreground hover:text-red-400 hover:border-red-500/30',
                  !isAuthed && 'opacity-80'
                )}
                title={isAuthed ? t('voices_dislike') : t('voices_login_to_vote')}
              >
                <ThumbsDown className={cn('w-3.5 h-3.5', userVote === 'dislike' && 'fill-red-400')} />
                <span className="tabular-nums">{dislikes}</span>
              </button>
            </div>
            {!isAuthed && (
              <button
                onClick={() => onNeedLogin?.()}
                className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-[var(--accent)] transition-colors"
              >
                <LogIn className="w-3 h-3" />
                {t('voices_login_to_vote_short')}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Profile modal */}
      <AnimatePresence>
        {profileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setProfileOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/10 glass p-6 space-y-5 relative max-h-[85vh] overflow-y-auto"
              dir={dir}
            >
              <button
                onClick={() => setProfileOpen(false)}
                className="absolute top-4 end-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold">{t('voices_profile_title')}</h3>

              {/* User info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent)]/40 to-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] font-bold text-2xl border border-[var(--accent)]/30">
                  {voice.nickname.charAt(0).toUpperCase()}
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-lg">{voice.nickname}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{t('voices_profile_recordings')}: {userVoices.length}</span>
                    <span className="inline-flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3 text-green-400" />
                      {userTotalLikes}
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              {userBadges.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{t('voices_profile_badges')}</p>
                  <div className="flex flex-wrap gap-2">
                    {userBadges.map((b) => (
                      <div
                        key={b}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-sm"
                      >
                        <span>{BADGE_DEFS.find((d) => d.key === b)?.icon}</span>
                        <span>{t(`voices_badge_${b}`)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* User recordings list */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{t('voices_profile_recordings')}</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {userVoices.map((v) => {
                    const vVocab = v.vocabId ? vocabById.get(v.vocabId) : undefined;
                    const vWord = vVocab
                      ? (vVocab.dialects?.[v.dialect] ?? getText({ en: vVocab.en, fa: vVocab.fa, ku: vVocab.ku }, lang))
                      : '';
                    return (
                      <div
                        key={v.id}
                        className="flex items-center justify-between gap-2 p-3 rounded-xl bg-white/5 border border-white/5 text-sm"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{v.title}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            {vWord && <span className="text-[var(--accent)]">{vWord}</span>}
                            <span>•</span>
                            <span>{t(`dialect_${v.dialect}`)}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="inline-flex items-center gap-1 text-green-400">
                            <ThumbsUp className="w-3 h-3" />
                            {v.likes}
                          </span>
                          <span className="inline-flex items-center gap-1 text-red-400">
                            <ThumbsDown className="w-3 h-3" />
                            {v.dislikes}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
