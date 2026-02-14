/**
 * Education Content - 7 Knowledge Sections for breast health awareness
 * All content in 3 languages: French, Arabic, Darija
 * Reviewed for medical accuracy (content is educational, not diagnostic)
 *
 * Sections:
 * 1. What Is Breast Cancer
 * 2. Early Detection & Screening
 * 3. Early Signs & When to Consult
 * 4. Treatment & Prognosis (Early vs Late)
 * 5. Real Stories / Case Studies
 * 6. Myths & Wrong Beliefs
 * 7. FAQ
 */

export interface Article {
  id: string;
  category: string;
  icon: string;
  readTimeMinutes: number;
  titleKey: string;
  summaryKey: string;
  contentSections: {
    headingKey: string;
    bodyKey: string;
  }[];
}

export const EDUCATION_ARTICLES: Article[] = [
  // 1. WHAT IS BREAST CANCER
  {
    id: 'what_is_breast_cancer',
    category: 'whatIs',
    icon: '🎗️',
    readTimeMinutes: 5,
    titleKey: 'articles.what_is_breast_cancer.title',
    summaryKey: 'articles.what_is_breast_cancer.summary',
    contentSections: [
      { headingKey: 'articles.what_is_breast_cancer.s1_heading', bodyKey: 'articles.what_is_breast_cancer.s1_body' },
      { headingKey: 'articles.what_is_breast_cancer.s2_heading', bodyKey: 'articles.what_is_breast_cancer.s2_body' },
      { headingKey: 'articles.what_is_breast_cancer.s3_heading', bodyKey: 'articles.what_is_breast_cancer.s3_body' },
    ],
  },
  // 2. EARLY DETECTION & SCREENING
  {
    id: 'early_detection',
    category: 'detection',
    icon: '🔍',
    readTimeMinutes: 7,
    titleKey: 'articles.early_detection.title',
    summaryKey: 'articles.early_detection.summary',
    contentSections: [
      { headingKey: 'articles.early_detection.s1_heading', bodyKey: 'articles.early_detection.s1_body' },
      { headingKey: 'articles.early_detection.s2_heading', bodyKey: 'articles.early_detection.s2_body' },
      { headingKey: 'articles.early_detection.s3_heading', bodyKey: 'articles.early_detection.s3_body' },
      { headingKey: 'articles.early_detection.s4_heading', bodyKey: 'articles.early_detection.s4_body' },
    ],
  },
  // 3. EARLY SIGNS & WHEN TO CONSULT
  {
    id: 'early_signs',
    category: 'signs',
    icon: '⚠️',
    readTimeMinutes: 5,
    titleKey: 'articles.early_signs.title',
    summaryKey: 'articles.early_signs.summary',
    contentSections: [
      { headingKey: 'articles.early_signs.s1_heading', bodyKey: 'articles.early_signs.s1_body' },
      { headingKey: 'articles.early_signs.s2_heading', bodyKey: 'articles.early_signs.s2_body' },
    ],
  },
  // 4. TREATMENT & PROGNOSIS (EARLY VS LATE)
  {
    id: 'treatment_prognosis',
    category: 'treatment',
    icon: '💊',
    readTimeMinutes: 6,
    titleKey: 'articles.treatment_prognosis.title',
    summaryKey: 'articles.treatment_prognosis.summary',
    contentSections: [
      { headingKey: 'articles.treatment_prognosis.s1_heading', bodyKey: 'articles.treatment_prognosis.s1_body' },
      { headingKey: 'articles.treatment_prognosis.s2_heading', bodyKey: 'articles.treatment_prognosis.s2_body' },
      { headingKey: 'articles.treatment_prognosis.s3_heading', bodyKey: 'articles.treatment_prognosis.s3_body' },
    ],
  },
  // 5. REAL STORIES / CASE STUDIES
  {
    id: 'real_stories',
    category: 'stories',
    icon: '💬',
    readTimeMinutes: 5,
    titleKey: 'articles.real_stories.title',
    summaryKey: 'articles.real_stories.summary',
    contentSections: [
      { headingKey: 'articles.real_stories.s1_heading', bodyKey: 'articles.real_stories.s1_body' },
      { headingKey: 'articles.real_stories.s2_heading', bodyKey: 'articles.real_stories.s2_body' },
      { headingKey: 'articles.real_stories.s3_heading', bodyKey: 'articles.real_stories.s3_body' },
    ],
  },
  // 6. MYTHS & WRONG BELIEFS
  {
    id: 'myths_beliefs',
    category: 'myths',
    icon: '🚫',
    readTimeMinutes: 6,
    titleKey: 'articles.myths_beliefs.title',
    summaryKey: 'articles.myths_beliefs.summary',
    contentSections: [
      { headingKey: 'articles.myths_beliefs.s1_heading', bodyKey: 'articles.myths_beliefs.s1_body' },
      { headingKey: 'articles.myths_beliefs.s2_heading', bodyKey: 'articles.myths_beliefs.s2_body' },
      { headingKey: 'articles.myths_beliefs.s3_heading', bodyKey: 'articles.myths_beliefs.s3_body' },
    ],
  },
  // 7. FAQ
  {
    id: 'faq',
    category: 'faq',
    icon: '❓',
    readTimeMinutes: 5,
    titleKey: 'articles.faq.title',
    summaryKey: 'articles.faq.summary',
    contentSections: [
      { headingKey: 'articles.faq.s1_heading', bodyKey: 'articles.faq.s1_body' },
      { headingKey: 'articles.faq.s2_heading', bodyKey: 'articles.faq.s2_body' },
      { headingKey: 'articles.faq.s3_heading', bodyKey: 'articles.faq.s3_body' },
    ],
  },
];

export const getArticlesByCategory = (category: string): Article[] => {
  return EDUCATION_ARTICLES.filter((a) => a.category === category);
};

export const getArticleById = (id: string): Article | undefined => {
  return EDUCATION_ARTICLES.find((a) => a.id === id);
};
