/**
 * Auth Store - Zustand
 * Phone + OTP authentication flow
 * Privacy-first: minimal PII storage
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = '@sehatik_auth';
const ONBOARDING_KEY = '@sehatik_onboarding_complete';

interface AuthState {
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;
  userId: string | null;
  phoneNumber: string | null;
  isLoading: boolean;

  // OTP flow
  otpSent: boolean;
  otpVerifying: boolean;

  // Actions
  sendOTP: (phone: string) => Promise<boolean>;
  verifyOTP: (code: string) => Promise<boolean>;
  completeOnboarding: () => Promise<void>;
  logout: () => Promise<void>;
  loadAuthState: () => Promise<void>;
  skipAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isOnboardingComplete: false,
  userId: null,
  phoneNumber: null,
  isLoading: true,
  otpSent: false,
  otpVerifying: false,

  sendOTP: async (phone: string) => {
    try {
      set({ isLoading: true });
      // TODO: Replace with actual Firebase phone auth
      // For MVP: simulate OTP sending
      await new Promise((resolve) => setTimeout(resolve, 1500));
      set({ otpSent: true, phoneNumber: phone, isLoading: false });
      return true;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  verifyOTP: async (code: string) => {
    try {
      set({ otpVerifying: true });
      // TODO: Replace with actual Firebase OTP verification
      // For MVP: accept any 6-digit code
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (code.length === 6) {
        const userId = `user_${Date.now()}`;
        await AsyncStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ userId, phone: get().phoneNumber }),
        );
        set({
          isAuthenticated: true,
          userId,
          otpVerifying: false,
          otpSent: false,
        });
        return true;
      }
      set({ otpVerifying: false });
      return false;
    } catch {
      set({ otpVerifying: false });
      return false;
    }
  },

  skipAuth: async () => {
    const userId = `guest_${Date.now()}`;
    await AsyncStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ userId, phone: null }),
    );
    set({ isAuthenticated: true, userId });
  },

  completeOnboarding: async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    set({ isOnboardingComplete: true });
  },

  logout: async () => {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    set({
      isAuthenticated: false,
      userId: null,
      phoneNumber: null,
      otpSent: false,
    });
  },

  loadAuthState: async () => {
    try {
      const [authData, onboarding] = await Promise.all([
        AsyncStorage.getItem(AUTH_STORAGE_KEY),
        AsyncStorage.getItem(ONBOARDING_KEY),
      ]);

      if (authData) {
        const { userId, phone } = JSON.parse(authData);
        set({
          isAuthenticated: true,
          userId,
          phoneNumber: phone,
          isOnboardingComplete: onboarding === 'true',
          isLoading: false,
        });
      } else {
        set({
          isOnboardingComplete: onboarding === 'true',
          isLoading: false,
        });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
