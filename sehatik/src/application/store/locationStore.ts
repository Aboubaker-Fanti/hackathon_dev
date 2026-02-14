/**
 * Location Store
 * Manages user location state for nearby center search
 *
 * DEMO MODE: Uses UM6P (Benguerir) as hardcoded location
 * In production, this would use expo-location to get real GPS coordinates
 *
 * PRIVACY NOTE: Location is ephemeral — never persisted to storage or profile
 */

import { create } from 'zustand';

/**
 * Demo location: UM6P (Université Mohammed VI Polytechnique), Benguerir
 * Coordinates: 32.2232°N, 7.9391°W
 */
const DEMO_LOCATION = {
  latitude: 32.2232,
  longitude: -7.9391,
  label: 'UM6P, Benguerir',
  labelAr: 'جامعة محمد السادس متعددة التخصصات، بنجرير',
};

interface UserLocation {
  latitude: number;
  longitude: number;
  label: string;
  labelAr: string;
}

interface LocationState {
  /** Current user location (ephemeral, never persisted) */
  location: UserLocation | null;
  /** Whether location has been obtained */
  hasLocation: boolean;
  /** Loading state while getting location */
  isLoading: boolean;
  /** Error message if location retrieval fails */
  error: string | null;
  /** Whether we're using demo location */
  isDemoMode: boolean;

  /** Load demo location (UM6P, Benguerir) */
  loadDemoLocation: () => void;
  /** Clear location from memory */
  clearLocation: () => void;
  /**
   * Request real location from device
   * TODO: Implement with expo-location in production
   * For now, falls back to demo location
   */
  requestLocation: () => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
  location: null,
  hasLocation: false,
  isLoading: false,
  error: null,
  isDemoMode: true,

  loadDemoLocation: () => {
    set({
      location: DEMO_LOCATION,
      hasLocation: true,
      isLoading: false,
      error: null,
      isDemoMode: true,
    });
  },

  clearLocation: () => {
    set({
      location: null,
      hasLocation: false,
      isLoading: false,
      error: null,
    });
  },

  requestLocation: async () => {
    set({ isLoading: true, error: null });

    try {
      // TODO: In production, use expo-location here:
      // const { status } = await Location.requestForegroundPermissionsAsync();
      // if (status !== 'granted') { throw new Error('Permission denied'); }
      // const location = await Location.getCurrentPositionAsync({});

      // For demo: simulate a short delay then use UM6P coordinates
      await new Promise((resolve) => setTimeout(resolve, 800));

      set({
        location: DEMO_LOCATION,
        hasLocation: true,
        isLoading: false,
        isDemoMode: true,
      });
    } catch {
      set({
        error: 'location_error',
        isLoading: false,
      });
    }
  },
}));
