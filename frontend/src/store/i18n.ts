import { create } from 'zustand';
import type { Language } from '@/i18n';

interface I18nState {
  language: Language;
  hasChosenLanguage: boolean;
  setLanguage: (lang: Language) => void;
  confirmLanguageChosen: () => void;
}

function loadFromStorage(): { language: Language; hasChosenLanguage: boolean } {
  try {
    const lang = localStorage.getItem('puls-language') as Language | null;
    const chosen = localStorage.getItem('puls-language-chosen') === '1';
    return { language: lang ?? 'en', hasChosenLanguage: chosen };
  } catch {
    return { language: 'en', hasChosenLanguage: false };
  }
}

const saved = loadFromStorage();

export const useI18nStore = create<I18nState>()((set) => ({
  language: saved.language,
  hasChosenLanguage: saved.hasChosenLanguage,
  setLanguage: (language) => {
    try { localStorage.setItem('puls-language', language); } catch { /* ignore */ }
    set({ language });
  },
  confirmLanguageChosen: () => {
    try { localStorage.setItem('puls-language-chosen', '1'); } catch { /* ignore */ }
    set({ hasChosenLanguage: true });
  },
}));
