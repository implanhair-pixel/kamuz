'use client';

import {
  Layers,
  Repeat,
  Globe2,
  HelpCircle,
  Trophy,
  WifiOff,
  Mic,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const FEATURES = [
  {
    icon: Layers,
    titleKey: 'feature_flashcards_title',
    descKey: 'feature_flashcards_desc',
    color: 'amber',
  },
  {
    icon: Repeat,
    titleKey: 'feature_srs_title',
    descKey: 'feature_srs_desc',
    color: 'cyan',
  },
  {
    icon: Globe2,
    titleKey: 'feature_dialects_title',
    descKey: 'feature_dialects_desc',
    color: 'rose',
  },
  {
    icon: HelpCircle,
    titleKey: 'feature_quiz_title',
    descKey: 'feature_quiz_desc',
    color: 'purple',
  },
  {
    icon: Trophy,
    titleKey: 'feature_gamification_title',
    descKey: 'feature_gamification_desc',
    color: 'green',
  },
  {
    icon: WifiOff,
    titleKey: 'feature_offline_title',
    descKey: 'feature_offline_desc',
    color: 'amber',
  },
  {
    icon: Mic,
    titleKey: 'feature_voices_title',
    descKey: 'feature_voices_desc',
    color: 'emerald',
  },
] as const;

const COLOR_MAP: Record<string, string> = {
  amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  green: 'text-green-400 bg-green-500/10 border-green-500/20',
  emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

export default function Features() {
  const { t } = useApp();

  return (
    <section id="features" className="relative py-20 sm:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">{t('features_title')}</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            {t('features_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.titleKey}
                className={`glass rounded-2xl p-6 border border-white/10 hover:border-[var(--accent)]/30 transition-all hover:-translate-y-1 fade-up delay-${
                  (i % 6) + 1
                } group`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${COLOR_MAP[feature.color]} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t(feature.titleKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(feature.descKey)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
