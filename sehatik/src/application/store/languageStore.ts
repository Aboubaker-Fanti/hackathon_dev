/**
 * Language Store - Zustand
 * Manages language selection and RTL state
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../infrastructure/i18n';
import { applyRTL, isRTLLanguage, type LanguageCode } from '../../infrastructure/i18n';

const LANGUAGE_STORAGE_KEY = '@sehatik_language';

interface LanguageState {
  currentLanguage: LanguageCode;
  isRTL: boolean;
  isLoaded: boolean;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  loadSavedLanguage: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  currentLanguage: 'fr',
  isRTL: false,
  isLoaded: false,

  setLanguage: async (lang: LanguageCode) => {
    try {
      // Update i18n
      await i18n.changeLanguage(lang);

      // Apply RTL direction
      applyRTL(lang);

      // Persist selection
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);

      set({
        currentLanguage: lang,
        isRTL: isRTLLanguage(lang),
      });
    } catch (error) {
      // Silently handle storage errors - don't log sensitive data
    }
  },

  loadSavedLanguage: async () => {
    try {
      const savedLang = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLang && ['fr', 'ar', 'darija'].includes(savedLang)) {
        const lang = savedLang as LanguageCode;
        await i18n.changeLanguage(lang);
        applyRTL(lang);
        set({
          currentLanguage: lang,
          isRTL: isRTLLanguage(lang),
          isLoaded: true,
        });
      } else {
        set({ isLoaded: true });
      }
    } catch (error) {
      set({ isLoaded: true });
    }
  },
}));
