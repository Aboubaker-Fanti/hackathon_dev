/**
 * Self-Check Module Steps & Configuration
 * Interactive, guided breast self-examination flow.
 *
 * Each step contains:
 * - Visual instructions with media placeholders (image/GIF/video)
 * - A conversation script ID (linking to selfCheckConversations.ts)
 *
 * Steps: Visual Examination -> Palpation -> Nipple Check
 *
 * Risk assessment now uses the chat-collected answers
 * from the conversation engine (see assessSelfCheckFromChat).
 *
 * NOTE: `icon` fields use Ionicons names (e.g. 'eye-outline').
 * Render with <Ionicons name={icon} /> from @expo/vector-icons.
 */

import {
  STEP_CONVERSATIONS,
  getAllQuestionNodes,
} from './selfCheckConversations';

// ── Instruction Types ──────────────────────────────────────

export interface SelfCheckInstruction {
  id: string;
  textKey: string;
  mediaType: 'image' | 'gif' | 'video';
  mediaPlaceholder: string;
  /** Ionicons name (e.g. 'scan-outline') */
  icon: string;
  /** Secondary decorative Ionicons name */
  decorIcon?: string;
}

export interface SelfCheckStep {
  id: string;
  titleKey: string;
  descriptionKey: string;
  /** Ionicons name (e.g. 'eye-outline') */
  icon: string;
  accentColor: string;
  instructions: SelfCheckInstruction[];
}

// ── Step Definitions ───────────────────────────────────────

export const SELF_CHECK_STEPS: SelfCheckStep[] = [
  {
    id: 'visual_examination',
    titleKey: 'selfCheck.steps.visual.title',
    descriptionKey: 'selfCheck.steps.visual.description',
    icon: 'eye-outline',
    accentColor: '#FF6B9D',
    instructions: [
      {
        id: 'visual_mirror',
        textKey: 'selfCheck.steps.visual.instructions.mirror',
        mediaType: 'image',
        mediaPlaceholder: 'visual_step_mirror',
        icon: 'scan-outline',
        decorIcon: 'eye-outline',
      },
      {
        id: 'visual_arms_sides',
        textKey: 'selfCheck.steps.visual.instructions.armsSides',
        mediaType: 'image',
        mediaPlaceholder: 'visual_step_arms_sides',
        icon: 'body-outline',
        decorIcon: 'arrow-down-outline',
      },
      {
        id: 'visual_hands_hips',
        textKey: 'selfCheck.steps.visual.instructions.handsHips',
        mediaType: 'image',
        mediaPlaceholder: 'visual_step_hands_hips',
        icon: 'hand-right-outline',
        decorIcon: 'resize-outline',
      },
      {
        id: 'visual_arms_raised',
        textKey: 'selfCheck.steps.visual.instructions.armsRaised',
        mediaType: 'image',
        mediaPlaceholder: 'visual_step_arms_raised',
        icon: 'accessibility-outline',
        decorIcon: 'arrow-up-outline',
      },
    ],
  },
  {
    id: 'palpation',
    titleKey: 'selfCheck.steps.palpation.title',
    descriptionKey: 'selfCheck.steps.palpation.description',
    icon: 'hand-left-outline',
    accentColor: '#9B59B6',
    instructions: [
      {
        id: 'palpation_finger_pads',
        textKey: 'selfCheck.steps.palpation.instructions.fingerPads',
        mediaType: 'image',
        mediaPlaceholder: 'palpation_step_finger_pads',
        icon: 'finger-print-outline',
        decorIcon: 'hand-left-outline',
      },
      {
        id: 'palpation_circular_motion',
        textKey: 'selfCheck.steps.palpation.instructions.circularMotion',
        mediaType: 'image',
        mediaPlaceholder: 'palpation_step_circular_motion',
        icon: 'sync-outline',
        decorIcon: 'radio-button-on-outline',
      },
      {
        id: 'palpation_armpit',
        textKey: 'selfCheck.steps.palpation.instructions.armpit',
        mediaType: 'image',
        mediaPlaceholder: 'palpation_step_armpit',
        icon: 'fitness-outline',
        decorIcon: 'locate-outline',
      },
      {
        id: 'palpation_standing',
        textKey: 'selfCheck.steps.palpation.instructions.standing',
        mediaType: 'image',
        mediaPlaceholder: 'palpation_step_standing',
        icon: 'body-outline',
        decorIcon: 'hand-right-outline',
      },
      {
        id: 'palpation_lying',
        textKey: 'selfCheck.steps.palpation.instructions.lying',
        mediaType: 'image',
        mediaPlaceholder: 'palpation_step_lying',
        icon: 'bed-outline',
        decorIcon: 'hand-left-outline',
      },
      {
        id: 'palpation_repeat',
        textKey: 'selfCheck.steps.palpation.instructions.repeat',
        mediaType: 'image',
        mediaPlaceholder: 'palpation_step_repeat',
        icon: 'repeat-outline',
        decorIcon: 'swap-horizontal-outline',
      },
    ],
  },
  {
    id: 'nipple_check',
    titleKey: 'selfCheck.steps.nipple.title',
    descriptionKey: 'selfCheck.steps.nipple.description',
    icon: 'search-outline',
    accentColor: '#3498DB',
    instructions: [
      {
        id: 'nipple_squeeze',
        textKey: 'selfCheck.steps.nipple.instructions.squeeze',
        mediaType: 'image',
        mediaPlaceholder: 'nipple_step_squeeze',
        icon: 'ellipse-outline',
        decorIcon: 'contract-outline',
      },
      {
        id: 'nipple_observe',
        textKey: 'selfCheck.steps.nipple.instructions.observe',
        mediaType: 'image',
        mediaPlaceholder: 'nipple_step_observe',
        icon: 'eye-outline',
        decorIcon: 'search-outline',
      },
    ],
  },
];

// ── Risk Assessment (from chat answers) ────────────────────

export type SelfCheckRiskLevel = 'low' | 'moderate' | 'high';

export interface SelfCheckResult {
  riskLevel: SelfCheckRiskLevel;
  score: number;
  maxScore: number;
  concerns: string[];
  recommendationKey: string;
  messageKey: string;
}

/**
 * Assess risk from the chat-collected answers.
 * Iterates all question nodes from all step conversations
 * and scores based on concern flags and weights.
 */
export const assessSelfCheckFromChat = (
  answers: Record<string, string>,
): SelfCheckResult => {
  let score = 0;
  const concerns: string[] = [];
  let maxScore = 0;

  for (const stepId of Object.keys(STEP_CONVERSATIONS)) {
    const script = STEP_CONVERSATIONS[stepId];
    const questionNodes = getAllQuestionNodes(script);

    for (const q of questionNodes) {
      maxScore += q.weight;
      const answer = answers[q.id];
      if (!answer) continue;

      // Check if the selected option is a concern
      const selectedOption = q.options.find((o) => o.value === answer);
      if (selectedOption?.isConcern) {
        score += q.weight;
        concerns.push(q.id);
      }
    }
  }

  let riskLevel: SelfCheckRiskLevel;
  let recommendationKey: string;
  let messageKey: string;

  if (score >= 5 || concerns.length >= 3) {
    riskLevel = 'high';
    recommendationKey = 'selfCheck.result.recommendation.urgent';
    messageKey = 'selfCheck.result.message.high';
  } else if (score >= 2 || concerns.length >= 1) {
    riskLevel = 'moderate';
    recommendationKey = 'selfCheck.result.recommendation.checkup';
    messageKey = 'selfCheck.result.message.moderate';
  } else {
    riskLevel = 'low';
    recommendationKey = 'selfCheck.result.recommendation.monitoring';
    messageKey = 'selfCheck.result.message.low';
  }

  return {
    riskLevel,
    score,
    maxScore,
    concerns,
    recommendationKey,
    messageKey,
  };
};
