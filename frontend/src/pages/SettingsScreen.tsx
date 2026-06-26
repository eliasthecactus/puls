import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { useI18nStore } from '@/store/i18n';
import { useT } from '@/i18n';
import { api } from '@/lib/api';
import { PulsLogo } from '@/components/PulsLogo';
import type { Language } from '@/i18n';

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

export function SettingsScreen() {
  const navigate = useNavigate();
  const t = useT();
  const { user, setUser } = useAuthStore();
  const { language, setLanguage } = useI18nStore();

  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<'saved' | 'error' | null>(null);

  async function handleSaveName() {
    if (!displayName.trim() || displayName.trim() === user?.displayName) return;
    setSaving(true);
    setFeedback(null);
    try {
      const updated = await api.updateProfile(displayName.trim());
      setUser({ ...user!, displayName: updated.displayName });
      setFeedback('saved');
    } catch {
      setFeedback('error');
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(null), 2500);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-950/80 backdrop-blur-xl border-b border-white/5 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <PulsLogo size={24} showText={false} />
          <span className="text-white font-semibold">{t.settingsTitle}</span>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8 space-y-8">
        {/* Profile */}
        <section>
          <h2 className="text-gray-400 text-xs uppercase tracking-wider mb-3">{t.profileSection}</h2>
          <div className="bg-gray-900 rounded-2xl border border-white/5 p-4 space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">{t.displayNameLabel}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  placeholder={t.displayNamePlaceholder}
                  maxLength={64}
                  className="flex-1 bg-gray-800 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors text-sm"
                />
                <button
                  onClick={handleSaveName}
                  disabled={saving || !displayName.trim() || displayName.trim() === user?.displayName}
                  className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl text-white text-sm font-semibold transition-all"
                >
                  {saving ? t.saving : t.save}
                </button>
              </div>
              {feedback === 'saved' && (
                <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {t.savedConfirm}
                </p>
              )}
              {feedback === 'error' && (
                <p className="text-red-400 text-xs mt-2">{t.errorSaving}</p>
              )}
            </div>
          </div>
        </section>

        {/* Language */}
        <section>
          <h2 className="text-gray-400 text-xs uppercase tracking-wider mb-3">{t.languageSection}</h2>
          <div className="bg-gray-900 rounded-2xl border border-white/5 p-2 space-y-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  language === lang.code
                    ? 'bg-violet-500/15 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium text-sm">{lang.label}</span>
                {language === lang.code && (
                  <div className="ml-auto w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
