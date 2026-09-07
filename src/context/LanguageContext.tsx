import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations, TranslationKey } from '../utils/translations';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    return loadFromStorage<Language>(STORAGE_KEYS.LANG, 'en');
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    saveToStorage(STORAGE_KEYS.LANG, newLang);
  };

  const toggleLang = () => {
    const next = lang === 'en' ? 'mr' : 'en';
    setLang(next);
  };

  const t = (key: TranslationKey): string => {
    return translations[lang][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
