'use client';

import { Send, Instagram, Youtube, Heart } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface Props {
  onNavigate: (id: string) => void;
}

export default function Footer({ onNavigate }: Props) {
  const { t } = useApp();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-auto border-t border-white/5 py-10 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[color-mix(in_oklch,var(--accent)_60%,black)] flex items-center justify-center text-[#0a0a0f] font-bold text-lg">
              ک
            </div>
            <span className="font-bold text-lg">{t('brand')}</span>
          </button>

          {/* Social */}
          <div className="flex items-center gap-3">
            <a
              href="https://t.me/kurdamuz"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              aria-label="Telegram"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="https://instagram.com/kurdamuz"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="https://youtube.com/@kurdamuz"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-5 text-sm text-muted-foreground">
            <button onClick={() => onNavigate('about')} className="hover:text-foreground transition-colors">
              {t('nav_about')}
            </button>
            <button onClick={() => onNavigate('privacy')} className="hover:text-foreground transition-colors">
              {t('link_privacy')}
            </button>
            <button onClick={() => onNavigate('terms')} className="hover:text-foreground transition-colors">
              {t('link_terms')}
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-foreground transition-colors">
              {t('link_contact')}
            </button>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <span>{t('footer_copyright', { year: String(year) })}</span>
          <span className="inline-flex items-center gap-1">
            · made with <Heart className="w-3 h-3 text-[var(--accent)] fill-current" aria-hidden="true" />
          </span>
        </div>
      </div>
    </footer>
  );
}
