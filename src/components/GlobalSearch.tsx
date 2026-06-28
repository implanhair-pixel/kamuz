'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, BookOpen, Languages, Layers } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { vocabulary } from '@/data/vocabulary';
import { lessons } from '@/data/lessons';
import { dialects } from '@/data/dialects';
import { getText, cn } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

interface Result {
  type: 'vocab' | 'lesson' | 'dialect';
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function GlobalSearch({ isOpen, onClose, onNavigate }: Props) {
  const { t, lang } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset query + focus only when the modal *becomes* open (toggle effect).
  // Using a ref guard so setState runs once per open, not cascading.
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      wasOpenRef.current = true;
      requestAnimationFrame(() => {
        setQuery('');
        inputRef.current?.focus();
      });
    } else if (!isOpen) {
      wasOpenRef.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out: Result[] = [];
    for (const v of vocabulary) {
      if (
        v.en.toLowerCase().includes(q) ||
        v.fa.includes(q) ||
        v.ku.includes(q) ||
        Object.values(v.dialects).some((d) => d.toLowerCase().includes(q))
      ) {
        out.push({
          type: 'vocab',
          id: v.id,
          title: v.dialects.sorani ?? v.ku,
          subtitle: `${v.en} · ${v.fa}`,
          icon: Layers,
        });
      }
      if (out.length > 20) break;
    }
    for (const l of lessons) {
      const title = getText(l.title, lang);
      const desc = getText(l.description, lang);
      if (title.toLowerCase().includes(q) || desc.toLowerCase().includes(q) || l.id.includes(q)) {
        out.push({
          type: 'lesson',
          id: l.id,
          title,
          subtitle: desc,
          icon: BookOpen,
        });
      }
    }
    for (const d of dialects) {
      const name = getText(d.name, lang);
      if (name.toLowerCase().includes(q) || d.id.includes(q)) {
        out.push({
          type: 'dialect',
          id: d.id,
          title: name,
          subtitle: getText(d.region, lang),
          icon: Languages,
        });
      }
    }
    return out;
  }, [query, lang]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center pt-[15vh] p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('search_global_label')}
    >
      <div
        className="glass rounded-2xl border border-white/10 w-full max-w-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 p-4 border-b border-white/5">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search_placeholder')}
            className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-muted-foreground"
            aria-label={t('search_placeholder')}
          />
          <button
            onClick={onClose}
            aria-label={t('close')}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {!query ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              {t('search_hint')}
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              {t('search_no_results')}
            </div>
          ) : (
            <div className="p-2">
              {results.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={`${r.type}-${r.id}`}
                    onClick={() => {
                      onNavigate(r.type === 'lesson' ? 'paths' : r.type === 'dialect' ? 'compare' : 'vocabulary');
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{r.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{r.subtitle}</div>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 flex-shrink-0">
                      {r.type}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
