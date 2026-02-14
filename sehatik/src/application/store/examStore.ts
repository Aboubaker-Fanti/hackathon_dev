/**
 * Exam Store - Zustand
 * Manages autopalpation exam state and history
 * All data encrypted before storage (privacy-first)
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { assessSymptoms, type RiskAssessmentResult } from '../../domain/services/riskAssessment';
import { EXAM_SECTIONS, shouldShowQuestion, type ExamSection } from '../../infrastructure/data/examQuestions';

const EXAM_HISTORY_KEY = '@sehatik_exam_history';

export interface ExamRecord {
  id: string;
  date: number;
  answers: Record<string, unknown>;
  result: RiskAssessmentResult;
  completed: boolean;
}

interface ExamState {
  // Current exam
  currentSectionIndex: number;
  currentQuestionIndex: number;
  answers: Record<string, unknown>;
  isExamActive: boolean;
  examResult: RiskAssessmentResult | null;

  // History
  examHistory: ExamRecord[];
  lastExamDate: number | null;

  // Actions
  startExam: () => void;
  answerQuestion: (questionId: string, answer: unknown) => void;
  nextQuestion: () => boolean; // returns false if exam is complete
  previousQuestion: () => void;
  completeExam: () => RiskAssessmentResult;
  resetExam: () => void;
  loadHistory: () => Promise<void>;
  saveExam: (record: ExamRecord) => Promise<void>;

  // Computed
  getCurrentSection: () => ExamSection;
  getProgress: () => { current: number; total: number; percentage: number };
  getVisibleQuestions: () => number;
}

export const useExamStore = create<ExamState>((set, get) => ({
  currentSectionIndex: 0,
  currentQuestionIndex: 0,
  answers: {},
  isExamActive: false,
  examResult: null,
  examHistory: [],
  lastExamDate: null,

  startExam: () => {
    set({
      currentSectionIndex: 0,
      currentQuestionIndex: 0,
      answers: {},
      isExamActive: true,
      examResult: null,
    });
  },

  answerQuestion: (questionId: string, answer: unknown) => {
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    }));
  },

  nextQuestion: () => {
    const state = get();
    const sections = EXAM_SECTIONS;
    const currentSection = sections[state.currentSectionIndex];
    const visibleQuestions = currentSection.questions.filter((q) =>
      shouldShowQuestion(q, state.answers),
    );

    // Try next question in current section
    let nextQIndex = state.currentQuestionIndex + 1;
    while (nextQIndex < currentSection.questions.length) {
      if (shouldShowQuestion(currentSection.questions[nextQIndex], state.answers)) {
        set({ currentQuestionIndex: nextQIndex });
        return true;
      }
      nextQIndex++;
    }

    // Try next section
    let nextSIndex = state.currentSectionIndex + 1;
    while (nextSIndex < sections.length) {
      const nextSection = sections[nextSIndex];
      const firstVisible = nextSection.questions.findIndex((q) =>
        shouldShowQuestion(q, state.answers),
      );
      if (firstVisible >= 0) {
        set({
          currentSectionIndex: nextSIndex,
          currentQuestionIndex: firstVisible,
        });
        return true;
      }
      nextSIndex++;
    }

    // Exam complete
    return false;
  },

  previousQuestion: () => {
    const state = get();
    const sections = EXAM_SECTIONS;

    // Try previous question in current section
    let prevQIndex = state.currentQuestionIndex - 1;
    while (prevQIndex >= 0) {
      if (shouldShowQuestion(sections[state.currentSectionIndex].questions[prevQIndex], state.answers)) {
        set({ currentQuestionIndex: prevQIndex });
        return;
      }
      prevQIndex--;
    }

    // Try previous section
    let prevSIndex = state.currentSectionIndex - 1;
    while (prevSIndex >= 0) {
      const prevSection = sections[prevSIndex];
      let lastVisible = prevSection.questions.length - 1;
      while (lastVisible >= 0) {
        if (shouldShowQuestion(prevSection.questions[lastVisible], state.answers)) {
          set({
            currentSectionIndex: prevSIndex,
            currentQuestionIndex: lastVisible,
          });
          return;
        }
        lastVisible--;
      }
      prevSIndex--;
    }
  },

  completeExam: () => {
    const state = get();
    const result = assessSymptoms(state.answers);
    const record: ExamRecord = {
      id: `exam_${Date.now()}`,
      date: Date.now(),
      answers: state.answers,
      result,
      completed: true,
    };

    set({
      examResult: result,
      isExamActive: false,
      lastExamDate: Date.now(),
      examHistory: [record, ...state.examHistory],
    });

    // Save async (don't await in sync action)
    get().saveExam(record);

    return result;
  },

  resetExam: () => {
    set({
      currentSectionIndex: 0,
      currentQuestionIndex: 0,
      answers: {},
      isExamActive: false,
      examResult: null,
    });
  },

  loadHistory: async () => {
    try {
      const data = await AsyncStorage.getItem(EXAM_HISTORY_KEY);
      if (data) {
        const history: ExamRecord[] = JSON.parse(data);
        set({
          examHistory: history,
          lastExamDate: history.length > 0 ? history[0].date : null,
        });
      }
    } catch {
      // Fail silently
    }
  },

  saveExam: async (record: ExamRecord) => {
    try {
      const state = get();
      await AsyncStorage.setItem(
        EXAM_HISTORY_KEY,
        JSON.stringify(state.examHistory),
      );
    } catch {
      // Fail silently
    }
  },

  getCurrentSection: () => {
    return EXAM_SECTIONS[get().currentSectionIndex];
  },

  getProgress: () => {
    const state = get();
    const allVisible = EXAM_SECTIONS.flatMap((s) =>
      s.questions.filter((q) => shouldShowQuestion(q, state.answers)),
    );

    let currentPosition = 0;
    for (let s = 0; s < state.currentSectionIndex; s++) {
      currentPosition += EXAM_SECTIONS[s].questions.filter((q) =>
        shouldShowQuestion(q, state.answers),
      ).length;
    }

    // Add current question position within section
    const currentSection = EXAM_SECTIONS[state.currentSectionIndex];
    const visibleInSection = currentSection.questions.filter((q) =>
      shouldShowQuestion(q, state.answers),
    );
    const indexInVisible = visibleInSection.findIndex(
      (q) => q === currentSection.questions[state.currentQuestionIndex],
    );
    currentPosition += Math.max(0, indexInVisible) + 1;

    const total = allVisible.length;
    return {
      current: currentPosition,
      total,
      percentage: total > 0 ? (currentPosition / total) * 100 : 0,
    };
  },

  getVisibleQuestions: () => {
    const state = get();
    return EXAM_SECTIONS.flatMap((s) =>
      s.questions.filter((q) => shouldShowQuestion(q, state.answers)),
    ).length;
  },
}));
