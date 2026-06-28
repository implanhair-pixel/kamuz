'use client';

import { Zap, Flame, Trophy, Target, BookCheck, Star, TrendingUp } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { lessons } from '@/data/lessons';
import { vocabulary } from '@/data/vocabulary';
import { cn, formatNumber, todayISODate } from '@/lib/utils';

const ACHIEVEMENTS = [
  { id: 'first_lesson', icon: Star, titleKey: 'achievement_first_steps', descKey: 'achievement_first_steps_desc', check: (g: any, p: any) => Object.values(p.lessons).some((l: any) => l.completed) },
  { id: 'streak_7', icon: Flame, titleKey: 'achievement_streak_7', descKey: 'achievement_streak_7_desc', check: (g: any) => g.streak >= 7 },
  { id: 'streak_30', icon: Flame, titleKey: 'achievement_streak_30', descKey: 'achievement_streak_30_desc', check: (g: any) => g.streak >= 30 },
  { id: 'quiz_perfect', icon: Trophy, titleKey: 'achievement_quiz_perfect', descKey: 'achievement_quiz_perfect_desc', check: (g: any, p: any) => Object.values(p.lessons).some((l: any) => l.score === 100) },
];

export default function StatsDashboard() {
  const { t, gamification, level, levelProgress, progress, srsItems, savedWords, lang } = useApp();

  const completedLessons = Object.values(progress.lessons).filter((l) => l.completed).length;
  const masteredWords = Object.values(srsItems).filter((i) => i.box >= 4).length;
  const todayXp = gamification.xpHistory[todayISODate()] || 0;
  const accuracy = gamification.totalReviews > 0
    ? Math.round((gamification.totalCorrect / gamification.totalReviews) * 100)
    : 0;

  // Build last 7 days XP chart
  const days: { date: string; label: string; xp: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    days.push({
      date: iso,
      label: d.toLocaleDateString(lang === 'fa' ? 'fa' : 'en', { weekday: 'short' }),
      xp: gamification.xpHistory[iso] || 0,
    });
  }
  const maxXp = Math.max(...days.map((d) => d.xp), 100);

  const cards = [
    { icon: Zap, label: t('stats_xp_earned'), value: formatNumber(gamification.xp), color: 'text-amber-400 bg-amber-500/10' },
    { icon: Flame, label: t('stats_streak'), value: gamification.streak, color: 'text-orange-400 bg-orange-500/10' },
    { icon: Trophy, label: t('xp_level', { level }), value: `Lv ${level}`, color: 'text-purple-400 bg-purple-500/10' },
    { icon: BookCheck, label: t('stats_completed'), value: `${completedLessons}/${lessons.length}`, color: 'text-cyan-400 bg-cyan-500/10' },
    { icon: Star, label: t('stats_mastered'), value: masteredWords, color: 'text-green-400 bg-green-500/10' },
    { icon: Target, label: t('srs_accuracy'), value: `${accuracy}%`, color: 'text-rose-400 bg-rose-500/10' },
  ];

  return (
    <section id="stats" className="relative py-20 px-4 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">{t('nav_stats')}</h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            {t('xp_daily_goal')}: {todayXp} / 100 XP
          </p>
        </div>

        {/* Daily goal bar */}
        <div className="glass rounded-2xl border border-white/10 p-5 mb-8 fade-up delay-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Target className="w-4 h-4 text-[var(--accent)]" />
              {t('xp_daily_goal')}
            </div>
            <span className="text-sm text-muted-foreground">
              {todayXp} / 100 XP
            </span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--accent)] to-[color-mix(in_oklch,var(--accent)_60%,white)] transition-all duration-500"
              style={{ width: `${Math.min(100, todayXp)}%` }}
            />
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className={`glass rounded-2xl p-5 border border-white/10 fade-up delay-${(i % 6) + 1}`}
              >
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center mb-3', c.color)}>
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold tabular-nums">{c.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
              </div>
            );
          })}
        </div>

        {/* Level progress */}
        <div className="glass rounded-2xl border border-white/10 p-5 mb-8 fade-up">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
              {t('xp_level', { level })}
            </div>
            <span className="text-xs text-muted-foreground">
              {levelProgress.current} / {levelProgress.needed} XP
            </span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] transition-all duration-500"
              style={{ width: `${levelProgress.pct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {levelProgress.needed - levelProgress.current} XP to level {level + 1}
          </p>
        </div>

        {/* Weekly XP chart */}
        <div className="glass rounded-2xl border border-white/10 p-5 mb-8 fade-up">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
            {t('stats_xp_earned')} · 7 {lang === 'fa' ? 'روز' : lang === 'ku' ? 'ڕۆژ' : 'days'}
          </h3>
          <div className="flex items-end justify-between gap-2 h-32">
            {days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-[var(--accent)]/30 to-[var(--accent)] rounded-t-md transition-all duration-500 hover:opacity-80"
                    style={{ height: `${Math.max(4, (d.xp / maxXp) * 100)}%` }}
                    title={`${d.xp} XP`}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="glass rounded-2xl border border-white/10 p-5 fade-up">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[var(--accent)]" />
            {lang === 'fa' ? 'دستاوردها' : lang === 'ku' ? 'دەستکەوتەکان' : 'Achievements'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ACHIEVEMENTS.map((a) => {
              const unlocked = a.check(gamification, progress);
              const Icon = a.icon;
              return (
                <div
                  key={a.id}
                  className={cn(
                    'rounded-xl p-4 border text-center transition-all',
                    unlocked
                      ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30'
                      : 'glass border-white/5 opacity-40 grayscale'
                  )}
                >
                  <div className={cn('w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2', unlocked ? 'bg-[var(--accent)]/20' : 'bg-white/5')}>
                    <Icon className={cn('w-5 h-5', unlocked ? 'text-[var(--accent)]' : 'text-muted-foreground')} aria-hidden="true" />
                  </div>
                  <div className="text-xs font-semibold mb-0.5">{t(a.titleKey)}</div>
                  <div className="text-[10px] text-muted-foreground leading-tight">{t(a.descKey)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
