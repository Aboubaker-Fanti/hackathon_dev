/**
 * Self-Check Store - Zustand
 * Manages the interactive self-check flow state and history.
 * The question phase is now handled by the chat engine (selfCheckChatStore),
 * so this store manages: instructions, step transitions, and results.
 * Persists history to AsyncStorage (encrypted-ready).
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SELF_CHECK_STEPS,
  assessSelfCheckFromChat,
  type SelfCheckResult,
  type SelfCheckStep,
} from '../../infrastructure/data/selfCheckSteps';

const SELF_CHECK_HISTORY_KEY = '@sehatik_selfcheck_history';

// ── Types ──────────────────────────────────────────────────

export interface SelfCheckRecord {
  id: string;
  date: number;
  answers: Record<string, string>;
  result: SelfCheckResult;
  completed: boolean;
}

/**
 * During the guided flow, the user transitions through phases:
 *   'instructions' -> watching/reading the visual guide
 *   'chat'         -> conversational Q&A for the current step
 */
export type StepPhase = 'instructions' | 'chat';

interface SelfCheckState {
  // ── Flow state ─────────────────────
  isActive: boolean;
  currentStepIndex: number;
  /** Which instruction within the current step (carousel index) */
  currentInstructionIndex: number;
  /** Current phase within a step */
  phase: StepPhase;
  /** Accumulated answers from all step chats */
  allAnswers: Record<string, string>;
  /** Final result after completing all steps */
  result: SelfCheckResult | null;

  // ── History ────────────────────────
  history: SelfCheckRecord[];
  lastCheckDate: number | null;
  lastResult: SelfCheckResult | null;

  // ── Actions ────────────────────────
  startCheck: () => void;
  nextInstruction: () => boolean;
  previousInstruction: () => void;
  /** Transition from instructions -> chat phase */
  startChat: () => void;
  /** Called when the step chat is complete; merges answers and advances */
  completeStepChat: (stepAnswers: Record<string, string>) => void;
  /** Advance to the next step. Returns false if all steps done. */
  nextStep: () => boolean;
  /** Called when user wants to go back to instructions from chat */
  backToInstructions: () => void;
  /** Finalize the self-check and compute results */
  completeCheck: () => SelfCheckResult;
  /** Reset flow for a new check */
  resetCheck: () => void;

  // ── Persistence ────────────────────
  loadHistory: () => Promise<void>;
  saveRecord: (record: SelfCheckRecord) => Promise<void>;

  // ── Computed helpers ───────────────
  getCurrentStep: () => SelfCheckStep;
  getTotalSteps: () => number;
  getOverallProgress: () => { current: number; total: number; percentage: number };
}

export const useSelfCheckStore = create<SelfCheckState>((set, get) => ({
  // Initial state
  isActive: false,
  currentStepIndex: 0,
  currentInstructionIndex: 0,
  phase: 'instructions',
  allAnswers: {},
  result: null,
  history: [],
  lastCheckDate: null,
  lastResult: null,

  // ── Actions ──────────────────────────────────────────────

  startCheck: () => {
    set({
      isActive: true,
      currentStepIndex: 0,
      currentInstructionIndex: 0,
      phase: 'instructions',
      allAnswers: {},
      result: null,
    });
  },

  nextInstruction: () => {
    const { currentStepIndex, currentInstructionIndex } = get();
    const step = SELF_CHECK_STEPS[currentStepIndex];
    if (currentInstructionIndex < step.instructions.length - 1) {
      set({ currentInstructionIndex: currentInstructionIndex + 1 });
      return true;
    }
    return false;
  },

  previousInstruction: () => {
    const { currentInstructionIndex } = get();
    if (currentInstructionIndex > 0) {
      set({ currentInstructionIndex: currentInstructionIndex - 1 });
    }
  },

  startChat: () => {
    set({ phase: 'chat' });
  },

  completeStepChat: (stepAnswers: Record<string, string>) => {
    set((state) => ({
      allAnswers: { ...state.allAnswers, ...stepAnswers },
    }));

    // Auto-advance to next step or complete
    const { currentStepIndex } = get();
    if (currentStepIndex < SELF_CHECK_STEPS.length - 1) {
      set({
        currentStepIndex: currentStepIndex + 1,
        currentInstructionIndex: 0,
        phase: 'instructions',
      });
    } else {
      // All steps done
      get().completeCheck();
    }
  },

  backToInstructions: () => {
    const { currentStepIndex } = get();
    const step = SELF_CHECK_STEPS[currentStepIndex];
    set({
      phase: 'instructions',
      currentInstructionIndex: step.instructions.length - 1,
    });
  },

  nextStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex < SELF_CHECK_STEPS.length - 1) {
      set({
        currentStepIndex: currentStepIndex + 1,
        currentInstructionIndex: 0,
        phase: 'instructions',
      });
      return true;
    }
    return false;
  },

  completeCheck: () => {
    const state = get();
    const result = assessSelfCheckFromChat(state.allAnswers);

    const record: SelfCheckRecord = {
      id: `selfcheck_${Date.now()}`,
      date: Date.now(),
      answers: state.allAnswers,
      result,
      completed: true,
    };

    set({
      result,
      isActive: false,
      lastCheckDate: Date.now(),
      lastResult: result,
      history: [record, ...state.history],
    });

    get().saveRecord(record);

    return result;
  },

  resetCheck: () => {
    set({
      isActive: false,
      currentStepIndex: 0,
      currentInstructionIndex: 0,
      phase: 'instructions',
      allAnswers: {},
      result: null,
    });
  },

  // ── Persistence ──────────────────────────────────────────

  loadHistory: async () => {
    try {
      const data = await AsyncStorage.getItem(SELF_CHECK_HISTORY_KEY);
      if (data) {
        const records: SelfCheckRecord[] = JSON.parse(data);
        set({
          history: records,
          lastCheckDate: records.length > 0 ? records[0].date : null,
          lastResult: records.length > 0 ? records[0].result : null,
        });
      }
    } catch {
      // Fail silently
    }
  },

  saveRecord: async (_record: SelfCheckRecord) => {
    try {
      const state = get();
      await AsyncStorage.setItem(
        SELF_CHECK_HISTORY_KEY,
        JSON.stringify(state.history),
      );
    } catch {
      // Fail silently
    }
  },

  // ── Computed ─────────────────────────────────────────────

  getCurrentStep: () => {
    return SELF_CHECK_STEPS[get().currentStepIndex];
  },

  getTotalSteps: () => SELF_CHECK_STEPS.length,

  getOverallProgress: () => {
    const { currentStepIndex, phase, currentInstructionIndex } = get();

    // Each step has instructions + 1 chat phase
    let totalPages = 0;
    let currentPage = 0;

    for (let i = 0; i < SELF_CHECK_STEPS.length; i++) {
      const step = SELF_CHECK_STEPS[i];
      const stepPages = step.instructions.length + 1; // instructions + chat

      if (i < currentStepIndex) {
        currentPage += stepPages;
      } else if (i === currentStepIndex) {
        if (phase === 'instructions') {
          currentPage += currentInstructionIndex + 1;
        } else {
          // Chat phase counts as the last page of this step
          currentPage += step.instructions.length + 1;
        }
      }

      totalPages += stepPages;
    }

    return {
      current: currentPage,
      total: totalPages,
      percentage: totalPages > 0 ? (currentPage / totalPages) * 100 : 0,
    };
  },
}));
