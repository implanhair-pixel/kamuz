'use client';

import { Sparkles, Compass, Briefcase, CheckCircle2, Lock } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { learningPaths } from '@/data/paths';
import { lessons } from '@/data/lessons';
import { cn } from '@/lib/utils';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Compass,
  Briefcase,
};

const COLOR_MAP: Record<string, { text: string; bg: string; border: string; gradient: string }> = {
  amber: {
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    gradient: 'from-amber-500/20 to-amber-500/5',
  },
  cyan: {
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    gradient: 'from-cyan-500/20 to-cyan-500/5',
  },
  rose: {
    text: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    gradient: 'from-rose-500/20 to-rose-500/5',
  },
};

interface Props {
  onSelectLesson: (lessonId: string) => void;
}

export default function Paths({ onSelectLesson }: Props) {
  const { t, isLessonCompleted, progress } = useApp();

  return (
    <section id="paths" className="relative py-20 px-4 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">{t('paths_title')}</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            {t('paths_subtitle')}
          </p>
        </div>

        <div className="space-y-8">
          {learningPaths.map((path, pIdx) => {
            const Icon = ICONS[path.icon] ?? Sparkles;
            const colors = COLOR_MAP[path.color] ?? COLOR_MAP.amber;
            const pathLessons = path.lessonIds
              .map((id) => lessons.find((l) => l.id === id))
              .filter(Boolean) as typeof lessons;

            const completedCount = pathLessons.filter((l) =>
              isLessonCompleted(l.id)
            ).length;
            const pct = pathLessons.length
              ? Math.round((completedCount / pathLessons.length) * 100)
              : 0;

            return (
              <div
                key={path.id}
                className={cn(
                  'glass rounded-3xl border overflow-hidden fade-up',
                  colors.border
                )}
              >
                {/* Path header */}
                <div className={cn('bg-gradient-to-r p-6 flex items-center gap-4', colors.gradient)}>
                  <div
                    className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border',
                      colors.bg,
                      colors.border
                    )}
                  >
                    <Icon className={cn('w-7 h-7', colors.text)} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-bold">{t(path.titleKey)}</h3>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full border',
                          colors.bg,
                          colors.border,
                          colors.text
                        )}
                      >
                        {t(`level_${path.level}`)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{t(path.descKey)}</p>
                  </div>
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <div className={cn('text-2xl font-bold tabular-nums', colors.text)}>{pct}%</div>
                    <div className="text-xs text-muted-foreground">
                      {completedCount}/{pathLessons.length}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-white/5">
                  <div
                    className={cn('h-full transition-all duration-500', colors.bg)}
                    style={{ width: `${pct}%`, backgroundColor: 'var(--accent)' }}
                  />
                </div>

                {/* Lessons grid */}
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {pathLessons.map((lesson, lIdx) => {
                    const completed = isLessonCompleted(lesson.id);
                    const prevCompleted =
                      lIdx === 0 || isLessonCompleted(pathLessons[lIdx - 1].id);
                    const locked = !prevCompleted && !completed;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => !locked && onSelectLesson(lesson.id)}
                        disabled={locked}
                        className={cn(
                          'text-left rounded-2xl p-4 border transition-all',
                          locked
                            ? 'bg-white/[0.02] border-white/5 opacity-50 cursor-not-allowed'
                            : completed
                              ? 'bg-[var(--accent)]/5 border-[var(--accent)]/30 hover:border-[var(--accent)]/50 hover:-translate-y-0.5'
                              : 'glass border-white/10 hover:border-[var(--accent)]/30 hover:-translate-y-0.5'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-xs font-mono text-muted-foreground">
                            {String(lIdx + 1).padStart(2, '0')}
                          </span>
                          {completed ? (
                            <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                          ) : locked ? (
                            <Lock className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/40" />
                          )}
                        </div>
                        <h4 className="font-semibold text-sm leading-snug mb-1">
                          {lesson.title.en}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {lesson.description.en}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
