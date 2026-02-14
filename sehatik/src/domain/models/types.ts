/**
 * Core Domain Types for Sehatik
 * These types represent the core business logic entities
 */

/**
 * User profile (minimal PII by design)
 */
export interface UserProfile {
  id: string;
  phoneNumber?: string; // Only stored if user opts in
  preferredLanguage: 'fr' | 'ar' | 'darija';
  ageGroup?: '25-34' | '35-44' | '45-54' | '55-65' | '65+';
  region?: string; // City-level only, never GPS
  notificationsEnabled: boolean;
  createdAt: number;
}

/**
 * Self-examination session record
 */
export interface ExamSession {
  id: string;
  date: number;
  completed: boolean;
  responses: ExamResponse[];
  riskLevel?: RiskLevel;
  synced: boolean;
}

export interface ExamResponse {
  questionId: string;
  answer: boolean | string | string[];
}

export type RiskLevel = 'continue_monitoring' | 'schedule_checkup' | 'urgent_consultation';

/**
 * Chat message (never logged to console per privacy policy)
 */
export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

/**
 * Service types offered by screening centers
 */
export type ServiceType =
  | 'mammography'
  | 'ultrasound'
  | 'biopsy'
  | 'consultation'
  | 'chemotherapy'
  | 'radiotherapy'
  | 'surgery'
  | 'support_groups'
  | 'awareness'
  | 'clinical_exam'
  | 'self_exam_training';

/**
 * Center type including mobile caravans
 */
export type CenterType = 'public' | 'private' | 'ngo' | 'caravan';

/**
 * Screening center information
 */
export interface ScreeningCenter {
  id: string;
  name: string;
  nameAr: string;
  city: string;
  cityAr: string;
  region: string;
  address: string;
  addressAr: string;
  phone: string;
  latitude: number;
  longitude: number;
  type: CenterType;
  services: ServiceType[];
  hasFreeMammography: boolean;
  /** For caravans: date range of availability */
  availableDates?: { start: string; end: string };
  /** For caravans: whether it's currently active */
  isActive?: boolean;
}

/**
 * Educational content article
 */
export interface EducationArticle {
  id: string;
  category: EducationCategory;
  title: Record<string, string>; // { fr: '...', ar: '...', darija: '...' }
  content: Record<string, string>;
  readTimeMinutes: number;
  reviewedBy?: string;
  reviewDate?: string;
  references?: string[];
}

export type EducationCategory =
  | 'basics'
  | 'symptoms'
  | 'risk_factors'
  | 'screening'
  | 'treatment'
  | 'support';

/**
 * Notification/reminder configuration
 */
export interface Reminder {
  id: string;
  type: 'monthly_exam' | 'yearly_screening' | 'follow_up';
  scheduledDate: number;
  sent: boolean;
  acknowledged: boolean;
}
