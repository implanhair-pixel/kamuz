'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, LogIn, Loader2, ChevronDown } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Props {
  onNavigate?: (id: string) => void;
}

export default function ProfileButton({ onNavigate }: Props) {
  const { t, lang, dir } = useApp();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [profileData, setProfileData] = useState<{ voiceCount: number; createdAt: string } | null>(null);
  const dropdownRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const handler = (e: MouseEvent) => {
      if (!node.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (session?.user?.id && open) {
      fetch('/api/user/profile')
        .then((r) => (r.ok ? r.json() : null))
        .then(setProfileData)
        .catch(() => {});
    }
  }, [session?.user?.id, open]);

  const isLoading = status === 'loading';

  if (isLoading) {
    return (
      <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) {
    return (
      <button
        onClick={() => onNavigate?.('login')}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        aria-label={t('login_tab_login')}
      >
        <LogIn className="w-4 h-4" aria-hidden="true" />
        <span className="hidden lg:block">{t('login_tab_login')}</span>
      </button>
    );
  }

  const user = session.user;
  const initial = user.name?.charAt(0)?.toUpperCase() ?? 'U';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-colors"
        aria-expanded={open}
      >
        <Avatar className="w-8 h-8 border border-[var(--accent)]/30">
          <AvatarImage src={user.image ?? undefined} alt={user.name ?? ''} />
          <AvatarFallback className="bg-[var(--accent)]/15 text-[var(--accent)] text-xs font-bold">
            {initial}
          </AvatarFallback>
        </Avatar>
        <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform hidden lg:block', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            dir={dir}
            className={cn(
              'absolute top-12 glass rounded-xl p-4 shadow-2xl min-w-[280px] z-50 border border-white/10',
              lang === 'en' ? 'right-0' : 'left-0'
            )}
          >
            {/* User info */}
            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-white/10">
              <Avatar className="w-12 h-12 border-2 border-[var(--accent)]/30">
                <AvatarImage src={user.image ?? undefined} alt={user.name ?? ''} />
                <AvatarFallback className="bg-[var(--accent)]/15 text-[var(--accent)] text-lg font-bold">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{user.name ?? t('profile_guest')}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>

            {/* Stats */}
            {profileData && (
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="glass rounded-lg p-2 border border-white/5 text-center">
                  <p className="text-lg font-bold text-[var(--accent)]">{profileData.voiceCount}</p>
                  <p className="text-[10px] text-muted-foreground">{t('profile_voice_count')}</p>
                </div>
                <div className="glass rounded-lg p-2 border border-white/5 text-center">
                  <p className="text-lg font-bold text-[var(--accent)]">
                    {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'fa' ? 'fa-IR' : 'ckb') : '—'}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{t('profile_joined')}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-1">
              {onNavigate && (
                <button
                  onClick={() => { onNavigate('profile'); setOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors text-foreground"
                >
                  <User className="w-4 h-4" aria-hidden="true" />
                  {t('profile_title')}
                </button>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm hover:bg-red-500/10 text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                {t('profile_logout')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}