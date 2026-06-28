'use client';

import { motion } from 'framer-motion';
import { HelpCircle, Send, Instagram, Youtube, ArrowUpRight, MessagesSquare } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ_ITEMS = [
  { qKey: 'contact_faq_q1', aKey: 'contact_faq_a1' },
  { qKey: 'contact_faq_q2', aKey: 'contact_faq_a2' },
  { qKey: 'contact_faq_q3', aKey: 'contact_faq_a3' },
  { qKey: 'contact_faq_q4', aKey: 'contact_faq_a4' },
  { qKey: 'contact_faq_q5', aKey: 'contact_faq_a5' },
] as const;

const SOCIAL_LINKS = [
  {
    icon: Send,
    label: 'Telegram',
    handle: '@kurdamuz',
    href: 'https://t.me/kurdamuz',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    primary: true,
  },
  {
    icon: Instagram,
    label: 'Instagram',
    handle: '@kurdamuz',
    href: 'https://instagram.com/kurdamuz',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
    primary: false,
  },
  {
    icon: Youtube,
    label: 'YouTube',
    handle: '@kurdamuz',
    href: 'https://youtube.com/@kurdamuz',
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    primary: false,
  },
];

export default function ContactPage() {
  const { t, lang, dir } = useApp();
  const fontClass = lang === 'en' ? 'font-en' : 'font-ku';

  return (
    <section className="py-12 sm:py-20 px-4" dir={dir}>
      <div className={cn('max-w-3xl mx-auto', fontClass)}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-12"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center">
            <MessagesSquare className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text">{t('contact_title')}</h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            {t('contact_subtitle')}
          </p>
        </motion.div>

        {/* Social cards — Telegram featured, others smaller */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 glass p-6 sm:p-8 mb-4"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center flex-shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold leading-tight">{t('contact_social_title')}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{t('contact_social_desc')}</p>
            </div>
          </div>

          <div className="space-y-3">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  'flex items-center gap-4 px-4 py-3.5 rounded-xl border text-sm hover:bg-white/5 transition-colors w-full group',
                  s.bg
                )}
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <s.icon className={cn('w-5 h-5', s.color)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-base">{s.label}</p>
                  <p className="text-xs text-muted-foreground" dir="ltr">{s.handle}</p>
                </div>
                {s.primary && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
                    {t('contact_primary_badge')}
                  </span>
                )}
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </a>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-5 leading-relaxed">
            {t('contact_direct_note')}
          </p>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mt-10"
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">{t('contact_faq_title')}</h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <motion.div
                key={item.qKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
              >
                <AccordionItem
                  value={item.qKey}
                  className="rounded-2xl border border-white/10 glass overflow-hidden data-[state=open]:border-[var(--accent)]/30 data-[state=open]:bg-[var(--accent)]/[0.03] transition-colors"
                >
                  <AccordionTrigger className="px-5 py-4 text-start hover:no-underline hover:bg-white/[0.02] transition-colors [&>svg]:hidden">
                    <span className="font-medium text-sm flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      {t(item.qKey)}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-4 pt-1 text-sm text-muted-foreground leading-relaxed ps-14">
                    {t(item.aKey)}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
