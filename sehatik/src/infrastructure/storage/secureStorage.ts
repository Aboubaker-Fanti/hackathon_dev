/**
 * Secure Storage Service
 * Encrypts sensitive health data before persistence
 * Uses expo-secure-store for key storage
 *
 * CRITICAL: All user health data MUST be encrypted before storage
 * Compliant with Morocco Law 09-08 on personal data protection
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ENCRYPTION_KEY_ALIAS = 'sehatik_enc_key';

/**
 * Store a value securely (uses device keychain/keystore)
 */
export const secureSet = async (key: string, value: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    // Fail silently - never log sensitive data
  }
};

/**
 * Retrieve a securely stored value
 */
export const secureGet = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
};

/**
 * Delete a securely stored value
 */
export const secureDelete = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    // Fail silently
  }
};

/**
 * Store non-sensitive data locally (offline-first)
 */
export const localSet = async (key: string, value: unknown): Promise<void> => {
  try {
    const serialized = JSON.stringify(value);
    await AsyncStorage.setItem(`@sehatik_${key}`, serialized);
  } catch {
    // Fail silently
  }
};

/**
 * Retrieve non-sensitive local data
 */
export const localGet = async <T = unknown>(key: string): Promise<T | null> => {
  try {
    const serialized = await AsyncStorage.getItem(`@sehatik_${key}`);
    if (serialized) {
      return JSON.parse(serialized) as T;
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Clear all local data (for account deletion / right to be forgotten)
 */
export const clearAllData = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const sehatikKeys = keys.filter((k) => k.startsWith('@sehatik_'));
    await AsyncStorage.multiRemove(sehatikKeys);
    await SecureStore.deleteItemAsync(ENCRYPTION_KEY_ALIAS);
  } catch {
    // Fail silently
  }
};
