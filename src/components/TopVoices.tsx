'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Crown, Play, Pause, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { VoiceItem } from '@/components/VoiceCard';

const DIALECT_STYLES: Record<string, string> = {
  sorani: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  kalhori: 'bg-green-500/15 text-green-400 border-green-500/25',
  kurmanji: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
};

interface RankStyle {
  gradient: string;
  border: string;
  glow: string;
  text: string;
  badge: string;
  label: string;
}

const RANK_STYLES: RankStyle[] = [
  // index 0 unused — placeholder, never accessed since ranks start at 1
  { gradient: '', border: '', glow: '', text: '', badge: '', label: '' },
  {
    gradient: 'from-amber-400/20 to-amber-600/10',
    border: 'border-amber-400/40',
    glow: 'shadow-amber-400/20',
    text: 'text-amber-400',
    badge: 'bg-amber-400 text-black',
    label: '#1',
  },
  {
    gradient: 'from-slate-300/15 to-slate-500/10',
    border: 'border-slate-400/30',
    glow: 'shadow-slate-400/15',
    text: 'text-slate-300',
    badge: 'bg-slate-400 text-black',
    label: '#2',
  },
  {
    gradient: 'from-orange-600/15 to-orange-800/10',
    border: 'border-orange-700/30',
    glow: 'shadow-orange-700/15',
    text: 'text-orange-400',
    badge: 'bg-orange-700 text-white',
    label: '#3',
  },
];

export default function TopVoices() {
  const { t, lang, dir } = useApp();
  const [voices, setVoices] = useState<VoiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/voices/top');
        const data = await res.json();
        if (!cancelled) setVoices(data.voices || []);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const fontClass = lang === 'en' ? 'font-en' : 'font-ku';

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (voices.length === 0) {
    return null; // TopVoices silently hides when no data
  }

  // Pad to 3, sort: [1st, 2nd, 3rd] -> display as [2nd, 1st, 3rd]
  const padded: (VoiceItem | null)[] = [voices[0], voices[1] || null, voices[2] || null];
  const displayOrder = [1, 0, 2]; // 2nd, 1st, 3rd

  return (
    <div dir={dir} className={cn('w-full', fontClass)}>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-3 sm:items-end">
        {displayOrder.map((voiceIdx, displayIdx) => {
          const voice = padded[voiceIdx];
          const rank = voiceIdx + 1;
          const isFirst = rank === 1;
          const style = RANK_STYLES[rank];

          return (
            <motion.div
              key={rank}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: voice ? 1 : 0.3, y: 0 }}
              transition={{ duration: 0.5, delay: displayIdx * 0.15, ease: 'easeOut' }}
              className={cn(
                'relative rounded-2xl border glass overflow-hidden transition-all duration-300 group',
                'w-full sm:w-auto',
                isFirst ? 'sm:pb-6 sm:-mb-3' : '',
                voice ? style.border : 'border-white/5',
                voice ? `bg-gradient-to-b ${style.gradient}` : 'bg-white/[0.02]',
                voice ? `shadow-lg ${style.glow}` : '',
              )}
              style={{ maxWidth: isFirst ? '340px' : '280px' }}
            >
              {voice ? (
                <TopVoiceCard
                  voice={voice}
                  rank={rank}
                  style={style}
                  t={t}
                  dir={dir}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 h-44">
                  <div className={cn('w-12 h-12 rounded-full flex items-center justify-center text-2xl opacity-30', style.badge)}>
                    {rank}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function TopVoiceCard({
  voice,
  rank,
  style,
  t,
  dir,
}: {
  voice: VoiceItem;
  rank: number;
  style: RankStyle;
  t: (k: string, vars?: Record<string, string | number>) => string;
  dir: string;
}) {
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
      audioRef.current = new Audio(voice.filePath);
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

  const isFirst = rank === 1;

  return (
    <div className={cn('p-5 flex flex-col items-center text-center gap-3', isFirst ? 'pt-6 pb-8' : 'py-5')}>
      {/* Crown for #1 */}
      {isFirst && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Crown className="w-7 h-7 text-amber-400 drop-shadow-lg" />
        </motion.div>
      )}

      {/* Rank badge */}
      <div className={cn('w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg', style.badge)}>
        {rank}
      </div>

      {/* Nickname */}
      <p className="font-bold text-base truncate max-w-full">{voice.nickname}</p>

      {/* Dialect badge */}
      <Badge
        variant="outline"
        className={cn('text-[10px] px-2 py-0.5 rounded-full border', DIALECT_STYLES[voice.dialect] || '')}
      >
        {t(`dialect_${voice.dialect}`)}
      </Badge>

      {/* Title */}
      <p className="text-sm text-muted-foreground line-clamp-1 max-w-full">{voice.title}</p>

      {/* Like / dislike counts (display-only on the podium) */}
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1 text-sm font-medium text-green-400">
          <ThumbsUp className="w-3.5 h-3.5" />
          <span className="tabular-nums">{voice.likes}</span>
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-red-400/80">
          <ThumbsDown className="w-3.5 h-3.5" />
          <span className="tabular-nums">{voice.dislikes}</span>
        </span>
      </div>

      {/* Play button */}
      <button
        onClick={toggle}
        className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110',
          isFirst
            ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-lg shadow-amber-500/30'
            : 'bg-white/10 text-foreground hover:bg-white/15'
        )}
      >
        {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>
    </div>
  );
}
