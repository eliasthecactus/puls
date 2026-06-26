import { useState } from 'react';
import { useI18nStore } from '@/store/i18n';
import { translations } from '@/i18n';
import { PulsLogo } from '@/components/PulsLogo';
import type { Language } from '@/i18n';

const LANGUAGES: { code: Language; label: string; nativeLabel: string; flag: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', flag: '🇩🇪' },
];

export function LanguagePickerScreen() {
  const { language, setLanguage, confirmLanguageChosen } = useI18nStore();
  const [selected, setSelected] = useState<Language>(language);
  const t = translations[selected];

  function confirm() {
    setLanguage(selected);
    confirmLanguageChosen();
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-8 animate-fade-in">
        <PulsLogo size={44} showText={false} />

        <div className="text-center">
          <h1 className="text-white text-2xl font-bold mb-2">{t.chooseLanguage}</h1>
          <p className="text-gray-400 text-sm">{t.chooseLanguageSubtitle}</p>
        </div>

        <div className="w-full space-y-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelected(lang.code)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all ${
                selected === lang.code
                  ? 'border-violet-500 bg-violet-500/10'
                  : 'border-white/10 bg-gray-900 hover:border-white/20'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="text-left">
                <div className="text-white font-semibold">{lang.nativeLabel}</div>
                {lang.label !== lang.nativeLabel && (
                  <div className="text-gray-500 text-sm">{lang.label}</div>
                )}
              </div>
              {selected === lang.code && (
                <div className="ml-auto w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={confirm}
          className="w-full py-4 bg-violet-600 hover:bg-violet-500 rounded-2xl text-white font-bold text-lg transition-all active:scale-[0.98]"
        >
          {t.continueButton}
        </button>
      </div>
    </div>
  );
}
