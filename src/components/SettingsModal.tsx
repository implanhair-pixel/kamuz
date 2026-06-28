'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor, Palette, Type, Zap, AlertTriangle, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { AccentColor, FontSize, ThemeMode } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ACCENTS: { id: AccentColor; hex: string; label: string }[] = [
  { id: 'amber', hex: '#f59e0b', label: 'Amber' },
  { id: 'cyan', hex: '#22d3ee', label: 'Cyan' },
  { id: 'purple', hex: '#a78bfa', label: 'Purple' },
  { id: 'green', hex: '#4ade80', label: 'Green' },
  { id: 'rose', hex: '#fb7185', label: 'Rose' },
];

const THEME_MODES: { id: ThemeMode; icon: React.ComponentType<{ className?: string }>; labelKey: string }[] = [
  { id: 'dark', icon: Moon, labelKey: 'settings_theme_dark' },
  { id: 'light', icon: Sun, labelKey: 'settings_theme_light' },
  { id: 'system', icon: Monitor, labelKey: 'settings_theme_system' },
];

const FONT_SIZES: { id: FontSize; labelKey: string; sample: string }[] = [
  { id: 'sm', labelKey: 'settings_font_sm', sample: 'Aa' },
  { id: 'base', labelKey: 'settings_font_base', sample: 'Aa' },
  { id: 'lg', labelKey: 'settings_font_lg', sample: 'Aa' },
];

export default function SettingsModal({ isOpen, onClose }: Props) {
  const { t, theme, setTheme, resetAll } = useApp();
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('settings_title')}
    >
      <div
        className="glass rounded-3xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 glass border-b border-white/5 p-5 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold">{t('settings_title')}</h2>
          <button
            onClick={onClose}
            aria-label={t('settings_close')}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Theme mode */}
          <section>
            <div className="flex items-center gap-2 mb-3 text-sm font-medium">
              <Palette className="w-4 h-4 text-[var(--accent)]" />
              {t('settings_theme')}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {THEME_MODES.map((m) => {
                const Icon = m.icon;
                const active = theme.mode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setTheme({ mode: m.id })}
                    className={cn(
                      'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all',
                      active
                        ? 'bg-[var(--accent)]/10 border-[var(--accent)]/40 text-[var(--accent)]'
                        : 'glass border-white/10 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{t(m.labelKey)}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Accent color */}
          <section>
            <div className="flex items-center gap-2 mb-3 text-sm font-medium">
              <Zap className="w-4 h-4 text-[var(--accent)]" />
              {t('settings_accent')}
            </div>
            <div className="flex flex-wrap gap-3">
              {ACCENTS.map((a) => {
                const active = theme.accent === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => setTheme({ accent: a.id })}
                    aria-label={a.label}
                    className={cn(
                      'w-11 h-11 rounded-full border-2 transition-all flex items-center justify-center',
                      active ? 'scale-110 border-white' : 'border-transparent hover:scale-105'
                    )}
                    style={{ backgroundColor: a.hex }}
                  >
                    {active && <span className="text-white text-xs">✓</span>}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Font size */}
          <section>
            <div className="flex items-center gap-2 mb-3 text-sm font-medium">
              <Type className="w-4 h-4 text-[var(--accent)]" />
              {t('settings_font_size')}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {FONT_SIZES.map((f) => {
                const active = theme.fontSize === f.id;
                const sizeCls = f.id === 'sm' ? 'text-sm' : f.id === 'lg' ? 'text-2xl' : 'text-lg';
                return (
                  <button
                    key={f.id}
                    onClick={() => setTheme({ fontSize: f.id })}
                    className={cn(
                      'flex flex-col items-center gap-1 p-3 rounded-xl border transition-all',
                      active
                        ? 'bg-[var(--accent)]/10 border-[var(--accent)]/40 text-[var(--accent)]'
                        : 'glass border-white/10 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <span className={cn('font-bold', sizeCls)}>{f.sample}</span>
                    <span className="text-xs">{t(f.labelKey)}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Reduced motion */}
          <section>
            <label className="flex items-center justify-between gap-3 p-3 rounded-xl glass border border-white/10 cursor-pointer">
              <span className="text-sm font-medium">{t('settings_reduced_motion')}</span>
              <button
                onClick={() => setTheme({ reducedMotion: !theme.reducedMotion })}
                role="switch"
                aria-checked={theme.reducedMotion}
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors',
                  theme.reducedMotion ? 'bg-[var(--accent)]' : 'bg-white/10'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform',
                    theme.reducedMotion ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0.5 rtl:-translate-x-0.5'
                  )}
                />
              </button>
            </label>
          </section>

          {/* Danger zone */}
          <section className="pt-2 border-t border-white/5">
            {confirmReset ? (
              <div className="glass rounded-xl p-4 border border-red-500/30 space-y-3">
                <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
                  <AlertTriangle className="w-4 h-4" />
                  {t('settings_reset_confirm')}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      resetAll();
                      setConfirmReset(false);
                      onClose();
                    }}
                    className="flex-1 py-2 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 text-sm font-medium hover:bg-red-500/25 transition-colors"
                  >
                    {t('confirm')}
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 py-2 rounded-lg glass border border-white/10 text-sm font-medium hover:bg-white/5 transition-colors"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-medium hover:bg-red-500/15 transition-colors flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                {t('settings_reset')}
              </button>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
