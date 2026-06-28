'use client';

import { useApp } from '@/contexts/AppContext';

export default function SkipLink() {
  const { t } = useApp();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[var(--accent)] focus:text-[#0a0a0f] focus:font-semibold focus:text-sm focus:shadow-2xl"
    >
      {t('skip_to_content')}
    </a>
  );
}
