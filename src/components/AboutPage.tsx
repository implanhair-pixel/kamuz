'use client';

import { motion } from 'framer-motion';
import { Sparkles, Globe2, GraduationCap, Heart, Users, BookOpen, Mic2, Target, ArrowRight } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

interface Props {
  onNavigate: (id: string) => void;
}

export default function AboutPage({ onNavigate }: Props) {
  const { t, lang, dir } = useApp();
  const fontClass = lang === 'en' ? 'font-en' : 'font-ku';

  const values = [
    {
      icon: GraduationCap,
      title: t('about_value1_title'),
      desc: t('about_value1_desc'),
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: Globe2,
      title: t('about_value2_title'),
      desc: t('about_value2_desc'),
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      icon: Heart,
      title: t('about_value3_title'),
      desc: t('about_value3_desc'),
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
    {
      icon: Users,
      title: t('about_value4_title'),
      desc: t('about_value4_desc'),
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  const stats = [
    { value: '10,000+', label: t('about_stat_learners') },
    { value: '150+', label: t('about_stat_words') },
    { value: '6+', label: t('about_stat_lessons') },
    { value: '3', label: t('about_stat_dialects') },
  ];

  const features = [
    { icon: BookOpen, label: t('about_feature_lessons') },
    { icon: Sparkles, label: t('about_feature_flashcards') },
    { icon: Mic2, label: t('about_feature_voices') },
    { icon: Target, label: t('about_feature_srs') },
  ];

  return (
    <section className="py-12 sm:py-20 px-4" dir={dir}>
      <div className={cn('max-w-4xl mx-auto', fontClass)}>
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-[var(--accent)]/30 text-[var(--accent)] text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            {t('about_badge')}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text leading-tight">
            {t('about_title')}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('about_intro')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('paths')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-[#0a0a0f] font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              {t('about_cta_start')}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-foreground font-semibold text-sm hover:bg-white/5 transition-colors"
            >
              {t('about_cta_contact')}
            </button>
          </div>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-16"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="glass rounded-2xl border border-white/10 p-4 sm:p-6 text-center"
            >
              <p className="text-2xl sm:text-3xl font-bold text-[var(--accent)] mb-1">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl border border-white/10 p-6 sm:p-10 mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t('about_mission_title')}</h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
            {t('about_mission_p1')}
          </p>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t('about_mission_p2')}
          </p>
        </motion.div>

        {/* Values grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
            {t('about_values_title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className="glass rounded-2xl border border-white/10 p-6 flex gap-4"
              >
                <div className={cn('w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0', v.color)}>
                  <v.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl border border-white/10 p-6 sm:p-8 mb-12"
        >
          <h2 className="text-xl font-bold mb-6 text-center">{t('about_features_title')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 flex items-center justify-center">
                  <f.icon className="w-6 h-6" />
                </div>
                <p className="text-xs sm:text-sm font-medium">{f.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Closing CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center glass rounded-2xl border border-white/10 p-8 sm:p-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t('about_cta_title')}</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
            {t('about_cta_desc')}
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-[#0a0a0f] font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            {t('about_cta_button')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
