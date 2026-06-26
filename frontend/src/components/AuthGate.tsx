import { useState } from 'react';
import { AuthModal } from './AuthModal';
import { useAuthStore } from '@/store/auth';
import { useI18nStore } from '@/store/i18n';
import { useT } from '@/i18n';
import { PulsLogo } from './PulsLogo';
import { LanguagePickerScreen } from '@/pages/LanguagePickerScreen';

// Dev-only: inject mock user before React renders so there's no auth flash
if (import.meta.env.DEV && new URLSearchParams(window.location.search).get('dev_user')) {
  useAuthStore.getState().setUser({ id: 'dev', username: 'dev', displayName: 'Dev User' });
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();
  const { hasChosenLanguage } = useI18nStore();
  const t = useT();
  const [showModal, setShowModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <PulsLogo size={36} />
          <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative flex flex-col items-center gap-8 max-w-sm animate-fade-in">
          <div className="flex flex-col items-center gap-3">
            <PulsLogo size={52} showText={false} />
            <div>
              <h1 className="text-white text-4xl font-black tracking-tight">PULS</h1>
              <p className="text-gray-500 text-sm mt-1">{t.tagline}</p>
            </div>
          </div>

          <div className="w-full space-y-3">
            {[
              { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, text: t.featureTimer },
              { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M6 4v16M18 4v16M6 8H2v8h4M18 8h4v8h-4M6 9h12M6 15h12"/></svg>, text: t.featureMuscles },
              { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, text: t.featureStreak },
              { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>, text: t.featurePasskey },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-left bg-white/5 rounded-xl px-4 py-3">
                <span className="text-violet-400 shrink-0">{icon}</span>
                <span className="text-gray-300 text-sm">{text}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-2xl text-lg transition-all active:scale-[0.98] shadow-xl shadow-violet-500/25 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            {t.ctaButton}
          </button>

          <p className="text-gray-600 text-xs">{t.noPasswordNote}</p>
        </div>

        {showModal && <AuthModal onClose={() => setShowModal(false)} />}
      </div>
    );
  }

  // Show language picker on first login before the main app
  if (!hasChosenLanguage) {
    return <LanguagePickerScreen />;
  }

  return <>{children}</>;
}
