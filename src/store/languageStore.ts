import { create } from 'zustand';
import en from '@/lib/locales/en.json';
import ar from '@/lib/locales/ar.json';

type Language = 'en' | 'ar';

interface LanguageStore {
  language: Language;
  t: typeof en;
  setLanguage: (lang: Language) => void;
}

const translations = { en, ar };

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: 'en',
  t: en,
  setLanguage: (lang: Language) => {
    set({ language: lang, t: translations[lang] });
  },
}));