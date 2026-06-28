'use client';

import { Sparkles, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

/**
 * Fixed viewport showing stacked XP toasts top-right (LTR) / top-left (RTL).
 * Renders nothing on the server (xpToasts is empty initially); toasts only
 * appear after client-side XP awards, so there is no hydration mismatch.
 */
export default function XPToastViewport() {
  const { xpToasts, dismissXPToast, isRTL } = useApp();

  return (
    <div
      className={cn(
        'fixed top-20 z-[100] flex flex-col gap-2 pointer-events-none',
        isRTL ? 'left-4' : 'right-4'
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      {xpToasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto glass border border-[var(--accent)]/30 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 min-w-[180px] animate-in slide-in-from-top-4 fade-in duration-300"
          role="status"
        >
          <div className="w-9 h-9 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/40 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-bold text-[var(--accent)]">
              +{toast.amount} XP
            </span>
            <span className="text-xs text-muted-foreground truncate">{toast.reason}</span>
          </div>
          <button
            onClick={() => dismissXPToast(toast.id)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
