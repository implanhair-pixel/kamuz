'use client';

import { motion } from 'framer-motion';
import { Shield, Mic, Database, Users, Lock } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

const SECTIONS = [
  { icon: Database, titleKey: 'privacy_data_title', descKey: 'privacy_data_desc' },
  { icon: Mic, titleKey: 'privacy_voice_title', descKey: 'privacy_voice_desc' },
  { icon: Lock, titleKey: 'privacy_cookies_title', descKey: 'privacy_cookies_desc' },
  { icon: Users, titleKey: 'privacy_third_title', descKey: 'privacy_third_desc' },
  { icon: Shield, titleKey: 'privacy_rights_title', descKey: 'privacy_rights_desc' },
] as const;

export default function PrivacyPage() {
  const { t, lang, dir } = useApp();
  const fontClass = lang === 'en' ? 'font-en' : 'font-ku';

  return (
    <section className="py-12 sm:py-20 px-4" dir={dir}>
      <div className={cn('max-w-3xl mx-auto space-y-10', fontClass)}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text">{t('privacy_title')}</h1>
          <p className="text-sm text-muted-foreground">{t('privacy_last_updated')}</p>
        </motion.div>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground leading-relaxed"
        >
          {t('privacy_intro')}
        </motion.p>

        {/* Sections */}
        <div className="space-y-6">
          {SECTIONS.map((section, i) => (
            <motion.div
              key={section.titleKey}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              className="rounded-2xl border border-white/10 glass p-6 space-y-4 hover:border-[var(--accent)]/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0">
                  <section.icon className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold">{t(section.titleKey)}</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(section.descKey)}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-sm text-muted-foreground"
        >
          {t('privacy_contact')}
        </motion.p>
      </div>
    </section>
  );
}
