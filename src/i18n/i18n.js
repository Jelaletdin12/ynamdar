// src/i18n/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all translations
import tmTranslations from './locales/tm';
import ruTranslations from './locales/ru';
import enTranslations from './locales/en';

const resources = {
  tm: {
    translation: tmTranslations
  },
  ru: {
    translation: ruTranslations
  },
  en: {
    translation: enTranslations
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'tm',
    supportedLngs: ['tm', 'ru', 'en'],
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    ns: ['translation'],
    defaultNS: 'translation'
  });

export default i18n;