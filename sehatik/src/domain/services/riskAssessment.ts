/**
 * Risk Assessment Service
 * Rule-based symptom assessment algorithm for breast health
 *
 * CRITICAL: This is EDUCATIONAL ONLY, NOT a medical diagnosis.
 * Always recommends professional consultation for any concerning findings.
 */

import { type ExamQuestion, EXAM_SECTIONS, getAllQuestions } from '../../infrastructure/data/examQuestions';

export type RiskLevel = 'low' | 'moderate' | 'high';

export interface RiskAssessmentResult {
  riskLevel: RiskLevel;
  score: number;
  maxScore: number;
  redFlags: string[];
  recommendation: 'continue_monitoring' | 'schedule_checkup' | 'urgent_consultation';
  recommendationKey: string;
  messageKey: string;
  nextStepsKeys: string[];
}

/**
 * Assess symptoms based on exam responses
 * Returns risk level, red flags, and personalized recommendations
 */
export const assessSymptoms = (
  answers: Record<string, unknown>,
): RiskAssessmentResult => {
  let score = 0;
  const redFlags: string[] = [];
  const allQuestions = getAllQuestions();

  // Calculate score based on answers
  for (const question of allQuestions) {
    const answer = answers[question.id];
    if (answer === undefined || answer === null) continue;

    if (question.type === 'boolean' && answer === true) {
      score += question.weight;

      if (question.redFlag) {
        redFlags.push(question.id);
      }
    }

    // Special handling for lump characteristics
    if (question.id === 'lump_characteristics' && Array.isArray(answer)) {
      if (answer.includes('hard')) score += 2;
      if (answer.includes('fixed')) score += 2;
      if (answer.includes('painless')) score += 1; // Painless lumps are more concerning
    }
  }

  // Calculate max possible score
  const maxScore = allQuestions.reduce((sum, q) => sum + Math.max(q.weight, 0), 0) + 5; // +5 for lump characteristics

  // Determine risk level and recommendation
  let riskLevel: RiskLevel;
  let recommendation: RiskAssessmentResult['recommendation'];
  let recommendationKey: string;
  let messageKey: string;
  let nextStepsKeys: string[];

  if (score >= 5 || redFlags.length >= 2) {
    riskLevel = 'high';
    recommendation = 'urgent_consultation';
    recommendationKey = 'results.recommendation.urgent';
    messageKey = 'results.message.high';
    nextStepsKeys = [
      'results.steps.consult_specialist',
      'results.steps.within_48h',
      'results.steps.bring_notes',
      'results.steps.dont_panic',
    ];
  } else if (score >= 2 || redFlags.length >= 1) {
    riskLevel = 'moderate';
    recommendation = 'schedule_checkup';
    recommendationKey = 'results.recommendation.checkup';
    messageKey = 'results.message.moderate';
    nextStepsKeys = [
      'results.steps.schedule_appointment',
      'results.steps.within_2weeks',
      'results.steps.continue_monitoring',
      'results.steps.note_changes',
    ];
  } else {
    riskLevel = 'low';
    recommendation = 'continue_monitoring';
    recommendationKey = 'results.recommendation.monitoring';
    messageKey = 'results.message.low';
    nextStepsKeys = [
      'results.steps.monthly_exam',
      'results.steps.annual_screening',
      'results.steps.know_normal',
      'results.steps.stay_informed',
    ];
  }

  return {
    riskLevel,
    score,
    maxScore,
    redFlags,
    recommendation,
    recommendationKey,
    messageKey,
    nextStepsKeys,
  };
};

/**
 * Get risk color based on level
 */
export const getRiskColor = (riskLevel: RiskLevel): string => {
  switch (riskLevel) {
    case 'high':
      return '#E74C3C';
    case 'moderate':
      return '#F39C12';
    case 'low':
      return '#27AE60';
  }
};

/**
 * Get risk icon based on level
 */
export const getRiskIcon = (riskLevel: RiskLevel): string => {
  switch (riskLevel) {
    case 'high':
      return '🔴';
    case 'moderate':
      return '🟡';
    case 'low':
      return '🟢';
  }
};
