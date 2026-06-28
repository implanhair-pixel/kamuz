'use client';

import { Users, BookOpen, Languages, Zap } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { vocabulary } from '@/data/vocabulary';
import { lessons } from '@/data/lessons';
import { dialects } from '@/data/dialects';

export default function Stats() {
  const { t, gamification } = useApp();

  const stats = [
    {
      icon: Users,
      value: '10,000+',
      label: t('stats_learners'),
      color: 'text-amber-400',
    },
    {
      icon: BookOpen,
      value: vocabulary.length.toString(),
      label: t('stats_words'),
      color: 'text-cyan-400',
    },
    {
      icon: BookOpen,
      value: lessons.length.toString(),
      label: t('stats_lessons'),
      color: 'text-purple-400',
    },
    {
      icon: Languages,
      value: dialects.length.toString(),
      label: t('stats_dialects'),
      color: 'text-rose-400',
    },
    {
      icon: Zap,
      value: gamification.xp.toString(),
      label: t('stats_xp_earned'),
      color: 'text-green-400',
    },
  ];

  return (
    <section className="relative py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 fade-up">
          <h2 className="text-2xl sm:text-3xl font-bold">{t('stats_title')}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className={`glass rounded-2xl p-5 border border-white/10 text-center fade-up delay-${i + 1}`}
              >
                <div className={`w-10 h-10 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-3 ${s.color}`}>
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold tabular-nums">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
