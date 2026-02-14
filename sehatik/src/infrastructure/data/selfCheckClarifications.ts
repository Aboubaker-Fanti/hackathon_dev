/**
 * Offline fallback clarification responses for self-check chat.
 * Keyed by step ID + keyword pattern.
 * Used when the LLM API is not available.
 */

interface ClarificationEntry {
  keywords: string[];
  responseKey: string;
}

/**
 * Per-step clarification lookups.
 * Keywords are matched against the lowercased user input.
 */
export const STEP_CLARIFICATIONS: Record<string, ClarificationEntry[]> = {
  visual_examination: [
    {
      keywords: ['fossette', 'dimpling', 'creux', 'indent', 'تجويف'],
      responseKey: 'selfCheck.clarify.visual.dimpling',
    },
    {
      keywords: ['peau d\'orange', 'orange', 'البرتقال', 'برتقالة'],
      responseKey: 'selfCheck.clarify.visual.peauOrange',
    },
    {
      keywords: ['rougeur', 'rouge', 'redness', 'red', 'حمرة', 'احمرار'],
      responseKey: 'selfCheck.clarify.visual.redness',
    },
    {
      keywords: ['asymétrie', 'asymmetry', 'taille', 'size', 'forme', 'shape', 'عدم تماثل'],
      responseKey: 'selfCheck.clarify.visual.asymmetry',
    },
    {
      keywords: ['mamelon', 'nipple', 'rétraction', 'retraction', 'حلمة', 'انكماش'],
      responseKey: 'selfCheck.clarify.visual.nipple',
    },
    {
      keywords: ['miroir', 'mirror', 'comment', 'how', 'كيفاش', 'مراية'],
      responseKey: 'selfCheck.clarify.visual.howToLook',
    },
  ],
  palpation: [
    {
      keywords: ['boule', 'masse', 'lump', 'كتلة', 'bosse'],
      responseKey: 'selfCheck.clarify.palpation.lump',
    },
    {
      keywords: ['douleur', 'pain', 'mal', 'وجع', 'ألم', 'tender'],
      responseKey: 'selfCheck.clarify.palpation.pain',
    },
    {
      keywords: ['pression', 'pressure', 'appuyer', 'fort', 'ضغط'],
      responseKey: 'selfCheck.clarify.palpation.pressure',
    },
    {
      keywords: ['aisselle', 'armpit', 'axilla', 'bras', 'إبط'],
      responseKey: 'selfCheck.clarify.palpation.armpit',
    },
    {
      keywords: ['circulaire', 'circular', 'mouvement', 'motion', 'حركة', 'دائرية'],
      responseKey: 'selfCheck.clarify.palpation.technique',
    },
    {
      keywords: ['allongée', 'lying', 'coussin', 'pillow', 'متمددة'],
      responseKey: 'selfCheck.clarify.palpation.lying',
    },
  ],
  nipple_check: [
    {
      keywords: ['écoulement', 'discharge', 'liquide', 'fluid', 'سائل', 'إفراز'],
      responseKey: 'selfCheck.clarify.nipple.discharge',
    },
    {
      keywords: ['sang', 'blood', 'bloody', 'دم'],
      responseKey: 'selfCheck.clarify.nipple.bloody',
    },
    {
      keywords: ['presser', 'squeeze', 'عصر', 'appuyer'],
      responseKey: 'selfCheck.clarify.nipple.howToSqueeze',
    },
    {
      keywords: ['croûte', 'crust', 'peau', 'skin', 'قشرة'],
      responseKey: 'selfCheck.clarify.nipple.crusting',
    },
  ],
};

/**
 * Generic fallback when no keyword matches.
 */
export const GENERIC_CLARIFICATION_KEY = 'selfCheck.clarify.generic';

/**
 * Find the best matching clarification for a user message.
 * Returns the i18n response key, or the generic fallback.
 */
export const findClarification = (
  stepId: string,
  userMessage: string,
): string => {
  const entries = STEP_CLARIFICATIONS[stepId] || [];
  const lower = userMessage.toLowerCase();

  for (const entry of entries) {
    if (entry.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return entry.responseKey;
    }
  }

  return GENERIC_CLARIFICATION_KEY;
};

/**
 * System prompt for the LLM clarification handler.
 * Scoped to answering "how to perform" questions, NOT diagnosis.
 */
export const buildClarificationSystemPrompt = (
  stepId: string,
  language: string,
): string => {
  const stepContext: Record<string, string> = {
    visual_examination: 'visual breast examination (looking in a mirror for skin changes, asymmetry, dimpling, redness, nipple changes)',
    palpation: 'breast palpation (using finger pads to feel for lumps, thickening, or tenderness in all breast quadrants and armpit)',
    nipple_check: 'nipple examination (checking for discharge, retraction, crusting, or color changes)',
  };

  return `You are a helpful breast health assistant embedded in a self-check feature.
The user is currently performing the "${stepContext[stepId] || stepId}" step of their self-examination.

RULES:
- ONLY answer questions about HOW to perform the self-check correctly
- ONLY explain what physical signs look like (what to look for)
- NEVER provide a diagnosis, prognosis, or treatment recommendation
- NEVER say "you have" or "this means" -- use "you may want to note" or "this is worth mentioning to your doctor"
- Always end with: "This is for awareness only -- consult a healthcare professional for any concerns."
- Respond in ${language === 'ar' ? 'Arabic (Modern Standard)' : language === 'darija' ? 'Moroccan Darija' : 'French'}
- Keep responses concise (2-4 sentences)
- Be warm, reassuring, and culturally sensitive`;
};
