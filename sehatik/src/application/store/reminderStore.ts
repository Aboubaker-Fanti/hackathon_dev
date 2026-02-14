/**
 * Reminder Store - Zustand
 * Manages exam reminders and notification scheduling
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REMINDER_KEY = '@sehatik_reminders';

export interface Reminder {
  id: string;
  type: 'monthly_exam' | 'yearly_screening';
  enabled: boolean;
  dayOfMonth: number; // 1-28
  hour: number; // 0-23
  minute: number;
  lastNotified: number | null;
}

interface ReminderState {
  reminders: Reminder[];
  isLoaded: boolean;

  loadReminders: () => Promise<void>;
  setMonthlyReminder: (day: number, hour: number) => Promise<void>;
  toggleReminder: (id: string) => Promise<void>;
  getNextReminderDate: () => Date | null;
}

const DEFAULT_REMINDERS: Reminder[] = [
  {
    id: 'monthly_exam',
    type: 'monthly_exam',
    enabled: true,
    dayOfMonth: 7, // 7th of each month (5-10 days post-period)
    hour: 20, // 8 PM - private evening time
    minute: 0,
    lastNotified: null,
  },
  {
    id: 'yearly_screening',
    type: 'yearly_screening',
    enabled: true,
    dayOfMonth: 1,
    hour: 10,
    minute: 0,
    lastNotified: null,
  },
];

export const useReminderStore = create<ReminderState>((set, get) => ({
  reminders: DEFAULT_REMINDERS,
  isLoaded: false,

  loadReminders: async () => {
    try {
      const data = await AsyncStorage.getItem(REMINDER_KEY);
      if (data) {
        set({ reminders: JSON.parse(data), isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  setMonthlyReminder: async (day: number, hour: number) => {
    const state = get();
    const updated = state.reminders.map((r) =>
      r.id === 'monthly_exam' ? { ...r, dayOfMonth: day, hour, enabled: true } : r,
    );
    set({ reminders: updated });
    await AsyncStorage.setItem(REMINDER_KEY, JSON.stringify(updated));
  },

  toggleReminder: async (id: string) => {
    const state = get();
    const updated = state.reminders.map((r) =>
      r.id === id ? { ...r, enabled: !r.enabled } : r,
    );
    set({ reminders: updated });
    await AsyncStorage.setItem(REMINDER_KEY, JSON.stringify(updated));
  },

  getNextReminderDate: () => {
    const state = get();
    const monthlyReminder = state.reminders.find(
      (r) => r.id === 'monthly_exam' && r.enabled,
    );
    if (!monthlyReminder) return null;

    const now = new Date();
    const next = new Date(
      now.getFullYear(),
      now.getMonth(),
      monthlyReminder.dayOfMonth,
      monthlyReminder.hour,
      monthlyReminder.minute,
    );

    if (next <= now) {
      next.setMonth(next.getMonth() + 1);
    }

    return next;
  },
}));
