"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/hotelsData';

type Language = 'en' | 'si' | 'ta';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
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
    const translationSet = translations[language];
    // @ts-ignore
    return translationSet[key] || translations['en'][key] || key;
  };

  const translateFacility = (facility: string): string => {
    const translationSet = translations[language];
    // @ts-ignore
    return translationSet.facilitiesList?.[facility] || facility;
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
