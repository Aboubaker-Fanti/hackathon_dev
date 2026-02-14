/**
 * Self-Check Chat Store - Zustand
 * Conversation engine that processes the structured conversation scripts.
 *
 * Manages:
 * - Chat message history (ephemeral, not persisted)
 * - Node queue processing with conditional branching
 * - Typing indicator delays
 * - Clarification handling (LLM + offline fallback)
 * - Structured answer extraction for risk scoring
 */

import { create } from 'zustand';
import {
  STEP_CONVERSATIONS,
  type ConversationNode,
  type QuestionNode,
} from '../../infrastructure/data/selfCheckConversations';
import {
  findClarification,
  buildClarificationSystemPrompt,
} from '../../infrastructure/data/selfCheckClarifications';

// ── Types ──────────────────────────────────────────────────

export interface ChatBubbleData {
  id: string;
  type: 'assistant' | 'user' | 'typing';
  textKey?: string;         // i18n key for assistant messages
  text?: string;            // raw text for user messages / clarification responses
  questionId?: string;      // set on user reply bubbles, links to the question
  answerValue?: string;     // the quick-reply value the user chose
  timestamp: number;
}

interface SelfCheckChatState {
  // ── State ──────────────────────────
  messages: ChatBubbleData[];
  /** Remaining nodes to process (flattened from script) */
  nodeQueue: ConversationNode[];
  /** The current question awaiting a reply (null if waiting for nothing) */
  activeQuestion: QuestionNode | null;
  /** All structured answers keyed by question node id */
  answers: Record<string, string>;
  /** Whether the assistant is "typing" (showing indicator) */
  isTyping: boolean;
  /** Whether the user is composing a free-text clarification */
  isClarifying: boolean;
  /** Whether all nodes have been processed (chat complete) */
  isComplete: boolean;
  /** Current step id */
  currentStepId: string | null;

  // ── Actions ────────────────────────
  /** Initialize chat for a given step */
  initChat: (stepId: string) => void;
  /** Process the next node(s) in the queue */
  processNextNodes: () => void;
  /** Handle a quick-reply tap */
  handleQuickReply: (questionId: string, value: string, labelKey: string) => void;
  /** Handle a free-text clarification question */
  handleClarification: (text: string, language: string) => Promise<void>;
  /** Reset the chat state */
  resetChat: () => void;

  // ── Computed ───────────────────────
  getAnswers: () => Record<string, string>;
}

/**
 * Flatten conditional branches based on current answers.
 * Returns the next batch of nodes to process until we hit a question.
 */
const resolveNodes = (
  nodes: ConversationNode[],
  answers: Record<string, string>,
): ConversationNode[] => {
  const resolved: ConversationNode[] = [];

  for (const node of nodes) {
    if (node.type === 'conditional') {
      const answer = answers[node.dependsOn];
      if (answer && node.showWhen.includes(answer)) {
        // Expand children
        resolved.push(...resolveNodes(node.children, answers));
      }
      // Skip if condition not met
    } else {
      resolved.push(node);
    }
  }

  return resolved;
};

export const useSelfCheckChatStore = create<SelfCheckChatState>((set, get) => ({
  messages: [],
  nodeQueue: [],
  activeQuestion: null,
  answers: {},
  isTyping: false,
  isClarifying: false,
  isComplete: false,
  currentStepId: null,

  initChat: (stepId: string) => {
    const script = STEP_CONVERSATIONS[stepId];
    if (!script) return;

    set({
      messages: [],
      nodeQueue: [...script],
      activeQuestion: null,
      answers: {},
      isTyping: false,
      isClarifying: false,
      isComplete: false,
      currentStepId: stepId,
    });

    // Start processing after a short delay
    setTimeout(() => get().processNextNodes(), 300);
  },

  processNextNodes: () => {
    const { nodeQueue, answers } = get();
    if (nodeQueue.length === 0) {
      set({ isComplete: true, isTyping: false });
      return;
    }

    // Resolve conditionals
    const resolved = resolveNodes(nodeQueue, answers);

    if (resolved.length === 0) {
      set({ nodeQueue: [], isComplete: true, isTyping: false });
      return;
    }

    const node = resolved[0];
    const remaining = resolved.slice(1);

    if (node.type === 'assistant_message') {
      // Show typing indicator, then show message
      set({ isTyping: true, nodeQueue: remaining });

      const delay = node.delayMs || 500;
      setTimeout(() => {
        set((state) => ({
          isTyping: false,
          messages: [
            ...state.messages,
            {
              id: node.id,
              type: 'assistant' as const,
              textKey: node.textKey,
              timestamp: Date.now(),
            },
          ],
        }));

        // Continue processing next nodes
        setTimeout(() => get().processNextNodes(), 200);
      }, delay);
    } else if (node.type === 'question') {
      // Show typing, then show question and wait for reply
      set({ isTyping: true, nodeQueue: remaining });

      const delay = 400;
      setTimeout(() => {
        set((state) => ({
          isTyping: false,
          activeQuestion: node,
          messages: [
            ...state.messages,
            {
              id: node.id,
              type: 'assistant' as const,
              textKey: node.textKey,
              timestamp: Date.now(),
            },
          ],
        }));
      }, delay);
    }
    // Conditionals are already resolved above, so we don't handle them here
  },

  handleQuickReply: (questionId: string, value: string, labelKey: string) => {
    const { activeQuestion } = get();
    if (!activeQuestion || activeQuestion.id !== questionId) return;

    // Add user reply bubble
    set((state) => ({
      activeQuestion: null,
      answers: { ...state.answers, [questionId]: value },
      messages: [
        ...state.messages,
        {
          id: `reply_${questionId}`,
          type: 'user' as const,
          textKey: labelKey,
          questionId,
          answerValue: value,
          timestamp: Date.now(),
        },
      ],
    }));

    // Process next nodes after a brief pause
    setTimeout(() => get().processNextNodes(), 300);
  },

  handleClarification: async (text: string, language: string) => {
    const { currentStepId } = get();
    if (!currentStepId) return;

    // Add user message
    set((state) => ({
      isClarifying: true,
      messages: [
        ...state.messages,
        {
          id: `clarify_user_${Date.now()}`,
          type: 'user' as const,
          text,
          timestamp: Date.now(),
        },
      ],
    }));

    // Show typing
    set({ isTyping: true });

    let responseText: string;

    try {
      // Try LLM first
      const Constants = await import('expo-constants');
      const apiKey = Constants.default.expoConfig?.extra?.ANTHROPIC_API_KEY;

      if (apiKey && apiKey !== 'your_anthropic_key_here') {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 512,
            system: buildClarificationSystemPrompt(currentStepId, language),
            messages: [{ role: 'user', content: text }],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          responseText = data.content[0].text;
        } else {
          // Fallback to offline
          const key = findClarification(currentStepId, text);
          responseText = `__i18n:${key}`;
        }
      } else {
        const key = findClarification(currentStepId, text);
        responseText = `__i18n:${key}`;
      }
    } catch {
      const key = findClarification(currentStepId, text);
      responseText = `__i18n:${key}`;
    }

    // Add assistant response
    set((state) => ({
      isTyping: false,
      isClarifying: false,
      messages: [
        ...state.messages,
        {
          id: `clarify_response_${Date.now()}`,
          type: 'assistant' as const,
          text: responseText.startsWith('__i18n:') ? undefined : responseText,
          textKey: responseText.startsWith('__i18n:')
            ? responseText.replace('__i18n:', '')
            : undefined,
          timestamp: Date.now(),
        },
      ],
    }));
  },

  resetChat: () => {
    set({
      messages: [],
      nodeQueue: [],
      activeQuestion: null,
      answers: {},
      isTyping: false,
      isClarifying: false,
      isComplete: false,
      currentStepId: null,
    });
  },

  getAnswers: () => get().answers,
}));
