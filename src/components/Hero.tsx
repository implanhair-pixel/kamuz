'use client';

import { ArrowRight, BarChart3, BookOpen, Sparkles } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getFontClass } from '@/lib/utils';

interface Props {
  onNavigate: (id: string) => void;
}

export default function Hero({ onNavigate }: Props) {
  const { t, lang } = useApp();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-20 px-4 overflow-hidden mesh-bg"
    >
      {/* Floating decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/4 -left-20 w-72 h-72 rounded-full opacity-20 blur-3xl animate-float"
          style={{ background: 'var(--accent)' }}
        />
        <div
          className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full opacity-10 blur-3xl animate-float"
          style={{ background: 'var(--accent)', animationDelay: '2s' }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[var(--accent)]/20 text-[var(--accent)] text-sm mb-8 fade-up">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
          </span>
          <span>{t('hero_badge')}</span>
        </div>

        {/* Heading */}
        <h1 className="mb-6">
          <div
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight fade-up delay-1 ${getFontClass(
              lang
            )}`}
          >
            <span className="gradient-text">{t('hero')}</span>
          </div>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 fade-up delay-3 leading-relaxed">
          {t('hero_sub')}
        </p>

        {/* Example word showcase */}
        <div className="relative mb-10 fade-up delay-3 max-w-2xl mx-auto">
          <div className="glass rounded-2xl border border-white/10 p-6 overflow-hidden">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Sorani</p>
                <p className="text-2xl font-bold text-[var(--accent)] font-kurdish" dir="rtl" lang="ckb">
                  سڵاو
                </p>
              </div>
              <div className="space-y-1 border-x border-white/5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Kurmanji</p>
                <p className="text-2xl font-bold text-cyan-400">Silav</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Kalhori</p>
                <p className="text-2xl font-bold text-green-400 font-kurdish" dir="rtl" lang="ckb">سڵاو</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              “Hello” across three Kurdish dialects
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-up delay-4">
          <button
            onClick={() => onNavigate('paths')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[var(--accent)] text-[#0a0a0f] font-semibold text-base shadow-lg shadow-[var(--accent)]/20 transition-all hover:-translate-y-0.5 hover:shadow-[var(--accent)]/30 w-full sm:w-auto justify-center"
          >
            {t('cta_start')}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
          <button
            onClick={() => onNavigate('compare')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl glass text-foreground font-medium text-base hover:bg-white/10 transition-colors border border-white/10 w-full sm:w-auto justify-center"
          >
            <BarChart3 className="w-4 h-4" aria-hidden="true" />
            {t('cta_compare')}
          </button>
          <button
            onClick={() => onNavigate('vocabulary')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl glass text-foreground font-medium text-base hover:bg-white/10 transition-colors border border-white/10 w-full sm:w-auto justify-center"
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            {t('cta_browse')}
          </button>
        </div>

        {/* Scroll hint */}
        <div className="mt-16 flex justify-center fade-up delay-5">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/40 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 bg-muted-foreground/60 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
