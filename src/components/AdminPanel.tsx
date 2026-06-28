'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shield, Trash2, RotateCcw, LogOut, Music, ThumbsUp, ThumbsDown, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface AdminVoice {
  id: string;
  title: string;
  description: string | null;
  dialect: string;
  fileName: string;
  filePath: string;
  duration: number;
  nickname: string;
  vocabId?: string;
  likes: number;
  dislikes: number;
  isDeleted: boolean;
  createdAt: string;
  ratings?: { kind: string; ipHash: string; userId: string | null; createdAt: string }[];
}

const DIALECT_STYLES: Record<string, string> = {
  sorani: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  kalhori: 'bg-green-500/15 text-green-400 border-green-500/25',
  kurmanji: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
};

export default function AdminPanel() {
  const { t, lang, dir } = useApp();
  const { toast } = useToast();

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('kurdamuz_admin_token');
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [voices, setVoices] = useState<AdminVoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AdminVoice | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);

  const fontClass = lang === 'en' ? 'font-en' : 'font-ku';

  const login = async () => {
    setLoggingIn(true);
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(t('admin_login_error'));
        return;
      }
      localStorage.setItem('kurdamuz_admin_token', data.token);
      setToken(data.token);
    } catch {
      setLoginError(t('error_generic'));
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('kurdamuz_admin_token');
    setToken(null);
    setVoices([]);
  };

  const fetchVoices = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ deleted: String(showDeleted), limit: '50' });
      const res = await fetch(`/api/admin/voices?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        logout();
        return;
      }
      const data = await res.json();
      setVoices(data.voices || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [token, showDeleted]);

  useEffect(() => {
    if (token) fetchVoices();
  }, [token, fetchVoices]);

  const handleDelete = async () => {
    if (!deleteTarget || !token) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/voices/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast({ title: t('admin_delete_success') });
        setDeleteTarget(null);
        fetchVoices();
      }
    } catch {
      toast({ title: t('error_generic'), variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const handleRestore = async (id: string) => {
    if (!token) return;
    setRestoring(id);
    try {
      const res = await fetch(`/api/admin/voices/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isDeleted: false }),
      });
      if (res.ok) {
        toast({ title: t('admin_restore_success') });
        fetchVoices();
      }
    } catch {
      toast({ title: t('error_generic'), variant: 'destructive' });
    } finally {
      setRestoring(null);
    }
  };

  const activeCount = voices.filter((v) => !v.isDeleted).length;
  const deletedCount = voices.filter((v) => v.isDeleted).length;

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'fa' ? 'fa-IR' : 'ku', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ─── LOGIN VIEW ───
  if (!token) {
    return (
      <section className="py-20 px-4" dir={dir}>
        <div className={cn('max-w-md mx-auto', fontClass)}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 glass p-8 space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center">
                <Shield className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold">{t('admin_login_title')}</h2>
              <p className="text-sm text-muted-foreground">{t('admin_login_desc')}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('admin_username')}
                </label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded-xl border-white/10 bg-white/5"
                  dir="ltr"
                  onKeyDown={(e) => e.key === 'Enter' && login()}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('admin_password')}
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl border-white/10 bg-white/5"
                  dir="ltr"
                  onKeyDown={(e) => e.key === 'Enter' && login()}
                />
              </div>
            </div>

            {loginError && (
              <p className="text-sm text-red-400 text-center">{loginError}</p>
            )}

            <Button
              onClick={login}
              disabled={loggingIn || !username || !password}
              className="w-full rounded-xl bg-[var(--accent)] text-black font-semibold hover:opacity-90"
            >
              {loggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : t('admin_login_btn')}
            </Button>

            <p className="text-center text-xs text-muted-foreground">{t('admin_info')}</p>
          </motion.div>
        </div>
      </section>
    );
  }

  // ─── DASHBOARD VIEW ───
  return (
    <section className="py-8 sm:py-12 px-4" dir={dir}>
      <div className={cn('max-w-6xl mx-auto space-y-6', fontClass)}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{t('admin_title')}</h2>
              <p className="text-sm text-muted-foreground">{t('admin_voices_title')}</p>
            </div>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="rounded-xl border-white/10 glass hover:bg-white/5"
          >
            <LogOut className="w-4 h-4 me-2" />
            {t('admin_logout')}
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: t('admin_total_voices'), value: activeCount, icon: Music, color: 'text-[var(--accent)]' },
            { label: t('admin_deleted'), value: deletedCount, icon: Trash2, color: 'text-red-400' },
            { label: t('admin_total_likes'), value: voices.filter(v => !v.isDeleted).reduce((s, v) => s + (v.likes || 0), 0), icon: ThumbsUp, color: 'text-green-400' },
            { label: t('admin_total_dislikes'), value: voices.filter(v => !v.isDeleted).reduce((s, v) => s + (v.dislikes || 0), 0), icon: ThumbsDown, color: 'text-red-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 glass p-4 space-y-2"
            >
              <stat.icon className={cn('w-5 h-5', stat.color)} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Toggle deleted */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-white/10 glass">
          <span className="text-sm">{t('admin_deleted')}</span>
          <Switch checked={showDeleted} onCheckedChange={setShowDeleted} />
        </div>

        {/* Voices table */}
        <div className="rounded-2xl border border-white/10 glass overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
              </div>
            ) : voices.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <Music className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>{t('admin_no_voices')}</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[var(--card)]/90 backdrop-blur border-b border-white/10">
                  <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="px-4 py-3 font-medium">{t('voices_voice_title')}</th>
                    <th className="px-4 py-3 font-medium hidden sm:table-cell">{t('voices_nickname')}</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">{t('voices_dialect')}</th>
                    <th className="px-4 py-3 font-medium hidden lg:table-cell">{t('admin_votes')}</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Date</th>
                    <th className="px-4 py-3 font-medium text-end">{t('admin_actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {voices.map((voice, i) => (
                    <motion.tr
                      key={voice.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className={cn(
                        'hover:bg-white/[0.02] transition-colors',
                        voice.isDeleted && 'opacity-50'
                      )}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium truncate max-w-[200px]">{voice.title}</p>
                        {voice.isDeleted && (
                          <span className="text-[10px] text-red-400 uppercase">Deleted</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                        {voice.nickname}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <Badge
                          variant="outline"
                          className={cn('text-[10px] px-2 py-0.5 rounded-full border', DIALECT_STYLES[voice.dialect] || '')}
                        >
                          {t(`dialect_${voice.dialect}`)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-green-400">
                            <ThumbsUp className="w-3 h-3" />
                            <span className="tabular-nums">{voice.likes}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 text-red-400">
                            <ThumbsDown className="w-3 h-3" />
                            <span className="tabular-nums">{voice.dislikes}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs">
                        {formatDate(voice.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-end">
                        <div className="flex items-center justify-end gap-1">
                          {voice.isDeleted ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                              onClick={() => handleRestore(voice.id)}
                              disabled={restoring === voice.id}
                            >
                              {restoring === voice.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <RotateCcw className="w-4 h-4" />
                              )}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              onClick={() => setDeleteTarget(voice)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="rounded-2xl border-white/10 glass max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              {t('confirm')}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {t('admin_delete_confirm')}
            </DialogDescription>
          </DialogHeader>
          {deleteTarget && (
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-sm">
              <p className="font-medium">{deleteTarget.title}</p>
              <p className="text-muted-foreground text-xs mt-1">
                {deleteTarget.nickname} • {t(`dialect_${deleteTarget.dialect}`)}
              </p>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="rounded-xl border-white/10 hover:bg-white/5"
              onClick={() => setDeleteTarget(null)}
            >
              {t('cancel')}
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : t('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}