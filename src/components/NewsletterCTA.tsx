'use client';

import { Mail, Check } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';

export default function NewsletterCTA() {
  const { t } = useApp();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Local-only "subscribe" (no backend)
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <section className="relative py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="glass rounded-3xl border border-[var(--accent)]/20 p-8 sm:p-10 text-center relative overflow-hidden mesh-bg">
          <div className="relative z-10">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center">
              <Mail className="w-7 h-7 text-[var(--accent)]" aria-hidden="true" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              {t('lang_en') === 'English' ? 'Get a new word every day' : ''}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-xl mx-auto">
              {t('lang_en') === 'English'
                ? 'Join 10,000+ learners. Free daily vocabulary, dialect tips and learning inspiration — straight to your inbox.'
                : ''}
            </p>
            {submitted ? (
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium">
                <Check className="w-4 h-4" />
                {t('saved')}!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent)]/20 transition-colors"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-[var(--accent)] text-[#0a0a0f] font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  {t('lang_en') === 'English' ? 'Subscribe' : t('save')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
