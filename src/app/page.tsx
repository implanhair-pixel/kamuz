'use client';

import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Stats from '@/components/Stats';
import Paths from '@/components/Paths';
import VocabularyBrowser from '@/components/VocabularyBrowser';
import DialectCompare from '@/components/DialectCompare';
import StatsDashboard from '@/components/StatsDashboard';
import SRSReview from '@/components/SRSReview';
import NewsletterCTA from '@/components/NewsletterCTA';
import Footer from '@/components/Footer';
import GlobalSearch from '@/components/GlobalSearch';
import SettingsModal from '@/components/SettingsModal';
import LessonModal from '@/components/LessonModal';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import SkipLink from '@/components/SkipLink';
import VoiceSection from '@/components/VoiceSection';
import AdminPanel from '@/components/AdminPanel';
import PrivacyPage from '@/components/PrivacyPage';
import TermsPage from '@/components/TermsPage';
import ContactPage from '@/components/ContactPage';
import ProfilePage from '@/components/ProfilePage';
import LoginPage from '@/components/LoginPage';
import AboutPage from '@/components/AboutPage';

type View = 'home' | 'paths' | 'vocabulary' | 'compare' | 'stats' | 'srs' | 'voices' | 'admin' | 'privacy' | 'terms' | 'contact' | 'profile' | 'login' | 'about';

export default function Home() {
  const { t } = useApp();
  const [view, setView] = useState<View>('home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Smooth scroll to top on view change
  const handleNavigate = useCallback((id: string) => {
    setView(id as View);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Scroll spy for navbar active state on home
  useEffect(() => {
    if (view !== 'home') return;
    const sections = ['hero', 'features', 'paths', 'vocabulary', 'compare'];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // could set active section here
          }
        }
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [view]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground gradient-bg-animated">
      <SkipLink />
      <Navbar
        activeView={view}
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main id="main" className="flex-1 pt-16">
        {view === 'home' && (
          <>
            <Hero onNavigate={handleNavigate} />
            <Features />
            <Stats />
            <Paths onSelectLesson={(id) => setActiveLessonId(id)} />
            <VocabularyBrowser />
            <DialectCompare />
            <NewsletterCTA />
          </>
        )}

        {view === 'paths' && (
          <div className="pt-4">
            <Paths onSelectLesson={(id) => setActiveLessonId(id)} />
          </div>
        )}

        {view === 'vocabulary' && (
          <div className="pt-4">
            <VocabularyBrowser />
          </div>
        )}

        {view === 'compare' && (
          <div className="pt-4">
            <DialectCompare />
          </div>
        )}

        {view === 'stats' && (
          <div className="pt-4">
            <StatsDashboard />
            <section className="py-16 px-4">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">{t('srs_title')}</h2>
                  <p className="text-sm text-muted-foreground">{t('srs_subtitle')}</p>
                </div>
                <SRSReview />
              </div>
            </section>
          </div>
        )}

        {view === 'srs' && (
          <section className="py-20 px-4 pt-24">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">{t('srs_title')}</h2>
                <p className="text-sm text-muted-foreground">{t('srs_subtitle')}</p>
              </div>
              <SRSReview />
            </div>
          </section>
        )}

        {view === 'voices' && <VoiceSection onNavigate={handleNavigate} />}

        {view === 'admin' && <AdminPanel />}

        {view === 'privacy' && <PrivacyPage />}

        {view === 'terms' && <TermsPage />}

        {view === 'contact' && <ContactPage />}

        {view === 'profile' && <ProfilePage onNavigate={handleNavigate} />}

        {view === 'login' && <LoginPage onNavigate={handleNavigate} />}

        {view === 'about' && <AboutPage onNavigate={handleNavigate} />}
      </main>

      <Footer onNavigate={handleNavigate} />

      {/* Modals & overlays */}
      <GlobalSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleNavigate}
      />
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <LessonModal
        lessonId={activeLessonId}
        onClose={() => setActiveLessonId(null)}
      />
      <ScrollToTopButton />
    </div>
  );
}