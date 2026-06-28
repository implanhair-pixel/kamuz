'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Check, RotateCcw, Trophy } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { MatchingPair, Lang } from '@/types';
import { getText, cn, shuffle } from '@/lib/utils';

interface Props {
  pairs: MatchingPair[];
  lang: Lang;
  onComplete?: (moves: number, matched: number) => void;
}

interface Tile {
  uid: string; // unique key per tile (pair id + side)
  pairId: string;
  side: 'term' | 'meaning';
  text: string;
}

// Build tiles outside React state — derived from props (memoized).
// A re-shuffle uses a `seed` counter to bust the memo.
function buildTiles(pairs: MatchingPair[], lang: Lang): Tile[] {
  const built: Tile[] = [];
  for (const p of pairs) {
    built.push({ uid: `${p.id}-t`, pairId: p.id, side: 'term', text: getText(p.term, lang) });
    built.push({ uid: `${p.id}-m`, pairId: p.id, side: 'meaning', text: getText(p.meaning, lang) });
  }
  return shuffle(built);
}

export default function MatchingGame({ pairs, lang, onComplete }: Props) {
  const { t, addXP } = useApp();
  const [seed, setSeed] = useState(0);
  const tiles = useMemo(() => buildTiles(pairs, lang), [pairs, lang, seed]);
  const [selected, setSelected] = useState<Tile | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<[string, string] | null>(null);
  const [moves, setMoves] = useState(0);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState<number>(() => Date.now());
  const [elapsed, setElapsed] = useState(0);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Reset gameplay state when pairs/lang/seed change — render-phase reset
  // (documented React pattern) instead of setState-in-effect.
  const inputsKey = `${pairs.map((p) => p.id).join(',')}|${lang}|${seed}`;
  const prevInputsRef = useRef(inputsKey);
  if (prevInputsRef.current !== inputsKey) {
    prevInputsRef.current = inputsKey;
    setMatched(new Set());
    setSelected(null);
    setMoves(0);
    setFinished(false);
    setStartTime(Date.now());
    setElapsed(0);
  }

  // Timer
  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [startTime, finished]);

  // Win detection handled inside handleClick (no setState-in-effect).

  const handleClick = useCallback(
    (tile: Tile) => {
      if (matched.has(tile.pairId)) return;
      if (wrong) return;

      if (!selected) {
        setSelected(tile);
        return;
      }

      if (selected.uid === tile.uid) {
        setSelected(null);
        return;
      }

      const newMoves = moves + 1;
      setMoves(newMoves);

      if (selected.pairId === tile.pairId && selected.side !== tile.side) {
        // match
        const newMatched = new Set(matched);
        newMatched.add(tile.pairId);
        setMatched(newMatched);
        setSelected(null);
        // Win detection — if all matched, fire side effects now (not in effect).
        if (newMatched.size === pairs.length) {
          const xp = Math.max(10, 60 - newMoves * 2);
          addXP(xp, 'matching');
          onCompleteRef.current?.(newMoves, newMatched.size);
          setFinished(true);
        }
      } else {
        // wrong
        setWrong([selected.uid, tile.uid]);
        setTimeout(() => {
          setWrong(null);
          setSelected(null);
        }, 600);
      }
    },
    [selected, matched, wrong, moves, pairs.length, addXP]
  );

  const handleRestart = useCallback(() => {
    setSeed((s) => s + 1); // busts tiles memo
    setMatched(new Set());
    setSelected(null);
    setMoves(0);
    setFinished(false);
    setStartTime(Date.now());
    setElapsed(0);
  }, []);

  if (finished) {
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    return (
      <div className="glass rounded-2xl p-8 text-center border border-[var(--accent)]/20">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/40 flex items-center justify-center">
          <Trophy className="w-10 h-10 text-[var(--accent)]" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold mb-2">{t('matching_complete')}</h3>
        <div className="flex justify-center gap-6 mb-4 text-sm">
          <div>
            <div className="text-muted-foreground text-xs">{t('matching_moves')}</div>
            <div className="font-bold text-[var(--accent)] text-xl">{moves}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">{t('matching_time')}</div>
            <div className="font-bold text-[var(--accent)] text-xl">
              {mins}:{secs.toString().padStart(2, '0')}
            </div>
          </div>
        </div>
        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 text-sm font-medium hover:bg-[var(--accent)]/20 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {t('matching_restart')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {t('matching_pairs')}: {matched.size}/{pairs.length}
        </span>
        <div className="flex gap-4 text-xs">
          <span className="text-[var(--accent)]">
            {t('matching_moves')}: <span className="font-bold">{moves}</span>
          </span>
          <span className="text-muted-foreground">
            {t('matching_time')}: {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-300"
          style={{ width: `${(matched.size / pairs.length) * 100}%` }}
        />
      </div>

      <p className="text-xs text-center text-muted-foreground">{t('matching_subtitle')}</p>

      {/* Grid of tiles */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {tiles.map((tile) => {
          const isMatched = matched.has(tile.pairId);
          const isSelected = selected?.uid === tile.uid;
          const isWrong = wrong?.includes(tile.uid);
          return (
            <button
              key={tile.uid}
              onClick={() => handleClick(tile)}
              disabled={isMatched}
              className={cn(
                'relative p-4 rounded-xl border min-h-[72px] flex items-center justify-center text-center transition-all',
                isMatched && 'bg-green-500/10 border-green-500/30 text-green-400 opacity-60',
                !isMatched && isSelected && 'bg-[var(--accent)]/15 border-[var(--accent)]/50 text-[var(--accent)] scale-[1.02]',
                !isMatched && isWrong && 'bg-red-500/10 border-red-500/50 text-red-400 animate-pulse',
                !isMatched && !isSelected && !isWrong && 'glass border-white/10 hover:border-[var(--accent)]/30 hover:bg-white/5'
              )}
            >
              <span
                className="text-sm font-medium leading-tight"
                dir={tile.side === 'term' && lang !== 'en' ? 'rtl' : 'ltr'}
                lang={lang === 'ku' ? 'ckb' : lang}
              >
                {tile.text}
              </span>
              {isMatched && (
                <Check className="absolute top-1.5 right-1.5 w-3.5 h-3.5" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
