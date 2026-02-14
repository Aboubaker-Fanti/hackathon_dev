/**
 * Autopalpation Exam Questions
 * Structured questionnaire for guided breast self-examination
 * All text uses i18n keys - NO hardcoded strings
 */

export interface ExamQuestion {
  id: string;
  section: 'visual' | 'palpation' | 'additional';
  type: 'boolean' | 'multi_select' | 'quadrant';
  titleKey: string;
  descriptionKey: string;
  options?: { value: string; labelKey: string }[];
  dependsOn?: { questionId: string; answer: unknown };
  redFlag?: boolean;
  weight: number; // Risk weight 0-3
}

export interface ExamSection {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  questions: ExamQuestion[];
}

export const EXAM_SECTIONS: ExamSection[] = [
  {
    id: 'visual',
    titleKey: 'exam.sections.visual.title',
    descriptionKey: 'exam.sections.visual.description',
    icon: '👁️',
    questions: [
      {
        id: 'skin_changes',
        section: 'visual',
        type: 'boolean',
        titleKey: 'exam.questions.skin_changes.title',
        descriptionKey: 'exam.questions.skin_changes.description',
        weight: 2,
        redFlag: true,
      },
      {
        id: 'skin_dimpling',
        section: 'visual',
        type: 'boolean',
        titleKey: 'exam.questions.skin_dimpling.title',
        descriptionKey: 'exam.questions.skin_dimpling.description',
        weight: 3,
        redFlag: true,
      },
      {
        id: 'peau_orange',
        section: 'visual',
        type: 'boolean',
        titleKey: 'exam.questions.peau_orange.title',
        descriptionKey: 'exam.questions.peau_orange.description',
        weight: 3,
        redFlag: true,
      },
      {
        id: 'nipple_retraction',
        section: 'visual',
        type: 'boolean',
        titleKey: 'exam.questions.nipple_retraction.title',
        descriptionKey: 'exam.questions.nipple_retraction.description',
        weight: 3,
        redFlag: true,
      },
      {
        id: 'nipple_discharge',
        section: 'visual',
        type: 'boolean',
        titleKey: 'exam.questions.nipple_discharge.title',
        descriptionKey: 'exam.questions.nipple_discharge.description',
        weight: 2,
        redFlag: true,
      },
      {
        id: 'asymmetry',
        section: 'visual',
        type: 'boolean',
        titleKey: 'exam.questions.asymmetry.title',
        descriptionKey: 'exam.questions.asymmetry.description',
        weight: 1,
      },
      {
        id: 'redness',
        section: 'visual',
        type: 'boolean',
        titleKey: 'exam.questions.redness.title',
        descriptionKey: 'exam.questions.redness.description',
        weight: 2,
        redFlag: true,
      },
    ],
  },
  {
    id: 'palpation',
    titleKey: 'exam.sections.palpation.title',
    descriptionKey: 'exam.sections.palpation.description',
    icon: '🤲',
    questions: [
      {
        id: 'lump_detected',
        section: 'palpation',
        type: 'boolean',
        titleKey: 'exam.questions.lump_detected.title',
        descriptionKey: 'exam.questions.lump_detected.description',
        weight: 2,
        redFlag: true,
      },
      {
        id: 'lump_location',
        section: 'palpation',
        type: 'quadrant',
        titleKey: 'exam.questions.lump_location.title',
        descriptionKey: 'exam.questions.lump_location.description',
        dependsOn: { questionId: 'lump_detected', answer: true },
        options: [
          { value: 'upper_outer', labelKey: 'exam.quadrants.upper_outer' },
          { value: 'upper_inner', labelKey: 'exam.quadrants.upper_inner' },
          { value: 'lower_outer', labelKey: 'exam.quadrants.lower_outer' },
          { value: 'lower_inner', labelKey: 'exam.quadrants.lower_inner' },
          { value: 'central', labelKey: 'exam.quadrants.central' },
        ],
        weight: 0,
      },
      {
        id: 'lump_characteristics',
        section: 'palpation',
        type: 'multi_select',
        titleKey: 'exam.questions.lump_characteristics.title',
        descriptionKey: 'exam.questions.lump_characteristics.description',
        dependsOn: { questionId: 'lump_detected', answer: true },
        options: [
          { value: 'hard', labelKey: 'exam.lump.hard' },
          { value: 'soft', labelKey: 'exam.lump.soft' },
          { value: 'mobile', labelKey: 'exam.lump.mobile' },
          { value: 'fixed', labelKey: 'exam.lump.fixed' },
          { value: 'painful', labelKey: 'exam.lump.painful' },
          { value: 'painless', labelKey: 'exam.lump.painless' },
        ],
        weight: 0, // Weight calculated dynamically
      },
      {
        id: 'armpit_lump',
        section: 'palpation',
        type: 'boolean',
        titleKey: 'exam.questions.armpit_lump.title',
        descriptionKey: 'exam.questions.armpit_lump.description',
        weight: 2,
        redFlag: true,
      },
      {
        id: 'breast_pain',
        section: 'palpation',
        type: 'boolean',
        titleKey: 'exam.questions.breast_pain.title',
        descriptionKey: 'exam.questions.breast_pain.description',
        weight: 1,
      },
      {
        id: 'pain_cyclic',
        section: 'palpation',
        type: 'boolean',
        titleKey: 'exam.questions.pain_cyclic.title',
        descriptionKey: 'exam.questions.pain_cyclic.description',
        dependsOn: { questionId: 'breast_pain', answer: true },
        weight: -1, // Cyclic pain is usually benign
      },
    ],
  },
  {
    id: 'additional',
    titleKey: 'exam.sections.additional.title',
    descriptionKey: 'exam.sections.additional.description',
    icon: '📋',
    questions: [
      {
        id: 'changes_recent',
        section: 'additional',
        type: 'boolean',
        titleKey: 'exam.questions.changes_recent.title',
        descriptionKey: 'exam.questions.changes_recent.description',
        weight: 2,
      },
      {
        id: 'family_history',
        section: 'additional',
        type: 'boolean',
        titleKey: 'exam.questions.family_history.title',
        descriptionKey: 'exam.questions.family_history.description',
        weight: 1,
      },
      {
        id: 'previous_issues',
        section: 'additional',
        type: 'boolean',
        titleKey: 'exam.questions.previous_issues.title',
        descriptionKey: 'exam.questions.previous_issues.description',
        weight: 1,
      },
    ],
  },
];

/**
 * Get all questions flat (for iteration)
 */
export const getAllQuestions = (): ExamQuestion[] => {
  return EXAM_SECTIONS.flatMap((section) => section.questions);
};

/**
 * Check if a question should be shown based on dependencies
 */
export const shouldShowQuestion = (
  question: ExamQuestion,
  answers: Record<string, unknown>,
): boolean => {
  if (!question.dependsOn) return true;
  return answers[question.dependsOn.questionId] === question.dependsOn.answer;
};
