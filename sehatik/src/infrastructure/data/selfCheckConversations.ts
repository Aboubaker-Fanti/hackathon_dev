/**
 * Self-Check Conversation Scripts
 * Defines the structured chat flow for each self-check step.
 *
 * Node types:
 *   - assistant_message: text the assistant says
 *   - question: structured question with quick-reply options
 *   - conditional: shows child nodes based on a previous answer
 *
 * The conversation engine processes these nodes sequentially,
 * expanding conditionals when their conditions match.
 */

// ── Node Types ─────────────────────────────────────────────

export interface QuickReplyOption {
  value: string;
  labelKey: string;
  isConcern: boolean;
}

export interface AssistantMessageNode {
  type: 'assistant_message';
  id: string;
  textKey: string;
  delayMs?: number;
}

export interface QuestionNode {
  type: 'question';
  id: string;
  textKey: string;
  options: QuickReplyOption[];
  weight: number;
}

export interface ConditionalNode {
  type: 'conditional';
  dependsOn: string;
  showWhen: string[];
  children: ConversationNode[];
}

export type ConversationNode =
  | AssistantMessageNode
  | QuestionNode
  | ConditionalNode;

// ── Helper to build standard Yes/No/Unsure options ─────────

const yesNoUnsure = (): QuickReplyOption[] => [
  { value: 'yes', labelKey: 'common.yes', isConcern: true },
  { value: 'no', labelKey: 'common.no', isConcern: false },
  { value: 'unsure', labelKey: 'selfCheck.unsure', isConcern: true },
];

// ── Step 1: Visual Examination ─────────────────────────────

export const VISUAL_CONVERSATION: ConversationNode[] = [
  {
    type: 'assistant_message',
    id: 'visual_greeting',
    textKey: 'selfCheck.chat.visual.greeting',
    delayMs: 600,
  },
  {
    type: 'assistant_message',
    id: 'visual_disclaimer',
    textKey: 'selfCheck.chat.disclaimer',
    delayMs: 400,
  },
  // Q1: Skin changes
  {
    type: 'question',
    id: 'visual_q_skin_changes',
    textKey: 'selfCheck.chat.visual.q_skinChanges',
    options: yesNoUnsure(),
    weight: 2,
  },
  // Follow-up if YES
  {
    type: 'conditional',
    dependsOn: 'visual_q_skin_changes',
    showWhen: ['yes'],
    children: [
      {
        type: 'assistant_message',
        id: 'visual_skin_yes_ack',
        textKey: 'selfCheck.chat.visual.skinYesAck',
        delayMs: 500,
      },
      {
        type: 'question',
        id: 'visual_q_skin_type',
        textKey: 'selfCheck.chat.visual.q_skinType',
        options: [
          { value: 'redness', labelKey: 'selfCheck.chat.visual.opt_redness', isConcern: true },
          { value: 'dimpling', labelKey: 'selfCheck.chat.visual.opt_dimpling', isConcern: true },
          { value: 'thickening', labelKey: 'selfCheck.chat.visual.opt_thickening', isConcern: true },
          { value: 'peau_orange', labelKey: 'selfCheck.chat.visual.opt_peauOrange', isConcern: true },
          { value: 'other', labelKey: 'selfCheck.chat.visual.opt_other', isConcern: true },
        ],
        weight: 1,
      },
    ],
  },
  // Follow-up if UNSURE
  {
    type: 'conditional',
    dependsOn: 'visual_q_skin_changes',
    showWhen: ['unsure'],
    children: [
      {
        type: 'assistant_message',
        id: 'visual_skin_unsure_help',
        textKey: 'selfCheck.chat.visual.skinUnsureHelp',
        delayMs: 600,
      },
      {
        type: 'question',
        id: 'visual_q_skin_recheck',
        textKey: 'selfCheck.chat.visual.q_skinRecheck',
        options: [
          { value: 'yes', labelKey: 'selfCheck.chat.visual.opt_seeSomething', isConcern: true },
          { value: 'no', labelKey: 'selfCheck.chat.visual.opt_looksNormal', isConcern: false },
          { value: 'unsure', labelKey: 'selfCheck.chat.visual.opt_stillUnsure', isConcern: true },
        ],
        weight: 1,
      },
    ],
  },
  // Reassurance if NO
  {
    type: 'conditional',
    dependsOn: 'visual_q_skin_changes',
    showWhen: ['no'],
    children: [
      {
        type: 'assistant_message',
        id: 'visual_skin_no_ack',
        textKey: 'selfCheck.chat.visual.skinNoAck',
        delayMs: 400,
      },
    ],
  },
  // Q2: Nipple changes
  {
    type: 'question',
    id: 'visual_q_nipple_changes',
    textKey: 'selfCheck.chat.visual.q_nippleChanges',
    options: yesNoUnsure(),
    weight: 2,
  },
  // Follow-up if YES
  {
    type: 'conditional',
    dependsOn: 'visual_q_nipple_changes',
    showWhen: ['yes'],
    children: [
      {
        type: 'assistant_message',
        id: 'visual_nipple_yes_ack',
        textKey: 'selfCheck.chat.visual.nippleYesAck',
        delayMs: 500,
      },
      {
        type: 'question',
        id: 'visual_q_nipple_type',
        textKey: 'selfCheck.chat.visual.q_nippleType',
        options: [
          { value: 'retraction', labelKey: 'selfCheck.chat.visual.opt_retraction', isConcern: true },
          { value: 'discharge', labelKey: 'selfCheck.chat.visual.opt_discharge', isConcern: true },
          { value: 'color_change', labelKey: 'selfCheck.chat.visual.opt_colorChange', isConcern: true },
          { value: 'crusting', labelKey: 'selfCheck.chat.visual.opt_crusting', isConcern: true },
        ],
        weight: 1,
      },
    ],
  },
  {
    type: 'conditional',
    dependsOn: 'visual_q_nipple_changes',
    showWhen: ['unsure'],
    children: [
      {
        type: 'assistant_message',
        id: 'visual_nipple_unsure_help',
        textKey: 'selfCheck.chat.visual.nippleUnsureHelp',
        delayMs: 500,
      },
    ],
  },
  {
    type: 'conditional',
    dependsOn: 'visual_q_nipple_changes',
    showWhen: ['no'],
    children: [
      {
        type: 'assistant_message',
        id: 'visual_nipple_no_ack',
        textKey: 'selfCheck.chat.visual.nippleNoAck',
        delayMs: 400,
      },
    ],
  },
  // Closing
  {
    type: 'assistant_message',
    id: 'visual_closing',
    textKey: 'selfCheck.chat.visual.closing',
    delayMs: 500,
  },
];

// ── Step 2: Palpation ──────────────────────────────────────

export const PALPATION_CONVERSATION: ConversationNode[] = [
  {
    type: 'assistant_message',
    id: 'palpation_greeting',
    textKey: 'selfCheck.chat.palpation.greeting',
    delayMs: 600,
  },
  // Q1: Lump
  {
    type: 'question',
    id: 'palpation_q_lump',
    textKey: 'selfCheck.chat.palpation.q_lump',
    options: yesNoUnsure(),
    weight: 3,
  },
  {
    type: 'conditional',
    dependsOn: 'palpation_q_lump',
    showWhen: ['yes'],
    children: [
      {
        type: 'assistant_message',
        id: 'palpation_lump_yes_ack',
        textKey: 'selfCheck.chat.palpation.lumpYesAck',
        delayMs: 500,
      },
      {
        type: 'question',
        id: 'palpation_q_lump_location',
        textKey: 'selfCheck.chat.palpation.q_lumpLocation',
        options: [
          { value: 'upper_outer', labelKey: 'selfCheck.chat.palpation.opt_upperOuter', isConcern: true },
          { value: 'upper_inner', labelKey: 'selfCheck.chat.palpation.opt_upperInner', isConcern: true },
          { value: 'lower_outer', labelKey: 'selfCheck.chat.palpation.opt_lowerOuter', isConcern: true },
          { value: 'lower_inner', labelKey: 'selfCheck.chat.palpation.opt_lowerInner', isConcern: true },
          { value: 'central', labelKey: 'selfCheck.chat.palpation.opt_central', isConcern: true },
          { value: 'armpit', labelKey: 'selfCheck.chat.palpation.opt_armpit', isConcern: true },
        ],
        weight: 0,
      },
      {
        type: 'question',
        id: 'palpation_q_lump_feel',
        textKey: 'selfCheck.chat.palpation.q_lumpFeel',
        options: [
          { value: 'hard', labelKey: 'selfCheck.chat.palpation.opt_hard', isConcern: true },
          { value: 'soft', labelKey: 'selfCheck.chat.palpation.opt_soft', isConcern: false },
          { value: 'mobile', labelKey: 'selfCheck.chat.palpation.opt_mobile', isConcern: false },
          { value: 'fixed', labelKey: 'selfCheck.chat.palpation.opt_fixed', isConcern: true },
        ],
        weight: 1,
      },
    ],
  },
  {
    type: 'conditional',
    dependsOn: 'palpation_q_lump',
    showWhen: ['unsure'],
    children: [
      {
        type: 'assistant_message',
        id: 'palpation_lump_unsure_help',
        textKey: 'selfCheck.chat.palpation.lumpUnsureHelp',
        delayMs: 600,
      },
    ],
  },
  {
    type: 'conditional',
    dependsOn: 'palpation_q_lump',
    showWhen: ['no'],
    children: [
      {
        type: 'assistant_message',
        id: 'palpation_lump_no_ack',
        textKey: 'selfCheck.chat.palpation.lumpNoAck',
        delayMs: 400,
      },
    ],
  },
  // Q2: Pain
  {
    type: 'question',
    id: 'palpation_q_pain',
    textKey: 'selfCheck.chat.palpation.q_pain',
    options: yesNoUnsure(),
    weight: 1,
  },
  {
    type: 'conditional',
    dependsOn: 'palpation_q_pain',
    showWhen: ['yes'],
    children: [
      {
        type: 'assistant_message',
        id: 'palpation_pain_yes_ack',
        textKey: 'selfCheck.chat.palpation.painYesAck',
        delayMs: 500,
      },
      {
        type: 'question',
        id: 'palpation_q_pain_cyclic',
        textKey: 'selfCheck.chat.palpation.q_painCyclic',
        options: [
          { value: 'yes', labelKey: 'common.yes', isConcern: false },
          { value: 'no', labelKey: 'common.no', isConcern: true },
          { value: 'unsure', labelKey: 'selfCheck.unsure', isConcern: true },
        ],
        weight: 1,
      },
    ],
  },
  {
    type: 'conditional',
    dependsOn: 'palpation_q_pain',
    showWhen: ['no'],
    children: [
      {
        type: 'assistant_message',
        id: 'palpation_pain_no_ack',
        textKey: 'selfCheck.chat.palpation.painNoAck',
        delayMs: 400,
      },
    ],
  },
  // Q3: Changes vs last month
  {
    type: 'question',
    id: 'palpation_q_changes',
    textKey: 'selfCheck.chat.palpation.q_changes',
    options: yesNoUnsure(),
    weight: 2,
  },
  {
    type: 'conditional',
    dependsOn: 'palpation_q_changes',
    showWhen: ['yes'],
    children: [
      {
        type: 'assistant_message',
        id: 'palpation_changes_yes_ack',
        textKey: 'selfCheck.chat.palpation.changesYesAck',
        delayMs: 500,
      },
    ],
  },
  {
    type: 'conditional',
    dependsOn: 'palpation_q_changes',
    showWhen: ['no'],
    children: [
      {
        type: 'assistant_message',
        id: 'palpation_changes_no_ack',
        textKey: 'selfCheck.chat.palpation.changesNoAck',
        delayMs: 400,
      },
    ],
  },
  // Closing
  {
    type: 'assistant_message',
    id: 'palpation_closing',
    textKey: 'selfCheck.chat.palpation.closing',
    delayMs: 500,
  },
];

// ── Step 3: Nipple Check ───────────────────────────────────

export const NIPPLE_CONVERSATION: ConversationNode[] = [
  {
    type: 'assistant_message',
    id: 'nipple_greeting',
    textKey: 'selfCheck.chat.nipple.greeting',
    delayMs: 600,
  },
  // Q1: Discharge
  {
    type: 'question',
    id: 'nipple_q_discharge',
    textKey: 'selfCheck.chat.nipple.q_discharge',
    options: yesNoUnsure(),
    weight: 2,
  },
  {
    type: 'conditional',
    dependsOn: 'nipple_q_discharge',
    showWhen: ['yes'],
    children: [
      {
        type: 'assistant_message',
        id: 'nipple_discharge_yes_ack',
        textKey: 'selfCheck.chat.nipple.dischargeYesAck',
        delayMs: 500,
      },
      {
        type: 'question',
        id: 'nipple_q_discharge_type',
        textKey: 'selfCheck.chat.nipple.q_dischargeType',
        options: [
          { value: 'clear', labelKey: 'selfCheck.chat.nipple.opt_clear', isConcern: false },
          { value: 'milky', labelKey: 'selfCheck.chat.nipple.opt_milky', isConcern: false },
          { value: 'bloody', labelKey: 'selfCheck.chat.nipple.opt_bloody', isConcern: true },
          { value: 'other', labelKey: 'selfCheck.chat.nipple.opt_otherColor', isConcern: true },
        ],
        weight: 2,
      },
    ],
  },
  {
    type: 'conditional',
    dependsOn: 'nipple_q_discharge',
    showWhen: ['no'],
    children: [
      {
        type: 'assistant_message',
        id: 'nipple_discharge_no_ack',
        textKey: 'selfCheck.chat.nipple.dischargeNoAck',
        delayMs: 400,
      },
    ],
  },
  // Q2: Appearance
  {
    type: 'question',
    id: 'nipple_q_appearance',
    textKey: 'selfCheck.chat.nipple.q_appearance',
    options: yesNoUnsure(),
    weight: 2,
  },
  {
    type: 'conditional',
    dependsOn: 'nipple_q_appearance',
    showWhen: ['yes'],
    children: [
      {
        type: 'assistant_message',
        id: 'nipple_appearance_yes_ack',
        textKey: 'selfCheck.chat.nipple.appearanceYesAck',
        delayMs: 500,
      },
    ],
  },
  {
    type: 'conditional',
    dependsOn: 'nipple_q_appearance',
    showWhen: ['no'],
    children: [
      {
        type: 'assistant_message',
        id: 'nipple_appearance_no_ack',
        textKey: 'selfCheck.chat.nipple.appearanceNoAck',
        delayMs: 400,
      },
    ],
  },
  // Closing
  {
    type: 'assistant_message',
    id: 'nipple_closing',
    textKey: 'selfCheck.chat.nipple.closing',
    delayMs: 500,
  },
];

// ── Registry ───────────────────────────────────────────────

export const STEP_CONVERSATIONS: Record<string, ConversationNode[]> = {
  visual_examination: VISUAL_CONVERSATION,
  palpation: PALPATION_CONVERSATION,
  nipple_check: NIPPLE_CONVERSATION,
};

/**
 * Get all question nodes from a conversation script (recursively).
 * Used for risk assessment scoring.
 */
export const getAllQuestionNodes = (
  nodes: ConversationNode[],
): QuestionNode[] => {
  const questions: QuestionNode[] = [];
  for (const node of nodes) {
    if (node.type === 'question') {
      questions.push(node);
    } else if (node.type === 'conditional') {
      questions.push(...getAllQuestionNodes(node.children));
    }
  }
  return questions;
};
