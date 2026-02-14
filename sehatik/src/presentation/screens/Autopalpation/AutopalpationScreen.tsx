/**
 * Autopalpation Screen — Premium 2026 Exam Flow
 * Multi-step guided breast self-examination with modern card-based UI.
 * Glassmorphism, warm gradients, fluid interactions, generous whitespace.
 */

import React, { useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
  Animated,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MedicalDisclaimer } from '../../components/common/MedicalDisclaimer';
import { useLanguageStore } from '../../../application/store/languageStore';
import { useExamStore } from '../../../application/store/examStore';
import { EXAM_SECTIONS, shouldShowQuestion } from '../../../infrastructure/data/examQuestions';
import { getRiskColor, getRiskIcon } from '../../../domain/services/riskAssessment';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, MIN_TOUCH_TARGET } from '../../theme/spacing';
import { fontSizes, fontWeights } from '../../theme/typography';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

/* ------------------------------------------------------------------ */
/*  Shadows                                                            */
/* ------------------------------------------------------------------ */

const SHADOW_XS = Platform.select({
  ios: { shadowColor: 'rgba(0,0,0,0.04)', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 1, shadowRadius: 4 },
  android: { elevation: 1 },
}) as any;

const SHADOW_SM = Platform.select({
  ios: { shadowColor: 'rgba(0,0,0,0.06)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 10 },
  android: { elevation: 2 },
}) as any;

const SHADOW_MD = Platform.select({
  ios: { shadowColor: 'rgba(0,0,0,0.08)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 16 },
  android: { elevation: 4 },
}) as any;

const SHADOW_CTA = Platform.select({
  ios: { shadowColor: '#E8467A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 16 },
  android: { elevation: 6 },
}) as any;

const CARD_RADIUS = 22;

/* ------------------------------------------------------------------ */
/*  Animated Helpers                                                    */
/* ------------------------------------------------------------------ */

const FadeIn: React.FC<{ delay?: number; children: React.ReactNode }> = ({ delay = 0, children }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return <Animated.View style={{ opacity, transform: [{ translateY }] }}>{children}</Animated.View>;
};

const AnimPress: React.FC<{ children: React.ReactNode; onPress?: () => void; style?: any; disabled?: boolean }> = ({
  children, onPress, style, disabled,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 4 }).start()}
      onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start()}
    >
      <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>{children}</Animated.View>
    </Pressable>
  );
};

/* ------------------------------------------------------------------ */
/*  Progress Bar                                                       */
/* ------------------------------------------------------------------ */

const ProgressBar: React.FC<{ percentage: number; current: number; total: number }> = ({ percentage, current, total }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(widthAnim, { toValue: percentage, duration: 400, useNativeDriver: false }).start();
  }, [percentage]);
  const animWidth = widthAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'], extrapolate: 'clamp' });

  return (
    <View style={st.progressRow}>
      <View style={st.progressTrack}>
        <Animated.View style={[st.progressFill, { width: animWidth }]}>
          <LinearGradient colors={['#E8467A', '#F48FB1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
        </Animated.View>
      </View>
      <View style={st.progressPill}>
        <Text style={st.progressPillText}>{current}/{total}</Text>
      </View>
    </View>
  );
};

/* ------------------------------------------------------------------ */
/*  Section Icons (mapping emoji to Ionicons)                          */
/* ------------------------------------------------------------------ */

const SECTION_ICONS: Record<string, { icon: IoniconsName; color: string }> = {
  visual: { icon: 'eye-outline', color: '#8B5CF6' },
  palpation: { icon: 'hand-left-outline', color: '#E8467A' },
  additional: { icon: 'document-text-outline', color: '#3B82F6' },
};

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export const AutopalpationScreen: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();
  const {
    isExamActive, currentSectionIndex, currentQuestionIndex,
    answers, examResult, startExam, answerQuestion,
    nextQuestion, previousQuestion, completeExam, resetExam,
    getProgress, lastExamDate,
  } = useExamStore();

  /* ================================================================ */
  /*  INTRO SCREEN                                                     */
  /* ================================================================ */
  if (!isExamActive && !examResult) {
    return (
      <View style={st.root}>
        <LinearGradient
          colors={['#FFF5F8', '#FEF0F4', '#F8F9FC', '#F5F6FA']}
          locations={[0, 0.2, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={st.flex} edges={['top']}>
          <ScrollView contentContainerStyle={st.introScroll} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <FadeIn>
              <View style={st.introHeader}>
                <LinearGradient
                  colors={['#E8467A', '#F06292', '#F8A4C0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={st.introHeaderGrad}
                >
                  <View style={st.introBlob1} />
                  <View style={st.introBlob2} />
                  <Text style={[st.introTitle, isRTL && st.textRTL]}>{t('autopalpation.title')}</Text>
                  <Text style={[st.introSub, isRTL && st.textRTL]}>{t('autopalpation.subtitle')}</Text>
                </LinearGradient>
              </View>
            </FadeIn>

            <View style={st.introBody}>
              <FadeIn delay={60}>
                <MedicalDisclaimer type="assessment" />
              </FadeIn>

              {/* Last exam info */}
              {lastExamDate && (
                <FadeIn delay={100}>
                  <View style={st.lastExamCard}>
                    <View style={st.lastExamIconBg}>
                      <Ionicons name="calendar-outline" size={18} color="#E8467A" />
                    </View>
                    <Text style={[st.lastExamText, isRTL && st.textRTL]}>
                      {t('home.lastExam')}: {t('home.daysAgo', {
                        count: Math.floor((Date.now() - lastExamDate) / (1000 * 60 * 60 * 24)),
                      })}
                    </Text>
                  </View>
                </FadeIn>
              )}

              {/* Steps overview */}
              <FadeIn delay={140}>
                <Text style={[st.sectionLabel, isRTL && st.textRTL]}>
                  {t('home.quickActions', 'Étapes')}
                </Text>
              </FadeIn>
              {EXAM_SECTIONS.map((section, index) => {
                const sectionMeta = SECTION_ICONS[section.id] || { icon: 'ellipsis-horizontal' as IoniconsName, color: '#64748B' };
                return (
                  <FadeIn key={section.id} delay={180 + index * 60}>
                    <View style={[st.stepCard, isRTL && st.stepCardRTL]}>
                      <LinearGradient
                        colors={[sectionMeta.color, sectionMeta.color + 'CC']}
                        style={st.stepBadge}
                      >
                        <Text style={st.stepBadgeText}>{index + 1}</Text>
                      </LinearGradient>
                      <View style={st.stepContent}>
                        <Text style={[st.stepTitle, isRTL && st.textRTL]}>{t(section.titleKey)}</Text>
                        <Text style={[st.stepDesc, isRTL && st.textRTL]}>{t(section.descriptionKey)}</Text>
                      </View>
                      <View style={[st.stepIconBg, { backgroundColor: sectionMeta.color + '10' }]}>
                        <Ionicons name={sectionMeta.icon} size={20} color={sectionMeta.color} />
                      </View>
                    </View>
                  </FadeIn>
                );
              })}

              <FadeIn delay={360}>
                <AnimPress onPress={startExam} style={st.ctaOuter}>
                  <LinearGradient colors={['#E8467A', '#D63A6B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={st.ctaGrad}>
                    <Text style={st.ctaText}>{t('autopalpation.start')}</Text>
                    <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={20} color="#FFF" />
                  </LinearGradient>
                </AnimPress>
              </FadeIn>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  /* ================================================================ */
  /*  RESULTS SCREEN                                                   */
  /* ================================================================ */
  if (examResult && !isExamActive) {
    const riskColor = examResult.riskLevel === 'low' ? '#10B981' : examResult.riskLevel === 'moderate' ? '#F59E0B' : '#EF4444';
    const riskBgLight = examResult.riskLevel === 'low' ? '#ECFDF5' : examResult.riskLevel === 'moderate' ? '#FFFBEB' : '#FEF2F2';
    const riskIconName: IoniconsName = examResult.riskLevel === 'low' ? 'checkmark-circle' : examResult.riskLevel === 'moderate' ? 'alert-circle' : 'warning';

    return (
      <View style={st.root}>
        <LinearGradient colors={['#FFF5F8', '#FEF0F4', '#F8F9FC', '#F5F6FA']} locations={[0, 0.2, 0.5, 1]} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={st.flex} edges={['top']}>
          <ScrollView contentContainerStyle={st.resultScroll} showsVerticalScrollIndicator={false}>
            <FadeIn>
              <Text style={[st.resultTitle, isRTL && st.textRTL]}>{t('results.title')}</Text>
            </FadeIn>

            {/* Risk card */}
            <FadeIn delay={80}>
              <View style={[st.riskCard, { borderColor: riskColor + '30' }]}>
                <LinearGradient colors={[riskBgLight, '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={st.riskInner}>
                  <View style={[st.riskIconCircle, { backgroundColor: riskColor + '15' }]}>
                    <Ionicons name={riskIconName} size={34} color={riskColor} />
                  </View>
                  <Text style={[st.riskLevel, { color: riskColor }]}>{t(examResult.recommendationKey)}</Text>
                  <Text style={[st.riskMsg, isRTL && st.textRTL]}>{t(examResult.messageKey)}</Text>
                </LinearGradient>
              </View>
            </FadeIn>

            {/* Red flags */}
            {examResult.redFlags.length > 0 && (
              <FadeIn delay={160}>
                <View style={st.flagsSection}>
                  <Text style={[st.sectionLabel, isRTL && st.textRTL]}>{t('results.red_flags')}</Text>
                  {examResult.redFlags.map((flag) => (
                    <View key={flag} style={[st.flagItem, isRTL && st.flagItemRTL]}>
                      <View style={st.flagIconBg}>
                        <Ionicons name="alert-circle" size={14} color="#F59E0B" />
                      </View>
                      <Text style={[st.flagText, isRTL && st.textRTL]}>{t(`exam.questions.${flag}.title`)}</Text>
                    </View>
                  ))}
                </View>
              </FadeIn>
            )}

            {/* Next steps */}
            <FadeIn delay={240}>
              <View style={st.stepsSection}>
                <Text style={[st.sectionLabel, isRTL && st.textRTL]}>{t('results.next_steps')}</Text>
                {examResult.nextStepsKeys.map((stepKey, index) => (
                  <View key={index} style={[st.nextStep, isRTL && st.nextStepRTL]}>
                    <LinearGradient colors={[riskColor, riskColor + 'CC']} style={st.nextStepNum}>
                      <Text style={st.nextStepNumText}>{index + 1}</Text>
                    </LinearGradient>
                    <Text style={[st.nextStepText, isRTL && st.textRTL]}>{t(stepKey)}</Text>
                  </View>
                ))}
              </View>
            </FadeIn>

            <FadeIn delay={320}>
              <MedicalDisclaimer />
            </FadeIn>

            <FadeIn delay={380}>
              <AnimPress onPress={() => resetExam()} style={st.ctaOuter}>
                <LinearGradient colors={['#E8467A', '#D63A6B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={st.ctaGrad}>
                  <Ionicons name="refresh-outline" size={20} color="#FFF" />
                  <Text style={st.ctaText}>{t('results.new_exam')}</Text>
                </LinearGradient>
              </AnimPress>
            </FadeIn>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  /* ================================================================ */
  /*  ACTIVE EXAM — QUESTION FLOW                                      */
  /* ================================================================ */
  const section = EXAM_SECTIONS[currentSectionIndex];
  const question = section.questions[currentQuestionIndex];
  const progress = getProgress();

  if (!shouldShowQuestion(question, answers)) {
    const hasMore = nextQuestion();
    if (!hasMore) completeExam();
    return null;
  }

  const sectionMeta = SECTION_ICONS[section.id] || { icon: 'ellipsis-horizontal' as IoniconsName, color: '#64748B' };

  const handleAnswer = (answer: unknown) => answerQuestion(question.id, answer);

  const handleNext = () => {
    if (answers[question.id] === undefined) return;
    const hasMore = nextQuestion();
    if (!hasMore) completeExam();
  };

  return (
    <View style={st.root}>
      <LinearGradient
        colors={['#FFF5F8', '#F8F9FC', '#F5F6FA']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={st.flex} edges={['top']}>
        {/* Progress bar */}
        <ProgressBar percentage={progress.percentage} current={progress.current} total={progress.total} />

        {/* Section indicator */}
        <View style={[st.sectionIndicator, isRTL && st.rowRTL]}>
          <LinearGradient colors={[sectionMeta.color, sectionMeta.color + 'CC']} style={st.sectionBadge}>
            <Ionicons name={sectionMeta.icon} size={16} color="#FFF" />
          </LinearGradient>
          <Text style={[st.sectionName, isRTL && st.textRTL]}>{t(section.titleKey)}</Text>
        </View>

        <ScrollView contentContainerStyle={st.questionScroll} showsVerticalScrollIndicator={false}>
          {/* Instruction (first question of section) */}
          {currentQuestionIndex === 0 && (
            <View style={[st.instructionCard, { borderLeftColor: sectionMeta.color }]}>
              <Text style={[st.instructionText, isRTL && st.textRTL]}>
                {t(`exam.instructions.${section.id}`)}
              </Text>
            </View>
          )}

          {/* Question */}
          <Text style={[st.questionTitle, isRTL && st.textRTL]}>{t(question.titleKey)}</Text>
          <Text style={[st.questionDesc, isRTL && st.textRTL]}>{t(question.descriptionKey)}</Text>

          {/* Boolean */}
          {question.type === 'boolean' && (
            <View style={st.boolRow}>
              {[true, false].map((val) => {
                const selected = answers[question.id] === val;
                const isWarning = selected && val && question.redFlag;
                return (
                  <AnimPress
                    key={val ? 'yes' : 'no'}
                    onPress={() => handleAnswer(val)}
                    style={[
                      st.boolCard,
                      selected && st.boolCardSelected,
                      isWarning && st.boolCardWarning,
                    ]}
                  >
                    <View style={[st.boolIconBg, selected ? { backgroundColor: isWarning ? '#FEF2F2' : '#FDE8EF' } : {}]}>
                      <Ionicons
                        name={val ? 'checkmark-circle' : 'close-circle'}
                        size={24}
                        color={selected ? (isWarning ? '#EF4444' : '#E8467A') : '#94A3B8'}
                      />
                    </View>
                    <Text style={[st.boolText, selected && st.boolTextSelected, isWarning && st.boolTextWarning]}>
                      {val ? t('exam.answer.yes') : t('exam.answer.no')}
                    </Text>
                  </AnimPress>
                );
              })}
            </View>
          )}

          {/* Multi-select */}
          {question.type === 'multi_select' && question.options && (
            <View style={st.multiWrap}>
              {question.options.map((option) => {
                const selected = Array.isArray(answers[question.id]) &&
                  (answers[question.id] as string[]).includes(option.value);
                return (
                  <AnimPress
                    key={option.value}
                    style={[st.multiOption, selected && st.multiOptionSelected]}
                    onPress={() => {
                      const current = (answers[question.id] as string[]) || [];
                      const updated = selected
                        ? current.filter((v) => v !== option.value)
                        : [...current, option.value];
                      handleAnswer(updated);
                    }}
                  >
                    <View style={[st.checkbox, selected && st.checkboxSelected]}>
                      {selected && <Ionicons name="checkmark" size={14} color="#FFF" />}
                    </View>
                    <Text style={[st.multiOptionText, isRTL && st.textRTL]}>{t(option.labelKey)}</Text>
                  </AnimPress>
                );
              })}
            </View>
          )}

          {/* Quadrant */}
          {question.type === 'quadrant' && question.options && (
            <View style={st.quadWrap}>
              {question.options.map((option) => {
                const selected = answers[question.id] === option.value;
                return (
                  <AnimPress
                    key={option.value}
                    style={[st.quadOption, selected && st.quadOptionSelected]}
                    onPress={() => handleAnswer(option.value)}
                  >
                    <View style={[st.quadDot, selected && st.quadDotSelected]} />
                    <Text style={[st.quadText, selected && st.quadTextSelected, isRTL && st.textRTL]}>
                      {t(option.labelKey)}
                    </Text>
                    {selected && (
                      <Ionicons name="checkmark-circle" size={20} color="#E8467A" style={{ marginLeft: 'auto' }} />
                    )}
                  </AnimPress>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Navigation buttons */}
        <View style={[st.navBar, isRTL && st.navBarRTL]}>
          <Pressable
            style={st.navBack}
            onPress={previousQuestion}
            disabled={progress.current <= 1}
          >
            <Ionicons
              name={isRTL ? 'chevron-forward' : 'chevron-back'}
              size={18}
              color={progress.current <= 1 ? '#CBD5E1' : '#64748B'}
            />
            <Text style={[st.navBackText, progress.current <= 1 && st.navDisabled]}>
              {t('common.previous')}
            </Text>
          </Pressable>
          <AnimPress
            style={[st.navNext, answers[question.id] === undefined && st.navNextDisabled]}
            onPress={handleNext}
            disabled={answers[question.id] === undefined}
          >
            <Text style={st.navNextText}>
              {progress.current >= progress.total ? t('common.done') : t('common.next')}
            </Text>
            <Ionicons
              name={isRTL ? 'chevron-back' : 'chevron-forward'}
              size={18}
              color="#FFF"
            />
          </AnimPress>
        </View>
      </SafeAreaView>
    </View>
  );
};

/* ================================================================== */
/*  Styles                                                             */
/* ================================================================== */

const st = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  textRTL: { textAlign: 'right', writingDirection: 'rtl' },
  rowRTL: { flexDirection: 'row-reverse' },

  /* Progress */
  progressRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, gap: 8 },
  progressTrack: { flex: 1, height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3, overflow: 'hidden' },
  progressPill: { backgroundColor: '#FDE8EF', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  progressPillText: { fontSize: 12, fontWeight: '700', color: '#E8467A' },

  /* Intro */
  introScroll: { paddingBottom: 80 },
  introHeader: { ...SHADOW_MD },
  introHeaderGrad: {
    paddingHorizontal: 24, paddingTop: 28, paddingBottom: 32,
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: 'hidden',
  },
  introBlob1: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.12)', top: -20, right: -20,
  },
  introBlob2: {
    position: 'absolute', width: 70, height: 70, borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.08)', bottom: -10, left: 30,
  },
  introTitle: { fontSize: 25, fontWeight: '800', color: '#FFF', marginBottom: 6, letterSpacing: -0.5 },
  introSub: { fontSize: 14, fontWeight: '400', color: 'rgba(255,255,255,0.9)', lineHeight: 20 },
  introBody: { padding: 20 },

  lastExamCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFF', borderRadius: CARD_RADIUS, padding: 16, marginTop: 16,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)', ...SHADOW_XS,
  },
  lastExamIconBg: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#FDE8EF', justifyContent: 'center', alignItems: 'center' },
  lastExamText: { flex: 1, fontSize: 14, color: '#64748B', fontWeight: '500' },

  sectionLabel: { fontSize: 19, fontWeight: '700', color: '#0F172A', marginBottom: 14, marginTop: 20, letterSpacing: -0.3 },

  stepCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#FFF', borderRadius: CARD_RADIUS, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)', ...SHADOW_XS,
  },
  stepCardRTL: { flexDirection: 'row-reverse' },
  stepBadge: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  stepBadgeText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  stepDesc: { fontSize: 12, color: '#94A3B8', marginTop: 2, lineHeight: 17 },
  stepIconBg: { width: 40, height: 40, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },

  /* CTA */
  ctaOuter: { borderRadius: 18, overflow: 'hidden', marginTop: 24, ...SHADOW_CTA },
  ctaGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, minHeight: MIN_TOUCH_TARGET,
  },
  ctaText: { color: '#FFF', fontSize: 17, fontWeight: '700', letterSpacing: -0.2 },

  /* Section indicator */
  sectionIndicator: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingBottom: 8 },
  sectionBadge: { width: 34, height: 34, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  sectionName: { fontSize: 15, fontWeight: '600', color: '#64748B' },

  /* Question */
  questionScroll: { padding: 20, paddingBottom: 48 },
  instructionCard: {
    backgroundColor: '#FFF', borderRadius: CARD_RADIUS, padding: 18,
    marginBottom: 20, borderLeftWidth: 4, borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)', ...SHADOW_XS,
  },
  instructionText: { fontSize: 14, color: '#334155', lineHeight: 22 },
  questionTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 8, letterSpacing: -0.4 },
  questionDesc: { fontSize: 15, color: '#64748B', lineHeight: 23, marginBottom: 24 },

  /* Boolean */
  boolRow: { flexDirection: 'row', gap: 12 },
  boolCard: {
    flex: 1, paddingVertical: 22, paddingHorizontal: 16, borderRadius: CARD_RADIUS,
    borderWidth: 1.5, borderColor: '#E2E8F0', alignItems: 'center', backgroundColor: '#FFF',
    minHeight: 90, justifyContent: 'center', gap: 8, ...SHADOW_XS,
  },
  boolCardSelected: { borderColor: '#E8467A', backgroundColor: '#FFFBFC' },
  boolCardWarning: { borderColor: '#EF4444', backgroundColor: '#FFFBFB' },
  boolIconBg: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  boolText: { fontSize: 16, fontWeight: '600', color: '#64748B' },
  boolTextSelected: { color: '#E8467A' },
  boolTextWarning: { color: '#EF4444' },

  /* Multi-select */
  multiWrap: { gap: 10 },
  multiOption: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 16, borderRadius: CARD_RADIUS, borderWidth: 1.5, borderColor: '#E2E8F0',
    backgroundColor: '#FFF', minHeight: MIN_TOUCH_TARGET, ...SHADOW_XS,
  },
  multiOptionSelected: { borderColor: '#E8467A', backgroundColor: '#FFFBFC' },
  checkbox: {
    width: 24, height: 24, borderRadius: 8, borderWidth: 2, borderColor: '#CBD5E1',
    justifyContent: 'center', alignItems: 'center',
  },
  checkboxSelected: { backgroundColor: '#E8467A', borderColor: '#E8467A' },
  multiOptionText: { flex: 1, fontSize: 15, color: '#334155', fontWeight: '500' },

  /* Quadrant */
  quadWrap: { gap: 10 },
  quadOption: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 16, borderRadius: CARD_RADIUS, borderWidth: 1.5, borderColor: '#E2E8F0',
    backgroundColor: '#FFF', minHeight: MIN_TOUCH_TARGET, ...SHADOW_XS,
  },
  quadOptionSelected: { borderColor: '#E8467A', backgroundColor: '#FFFBFC' },
  quadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#CBD5E1' },
  quadDotSelected: { backgroundColor: '#E8467A' },
  quadText: { flex: 1, fontSize: 15, fontWeight: '500', color: '#334155' },
  quadTextSelected: { color: '#E8467A' },

  /* Nav */
  navBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.92)', borderTopWidth: 1, borderTopColor: '#F1F5F9',
  },
  navBarRTL: { flexDirection: 'row-reverse' },
  navBack: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 12, paddingHorizontal: 8, minHeight: MIN_TOUCH_TARGET,
  },
  navBackText: { fontSize: 15, color: '#64748B', fontWeight: '500' },
  navDisabled: { color: '#CBD5E1' },
  navNext: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    backgroundColor: '#E8467A', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 24,
    minHeight: MIN_TOUCH_TARGET, ...SHADOW_SM,
  },
  navNextDisabled: { backgroundColor: '#CBD5E1' },
  navNextText: { color: '#FFF', fontSize: 15, fontWeight: '700' },

  /* Results */
  resultScroll: { padding: 20, paddingBottom: 80 },
  resultTitle: { fontSize: 26, fontWeight: '800', color: '#0F172A', marginBottom: 20, letterSpacing: -0.5 },
  riskCard: { borderRadius: CARD_RADIUS, borderWidth: 1.5, overflow: 'hidden', marginBottom: 20, ...SHADOW_MD },
  riskInner: { padding: 28, alignItems: 'center' },
  riskIconCircle: { width: 72, height: 72, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  riskLevel: { fontSize: 20, fontWeight: '700', marginBottom: 8, textAlign: 'center', letterSpacing: -0.3 },
  riskMsg: { fontSize: 15, color: '#334155', lineHeight: 23, textAlign: 'center' },
  flagsSection: { marginBottom: 20 },
  flagItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8, backgroundColor: '#FFF', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)', ...SHADOW_XS },
  flagItemRTL: { flexDirection: 'row-reverse' },
  flagIconBg: { width: 28, height: 28, borderRadius: 10, backgroundColor: '#FFFBEB', justifyContent: 'center', alignItems: 'center' },
  flagText: { flex: 1, fontSize: 14, color: '#334155' },
  stepsSection: { marginBottom: 20 },
  nextStep: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 14 },
  nextStepRTL: { flexDirection: 'row-reverse' },
  nextStepNum: { width: 32, height: 32, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  nextStepNumText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
  nextStepText: { flex: 1, fontSize: 14, color: '#334155', lineHeight: 22, paddingTop: 5 },
});
