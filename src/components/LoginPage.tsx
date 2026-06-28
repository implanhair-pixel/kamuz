'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { User, LogIn, Mail, Lock, User as UserIcon, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  onNavigate: (id: string) => void;
}

export default function LoginPage({ onNavigate }: Props) {
  const { t, lang, dir } = useApp();
  const { data: session, status } = useSession();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleReady, setGoogleReady] = useState(false);

  // Check whether Google OAuth is configured on the server.
  useEffect(() => {
    fetch('/api/auth/status')
      .then((r) => r.json())
      .then((d: { google?: boolean }) => setGoogleReady(Boolean(d.google)))
      .catch(() => setGoogleReady(false));
  }, []);

  const fontClass = lang === 'en' ? 'font-en' : 'font-ku';
  const isLoading = status === 'loading';

  // Already authenticated → redirect to profile view
  if (session && !isLoading) {
    return (
      <section className="py-16 sm:py-24 px-4" dir={dir}>
        <div className={cn('max-w-md mx-auto text-center space-y-4', fontClass)}>
          <div className="w-20 h-20 mx-auto rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center">
            <User className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold">{t('profile_title')}</h1>
          <p className="text-sm text-muted-foreground">
            {session.user.name} · {session.user.email}
          </p>
          <Button onClick={() => onNavigate('profile')} className="mt-4">
            {t('profile_title')}
            <ArrowRight className="w-4 h-4 ms-2" />
          </Button>
        </div>
      </section>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === 'register') {
        // 1. Create the account
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data?.error ?? t('login_error_generic'));
          return;
        }
        // 2. Sign in immediately with the credentials provider
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });
        if (result?.error) {
          setError(t('login_error_generic'));
          return;
        }
        onNavigate('profile');
      } else {
        // Login mode: use credentials provider
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });
        if (result?.error) {
          setError(t('login_error_invalid'));
          return;
        }
        onNavigate('profile');
      }
    } catch {
      setError(t('login_error_generic'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <section className="py-12 sm:py-20 px-4" dir={dir}>
      <div className={cn('max-w-md mx-auto', fontClass)}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3 mb-8"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center mb-4">
            <LogIn className="w-10 h-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text">
            {mode === 'login' ? t('login_title') : t('register_title')}
          </h1>
          <p className="text-sm text-muted-foreground">{t('login_subtitle')}</p>
        </motion.div>

        {/* Tab switcher */}
        <div className="glass rounded-xl p-1 mb-6 border border-white/10 grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={cn(
              'py-2 rounded-lg text-sm font-medium transition-colors',
              mode === 'login'
                ? 'bg-[var(--accent)] text-[#0a0a0f]'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t('login_tab_login')}
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={cn(
              'py-2 rounded-lg text-sm font-medium transition-colors',
              mode === 'register'
                ? 'bg-[var(--accent)] text-[#0a0a0f]'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t('login_tab_register')}
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="glass rounded-2xl border border-white/10 p-6 space-y-4"
        >
          {mode === 'register' && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground" htmlFor="name">
                {t('login_name_label')}
              </label>
              <div className="relative">
                <UserIcon className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('login_name_placeholder')}
                  className="ps-10"
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="email">
              {t('login_email_label')}
            </label>
            <div className="relative">
              <Mail className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="ps-10"
                autoComplete="email"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="password">
              {t('login_password_label')}
            </label>
            <div className="relative">
              <Lock className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="ps-10"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                dir="ltr"
              />
            </div>
            {mode === 'register' && (
              <p className="text-[11px] text-muted-foreground">{t('login_password_hint')}</p>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting || isLoading}
            className="w-full bg-[var(--accent)] text-[#0a0a0f] hover:bg-[var(--accent)]/90"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 me-2 animate-spin" />
                {t('login_please_wait')}
              </>
            ) : (
              mode === 'login' ? t('login_submit') : t('register_submit')
            )}
          </Button>
        </form>

        {/* Google OAuth (only if configured) */}
        {googleReady && (
          <>
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-muted-foreground">{t('login_or')}</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <button
              onClick={handleGoogle}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-colors shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {t('profile_login')}
            </button>
          </>
        )}

        <p className="text-center text-xs text-muted-foreground mt-6">
          {t('login_privacy_note')}
        </p>
      </div>
    </section>
  );
}
