'use client';

import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogIn, LogOut, Mail, Calendar, Mic, Shield, Loader2, Trash2, ThumbsUp, ThumbsDown, BookOpen, AlertCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn, getText } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useCallback } from 'react';
import { vocabById } from '@/data/vocabulary';

interface UserVoice {
  id: string;
  title: string;
  description: string | null;
  dialect: string;
  filePath: string;
  duration: number;
  nickname: string;
  vocabId?: string;
  likes: number;
  dislikes: number;
  createdAt: string;
}

interface Props {
  onNavigate?: (id: string) => void;
}

export default function ProfilePage({ onNavigate }: Props) {
  const { t, lang, dir } = useApp();
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<{ voiceCount: number; createdAt: string } | null>(null);
  const [userVoices, setUserVoices] = useState<UserVoice[]>([]);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserVoice | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetch('/api/user/profile')
        .then((r) => (r.ok ? r.json() : null))
        .then(setProfileData)
        .catch(() => {});
    }
  }, [session?.user?.id]);

  const fetchUserVoices = useCallback(async () => {
    if (!session?.user?.id) return;
    setLoadingVoices(true);
    try {
      const res = await fetch('/api/user/voices');
      const data = await res.json();
      if (res.ok) setUserVoices(data.voices || []);
    } catch {
      // ignore
    } finally {
      setLoadingVoices(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchUserVoices();
  }, [fetchUserVoices]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/user/voices/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast({
          title: t('profile_delete_error'),
          description: data?.message ?? '',
          variant: 'destructive',
        });
        return;
      }
      toast({ title: t('profile_delete_success') });
      setUserVoices((prev) => prev.filter((v) => v.id !== deleteTarget.id));
      setProfileData((prev) => prev ? { ...prev, voiceCount: Math.max(0, prev.voiceCount - 1) } : prev);
      setDeleteTarget(null);
    } catch {
      toast({ title: t('error_generic'), variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const fontClass = lang === 'en' ? 'font-en' : 'font-ku';
  const isLoading = status === 'loading';

  return (
    <section className="py-12 sm:py-20 px-4" dir={dir}>
      <div className={cn('max-w-2xl mx-auto space-y-8', fontClass)}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center mb-4">
            <User className="w-10 h-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text">{t('profile_title')}</h1>
        </motion.div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!session && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl border border-white/10 p-8 text-center space-y-6"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center">
              <LogIn className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">{t('profile_not_logged_in')}</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">{t('profile_login_desc')}</p>
            </div>
            <button
              onClick={() => onNavigate?.('login')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-[#0a0a0f] font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <LogIn className="w-4 h-4" />
              {t('login_tab_login')}
            </button>
          </motion.div>
        )}

        {session && !isLoading && (
          <>
            {/* Profile card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl border border-white/10 p-6 space-y-6"
            >
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 border-2 border-[var(--accent)]/40">
                  <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? ''} />
                  <AvatarFallback className="bg-[var(--accent)]/15 text-[var(--accent)] text-2xl font-bold">
                    {session.user.name?.charAt(0)?.toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h2 className="text-xl font-bold truncate">{session.user.name ?? t('profile_guest')}</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate" dir="ltr">{session.user.email}</span>
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="glass rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                    <Mic className="w-4 h-4" />
                    {t('profile_voice_count')}
                  </div>
                  <p className="text-2xl font-bold text-[var(--accent)]">{profileData?.voiceCount ?? 0}</p>
                </div>
                <div className="glass rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                    <Calendar className="w-4 h-4" />
                    {t('profile_joined')}
                  </div>
                  <p className="text-sm font-medium">
                    {profileData?.createdAt
                      ? new Date(profileData.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'fa' ? 'fa-IR' : 'ckb')
                      : '—'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* User's voice recordings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass rounded-2xl border border-white/10 p-6 space-y-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center">
                    <Mic className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold">{t('profile_my_recordings')}</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate?.('voices')}
                  className="rounded-lg border-white/10 glass hover:bg-white/5 text-xs"
                >
                  {t('profile_record_new')}
                </Button>
              </div>

              {loadingVoices ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : userVoices.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  <Mic className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>{t('profile_no_recordings')}</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pe-1">
                  {userVoices.map((v) => {
                    const vVocab = v.vocabId ? vocabById.get(v.vocabId) : undefined;
                    const vWord = vVocab
                      ? (vVocab.dialects?.[v.dialect] ?? getText({ en: vVocab.en, fa: vVocab.fa, ku: vVocab.ku }, lang))
                      : '';
                    return (
                      <div
                        key={v.id}
                        className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate text-sm">{v.title}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            {vWord && (
                              <span className="inline-flex items-center gap-1 text-[var(--accent)]">
                                <BookOpen className="w-3 h-3" />
                                {vWord}
                              </span>
                            )}
                            <span>•</span>
                            <span>{t(`dialect_${v.dialect}`)}</span>
                            <span>•</span>
                            <span>{formatTime(v.duration)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="inline-flex items-center gap-1 text-green-400">
                              <ThumbsUp className="w-3 h-3" />
                              <span className="tabular-nums">{v.likes}</span>
                            </span>
                            <span className="inline-flex items-center gap-1 text-red-400">
                              <ThumbsDown className="w-3 h-3" />
                              <span className="tabular-nums">{v.dislikes}</span>
                            </span>
                          </div>
                          <button
                            onClick={() => setDeleteTarget(v)}
                            aria-label={t('profile_delete')}
                            className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Account section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl border border-white/10 p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">{t('profile_account_title')}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {lang === 'en'
                  ? 'Your voice recordings are linked to your account and visible on the Community Voices page. You can delete any of your own recordings at any time. Your learning progress (XP, streaks, SRS) is saved locally in your browser.'
                  : lang === 'fa'
                    ? 'ضبط‌های صوتی شما به حسابتان متصل شده و در صفحه صداهای جامعه قابل مشاهده هستند. می‌توانید هر کدام از ضبط‌های خود را در هر زمان حذف کنید. پیشرفت یادگیری شما (XP، استریک‌ها، SRS) به صورت محلی در مرورگر ذخیره می‌شود.'
                    : 'تۆمارەکانی دەنگی پەیوەندیدارن بە هەژمارەکەت و لە لاپەڕەی دەنگی کۆمەڵگەدا دەبینرێن. دەتوانیت لە هەر کاتێکدا هەر یەکێک لە تۆمارەکانت بسڕیتەوە. پێشکەوتنی فێربوون (XP، زنجیرەکان، SRS) ناوخۆیی لە وێبگەڕەکەتدا پاشەکەوت دەکرێت.'}
              </p>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t('profile_logout')}
              </button>
            </motion.div>
          </>
        )}
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/10 glass p-6 space-y-4"
              dir={dir}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">{t('profile_delete_confirm_title')}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('profile_delete_confirm_desc')}
              </p>
              <p className="text-sm font-medium truncate px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                {deleteTarget.title}
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="rounded-lg border-white/10 glass hover:bg-white/5"
                >
                  {t('cancel')}
                </Button>
                <Button
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-lg bg-red-500 hover:bg-red-600 text-white"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 me-2 animate-spin" />
                      {t('login_please_wait')}
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 me-2" />
                      {t('profile_delete')}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
