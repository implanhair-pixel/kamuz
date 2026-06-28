'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  Search,
  Settings,
  Globe,
  Flame,
  Zap,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { Lang } from '@/types';
import { cn } from '@/lib/utils';
import ProfileButton from '@/components/ProfileButton';

interface NavItem {
  id: string;
  labelKey: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', labelKey: 'nav_home' },
  { id: 'paths', labelKey: 'nav_paths' },
  { id: 'vocabulary', labelKey: 'nav_vocab' },
  { id: 'voices', labelKey: 'nav_voices' },
  { id: 'compare', labelKey: 'nav_compare' },
  { id: 'stats', labelKey: 'nav_stats' },
];

// Secondary items shown in mobile menu only
const SECONDARY_NAV_ITEMS: NavItem[] = [
  { id: 'about', labelKey: 'nav_about' },
  { id: 'admin', labelKey: 'nav_admin' },
  { id: 'privacy', labelKey: 'nav_privacy' },
  { id: 'terms', labelKey: 'nav_terms' },
  { id: 'contact', labelKey: 'nav_contact' },
];

interface Props {
  activeView: string;
  onNavigate: (id: string) => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
}

export default function Navbar({ activeView, onNavigate, onOpenSearch, onOpenSettings }: Props) {
  const { t, lang, setLang, gamification, level, isRTL } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const langs: { code: Lang; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'fa', label: 'فارسی' },
    { code: 'ku', label: 'کوردی' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Cmd/Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onOpenSearch]);

  const handleNav = useCallback(
    (id: string) => {
      onNavigate(id);
      setMobileOpen(false);
    },
    [onNavigate]
  );

  return (
    <nav
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled ? 'glass border-b border-white/5 shadow-2xl' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 flex-shrink-0 group"
            aria-label={t('brand')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[color-mix(in_oklch,var(--accent)_60%,black)] flex items-center justify-center text-[#0a0a0f] font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
              ک
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:block">
              {t('brand')}
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={cn(
                  'px-3.5 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeView === item.id
                    ? 'text-foreground bg-white/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                )}
              >
                {t(item.labelKey)}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* XP & streak badges (desktop) */}
            <div className="hidden lg:flex items-center gap-1.5 mr-1">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)]">
                <Zap className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="text-xs font-bold tabular-nums">{gamification.xp}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400">
                <Flame className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="text-xs font-bold tabular-nums">{gamification.streak}</span>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <span className="text-xs font-bold">Lv {level}</span>
              </div>
            </div>

            {/* Profile */}
            <ProfileButton onNavigate={onNavigate} />

            {/* Search */}
            <button
              onClick={onOpenSearch}
              aria-label={t('search_global_label')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 border border-white/10 transition-colors"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              <span className="hidden lg:block text-xs text-muted-foreground/70 font-mono">⌘K</span>
            </button>

            {/* Language */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen((v) => !v)}
                aria-label={t('search_change_lang')}
                aria-expanded={langOpen}
                aria-haspopup="listbox"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <Globe className="w-4 h-4" aria-hidden="true" />
                <span className="uppercase">{lang}</span>
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              {langOpen && (
                <div
                  className={cn(
                    'absolute top-12 glass rounded-xl p-1 shadow-2xl min-w-[140px] z-50 border border-white/10',
                    isRTL ? 'left-0' : 'right-0'
                  )}
                  role="listbox"
                >
                  {langs.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setLangOpen(false);
                      }}
                      role="option"
                      aria-selected={lang === l.code}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors',
                        lang === l.code ? 'text-[var(--accent)] font-semibold' : 'text-foreground'
                      )}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              aria-label={t('settings_title')}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 border border-white/10 transition-colors"
            >
              <Settings className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/5 animate-in slide-in-from-top duration-300">
          <div className="px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={cn(
                  'block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors',
                  activeView === item.id
                    ? 'text-[var(--accent)] bg-[var(--accent)]/10'
                    : 'text-foreground hover:bg-white/5'
                )}
              >
                {t(item.labelKey)}
              </button>
            ))}
            {SECONDARY_NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={cn(
                  'block w-full text-left px-4 py-3 rounded-xl text-sm transition-colors',
                  activeView === item.id
                    ? 'text-[var(--accent)] bg-[var(--accent)]/10'
                    : 'text-muted-foreground hover:bg-white/5'
                )}
              >
                {t(item.labelKey)}
              </button>
            ))}
            <div className="flex items-center gap-3 pt-3 mt-3 border-t border-white/5">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)]">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-bold">{gamification.xp} XP</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400">
                <Flame className="w-4 h-4" />
                <span className="text-sm font-bold">{gamification.streak}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
