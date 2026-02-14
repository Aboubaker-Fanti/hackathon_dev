/**
 * i18n Configuration for Sehatik
 * Supports: French (fr), Arabic (ar), Darija (darija)
 * RTL support for Arabic and Darija
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

import fr from './locales/fr.json';
import ar from './locales/ar.json';
import darija from './locales/darija.json';

export const RTL_LANGUAGES = ['ar', 'darija'];

export const SUPPORTED_LANGUAGES = [
  { code: 'fr', label: 'Français', isRTL: false },
  { code: 'ar', label: 'العربية', isRTL: true },
  { code: 'darija', label: 'الدارجة', isRTL: true },
] as const;

export type LanguageCode = 'fr' | 'ar' | 'darija';

export const isRTLLanguage = (lang: string): boolean => {
  return RTL_LANGUAGES.includes(lang);
};

/**
 * Apply RTL layout direction based on selected language
 */
export const applyRTL = (lang: string): void => {
  const shouldBeRTL = isRTLLanguage(lang);
  if (I18nManager.isRTL !== shouldBeRTL) {
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
  }
};

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    ar: { translation: ar },
    darija: { translation: darija },
  },
  lng: 'fr', // Default language
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false, // React already handles XSS
  },
  react: {
    useSuspense: false, // Disable suspense for React Native
  },
});

export default i18n;
