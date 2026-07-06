"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/hotelsData';

export type Language = 'en' | 'si' | 'ta';

// Derive the type of a single language translation set from the exported object.
type TranslationSet = typeof translations['en'];
// Keys that are plain strings (excludes the `facilitiesList` record).
type TranslationKey = {
  [K in keyof TranslationSet]: TranslationSet[K] extends string ? K : never;
}[keyof TranslationSet];

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  /** Look up a top-level translation string by key. Falls back to English, then returns the key. */
  t: (key: string) => string;
  /** Look up a facility label in the current language. Falls back to the raw facility string. */
  translateFacility: (facility: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language preference from local storage if available
  useEffect(() => {
    const savedLang = localStorage.getItem('kumara-lang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'si' || savedLang === 'ta')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kumara-lang', lang);
  };

  const t = (key: string): string => {
    const translationSet = translations[language] as Record<string, unknown>;
    const enSet = translations['en'] as Record<string, unknown>;
    const value = translationSet[key] ?? enSet[key];
    return typeof value === 'string' ? value : key;
  };

  const translateFacility = (facility: string): string => {
    const translationSet = translations[language] as Record<string, unknown>;
    const facilitiesList = translationSet['facilitiesList'];
    if (facilitiesList && typeof facilitiesList === 'object') {
      const list = facilitiesList as Record<string, string>;
      return list[facility] ?? facility;
    }
    return facility;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateFacility }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
