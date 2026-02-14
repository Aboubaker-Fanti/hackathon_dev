/**
 * Autopalpation Screen — Premium 2026 Design Overhaul
 * * Features:
 * - Floating Card UI Architecture
 * - Soft "Calm" Gradients & Glass-like overlays
 * - Haptic-style visual feedback
 * - Fluid Layout Animations
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
  Animated,
  LayoutAnimation,
  UIManager,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// --- Internal Imports (Preserved) ---
import { MedicalDisclaimer } from '../../components/common/MedicalDisclaimer';
import { useLanguageStore } from '../../../application/store/languageStore';
import { useExamStore } from '../../../application/store/examStore';
import { EXAM_SECTIONS, shouldShowQuestion } from '../../../infrastructure/data/examQuestions';
import { getRiskColor } from '../../../domain/services/riskAssessment';

// --- Enable Layout Animation for Android ---
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

// --- Design System Constants ---
const THEME = {
  colors: {
    primary: '#FB7185', // Rose 400
    primaryDark: '#E11D48', // Rose 600
    primaryLight: '#FFF1F2', // Rose 50
    secondary: '#818CF8', // Indigo 400
    background: '#FAFAF9', // Stone 50
    card: '#FFFFFF',
    textMain: '#1C1917', // Stone 900
    textSub: '#57534E', // Stone 500
    textMuted: '#A8A29E', // Stone 400
    success: '#34D399', // Emerald 400
    warning: '#FBBF24', // Amber 400
    danger: '#F87171', // Red 400
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 20,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 12,
    md: 20,
    lg: 32,
    pill: 100,
  },
  shadows: {
    soft: {
      shadowColor: '#881337',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
      elevation: 5,
    },
    float: {
      shadowColor: '#881337',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.12,
      shadowRadius: 30,
      elevation: 8,
    },
  },
};

// --- Helper Components ---

/**
 * Modern Card Container
 * Used for encapsulating content sections
 */
const Card = ({ children, style, delay = 0 }: { children: React.ReactNode; style?: any; delay?: number }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        style,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {children}
    </Animated.View>
  );
};

/**
 * Animated Pressable Button
 * Adds a subtle scale effect on press
 */
const BouncyBtn = ({ onPress, style, children, disabled }: { onPress: () => void; style?: any; children: React.ReactNode; disabled?: boolean }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 200,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 200,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

/**
 * Modern Progress Bar
 * Sleek, thin line with a glowing leading edge
 */
const ModernProgressBar = ({ current, total }: { current: number; total: number }) => {
  const percentage = (current / total) * 100;
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: percentage,
      duration: 500,
      useNativeDriver: false, // width doesn't support native driver
    }).start();
  }, [percentage]);

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: widthAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        >
          <LinearGradient
            colors={[THEME.colors.primary, THEME.colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
      <Text style={styles.progressText}>
        {current} <Text style={{ color: THEME.colors.textMuted }}>/ {total}</Text>
      </Text>
    </View>
  );
};

// --- Main Screen Component ---

export const AutopalpationScreen: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();
  const {
    isExamActive,
    currentSectionIndex,
    currentQuestionIndex,
    answers,
    examResult,
    startExam,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    completeExam,
    resetExam,
    getProgress,
    lastExamDate,
  } = useExamStore();

  const scrollViewRef = useRef<ScrollView>(null);

  // Scroll to top on question change
  useEffect(() => {
    if (isExamActive && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  }, [currentQuestionIndex, currentSectionIndex, isExamActive]);

  const renderHeader = (title: string, subtitle?: string) => (
    <View style={styles.headerContainer}>
      <View style={styles.headerBlob} />
      <View style={styles.headerContent}>
        <Text style={[styles.headerTitle, isRTL && styles.rtlText]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.headerSubtitle, isRTL && styles.rtlText]}>{subtitle}</Text>
        )}
      </View>
    </View>
  );

  // --- 1. INTRO VIEW ---
  if (!isExamActive && !examResult) {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle="dark-content" />
        <LinearGradient
          colors={['#FFF1F2', '#FFF', '#F0F9FF']}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {renderHeader(t('autopalpation.title'), t('autopalpation.subtitle'))}

            <Card delay={100} style={styles.introCard}>
              <MedicalDisclaimer type="assessment" />

              {lastExamDate && (
                <View style={[styles.infoRow, { marginTop: 16 }]}>
                  <View style={styles.iconBox}>
                    <Ionicons name="time-outline" size={20} color={THEME.colors.primary} />
                  </View>
                  <Text style={[styles.infoText, isRTL && styles.rtlText]}>
                    {t('home.lastExam')}: {t('home.daysAgo', { count: Math.floor((Date.now() - lastExamDate) / 86400000) })}
                  </Text>
                </View>
              )}
            </Card>

            <View style={styles.stepsContainer}>
              {EXAM_SECTIONS.map((section, idx) => (
                <Card key={section.id} delay={200 + (idx * 100)} style={styles.stepItem}>
                  <View style={[styles.stepNumber, isRTL && styles.stepNumberRtl]}>
                    <Text style={styles.stepNumberText}>{idx + 1}</Text>
                  </View>
                  <View style={styles.stepTextContent}>
                    <Text style={[styles.stepTitle, isRTL && styles.rtlText]}>{t(section.titleKey)}</Text>
                    <Text style={[styles.stepDesc, isRTL && styles.rtlText]}>{t(section.descriptionKey)}</Text>
                  </View>
                </Card>
              ))}
            </View>
          </ScrollView>

          <View style={styles.bottomFloat}>
            <BouncyBtn onPress={startExam} style={styles.mainButton}>
              <LinearGradient
                colors={[THEME.colors.primary, THEME.colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBtn}
              >
                <Text style={styles.mainButtonText}>{t('autopalpation.start')}</Text>
                <Ionicons name={isRTL ? "arrow-back" : "arrow-forward"} size={24} color="#FFF" />
              </LinearGradient>
            </BouncyBtn>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // --- 2. RESULTS VIEW ---
  if (examResult && !isExamActive) {
    const isLowRisk = examResult.riskLevel === 'low';
    const resultColor = isLowRisk ? THEME.colors.success : examResult.riskLevel === 'moderate' ? THEME.colors.warning : THEME.colors.danger;

    return (
      <View style={styles.screen}>
        <StatusBar barStyle="dark-content" />
        <LinearGradient
          colors={['#FFF', '#FAFAF9']}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={[styles.headerTitle, { marginBottom: 20, paddingHorizontal: 20 }, isRTL && styles.rtlText]}>
              {t('results.title')}
            </Text>

            <Card style={[styles.resultCard, { borderTopColor: resultColor }]}>
              <View style={[styles.resultIconRing, { backgroundColor: resultColor + '20' }]}>
                <Ionicons
                  name={isLowRisk ? "shield-checkmark" : "alert-circle"}
                  size={40}
                  color={resultColor}
                />
              </View>
              <Text style={[styles.resultLevel, { color: resultColor }]}>
                {t(examResult.recommendationKey)}
              </Text>
              <Text style={[styles.resultMessage, isRTL && styles.rtlText]}>
                {t(examResult.messageKey)}
              </Text>
            </Card>

            {examResult.redFlags.length > 0 && (
              <View style={styles.sectionBlock}>
                <Text style={[styles.sectionHeader, isRTL && styles.rtlText]}>{t('results.red_flags')}</Text>
                {examResult.redFlags.map((flag, idx) => (
                  <Card key={idx} delay={100 * idx} style={styles.flagCard}>
                    <Ionicons name="warning" size={20} color={THEME.colors.danger} />
                    <Text style={[styles.flagText, isRTL && styles.rtlText]}>
                      {t(`exam.questions.${flag}.title`)}
                    </Text>
                  </Card>
                ))}
              </View>
            )}

            <View style={styles.sectionBlock}>
              <Text style={[styles.sectionHeader, isRTL && styles.rtlText]}>{t('results.next_steps')}</Text>
              {examResult.nextStepsKeys.map((stepKey, index) => (
                <View key={index} style={[styles.todoItem, isRTL && styles.rowReverse]}>
                  <View style={styles.todoCheck}>
                    <Ionicons name="checkbox" size={24} color={THEME.colors.primary} />
                  </View>
                  <Text style={[styles.todoText, isRTL && styles.rtlText]}>{t(stepKey)}</Text>
                </View>
              ))}
            </View>

            <BouncyBtn onPress={resetExam} style={[styles.outlineBtn, { marginBottom: 40 }]}>
              <Text style={styles.outlineBtnText}>{t('results.new_exam')}</Text>
            </BouncyBtn>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // --- 3. ACTIVE EXAM FLOW ---
  const section = EXAM_SECTIONS[currentSectionIndex];
  const question = section.questions[currentQuestionIndex];
  const progress = getProgress();

  if (!shouldShowQuestion(question, answers)) {
    // Logic handler: skip render if question hidden
    const hasMore = nextQuestion();
    if (!hasMore) completeExam();
    return <View style={styles.screen} />;
  }

  const handleNext = () => {
    if (answers[question.id] === undefined) return;
    const hasMore = nextQuestion();
    if (!hasMore) completeExam();
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#FFF1F2', '#FAFAF9', '#FAFAF9']}
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea}>

        {/* Top Bar */}
        <View style={[styles.navHeader, isRTL && styles.rowReverse]}>
          <Pressable
            onPress={previousQuestion}
            disabled={progress.current <= 1}
            style={({ pressed }) => ({ opacity: pressed || progress.current <= 1 ? 0.5 : 1 })}
          >
            <View style={styles.navIconBox}>
              <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={24} color={THEME.colors.textMain} />
            </View>
          </Pressable>
          <View style={styles.sectionTag}>
            <Text style={styles.sectionTagText}>{t(section.titleKey)}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ModernProgressBar current={progress.current} total={progress.total} />

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.questionScroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Question Card */}
          <Card style={styles.questionCard}>
            <Text style={[styles.questionTitle, isRTL && styles.rtlText]}>
              {t(question.titleKey)}
            </Text>
            {question.descriptionKey && (
              <Text style={[styles.questionDesc, isRTL && styles.rtlText]}>
                {t(question.descriptionKey)}
              </Text>
            )}

            {/* Instruction Context (only for first question of section) */}
            {currentQuestionIndex === 0 && (
              <View style={styles.instructionBox}>
                <Ionicons name="information-circle" size={20} color={THEME.colors.secondary} />
                <Text style={[styles.instructionText, isRTL && styles.rtlText]}>
                  {t(`exam.instructions.${section.id}`)}
                </Text>
              </View>
            )}
          </Card>

          {/* Answer Area */}
          <View style={styles.answersContainer}>

            {/* BOOLEAN TYPE */}
            {question.type === 'boolean' && (
              <View style={[styles.boolRow, isRTL && styles.rowReverse]}>
                {[true, false].map((val) => {
                  const isSelected = answers[question.id] === val;
                  return (
                    <BouncyBtn
                      key={String(val)}
                      onPress={() => answerQuestion(question.id, val)}
                      style={[
                        styles.boolOption,
                        isSelected && (val ? styles.boolSelectedYes : styles.boolSelectedNo)
                      ]}
                    >
                      <Ionicons
                        name={val ? "checkmark-circle" : "close-circle"}
                        size={32}
                        color={isSelected ? '#FFF' : (val ? THEME.colors.success : THEME.colors.textMuted)}
                      />
                      <Text style={[
                        styles.boolText,
                        isSelected && { color: '#FFF' }
                      ]}>
                        {val ? t('exam.answer.yes') : t('exam.answer.no')}
                      </Text>
                    </BouncyBtn>
                  );
                })}
              </View>
            )}

            {/* MULTI SELECT & QUADRANT */}
            {(question.type === 'multi_select' || question.type === 'quadrant') && question.options && (
              <View style={styles.listOptions}>
                {question.options.map((opt) => {
                  const currentAns = answers[question.id];
                  let isSelected = false;

                  if (question.type === 'multi_select' && Array.isArray(currentAns)) {
                    isSelected = currentAns.includes(opt.value);
                  } else {
                    isSelected = currentAns === opt.value;
                  }

                  return (
                    <BouncyBtn
                      key={opt.value}
                      style={[styles.listOptionItem, isSelected && styles.listOptionSelected, isRTL && styles.rowReverse]}
                      onPress={() => {
                        if (question.type === 'quadrant') {
                          answerQuestion(question.id, opt.value);
                        } else {
                          // Multi select logic
                          const arr = (answers[question.id] as string[]) || [];
                          const newArr = isSelected
                            ? arr.filter(v => v !== opt.value)
                            : [...arr, opt.value];
                          answerQuestion(question.id, newArr);
                        }
                      }}
                    >
                      <View style={[styles.checkboxBase, isSelected && styles.checkboxActive]}>
                        {isSelected && <Ionicons name="checkmark" size={16} color="#FFF" />}
                      </View>
                      <Text style={[
                        styles.listOptionText,
                        isSelected && styles.listOptionTextSelected,
                        isRTL && styles.rtlText
                      ]}>
                        {t(opt.labelKey)}
                      </Text>
                    </BouncyBtn>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Floating Next Button */}
        <View style={styles.bottomFloat}>
          <BouncyBtn
            onPress={handleNext}
            disabled={answers[question.id] === undefined}
            style={[
              styles.mainButton,
              answers[question.id] === undefined && styles.disabledButton
            ]}
          >
            <LinearGradient
              colors={answers[question.id] === undefined
                ? ['#E5E7EB', '#D1D5DB']
                : [THEME.colors.primary, THEME.colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBtn}
            >
              <Text style={[
                styles.mainButtonText,
                answers[question.id] === undefined && { color: '#9CA3AF' }
              ]}>
                {progress.current >= progress.total ? t('common.done') : t('common.next')}
              </Text>
              <Ionicons
                name={isRTL ? "arrow-back" : "arrow-forward"}
                size={20}
                color={answers[question.id] === undefined ? '#9CA3AF' : '#FFF'}
              />
            </LinearGradient>
          </BouncyBtn>
        </View>
      </SafeAreaView>
    </View>
  );
};

// --- STYLES ---

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: THEME.spacing.lg,
    paddingBottom: 100,
  },
  rtlText: {
    textAlign: 'right',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },

  /* HEADER */
  headerContainer: {
    marginBottom: THEME.spacing.xl,
    paddingHorizontal: THEME.spacing.md,
    marginTop: THEME.spacing.md,
  },
  headerBlob: {
    position: 'absolute',
    top: -60,
    right: -20,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: THEME.colors.primary + '15', // 15% opacity
    transform: [{ scaleX: 1.5 }],
  },
  headerContent: {
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: THEME.colors.textMain,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: THEME.colors.textSub,
    lineHeight: 24,
  },

  /* CARDS */
  card: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
    ...THEME.shadows.soft,
  },
  introCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },

  /* STEPS */
  stepsContainer: {
    gap: THEME.spacing.md,
    marginTop: THEME.spacing.lg,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.md,
    gap: THEME.spacing.md,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: THEME.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberRtl: {
    marginLeft: THEME.spacing.sm,
  },
  stepNumberText: {
    color: THEME.colors.primary,
    fontWeight: '800',
    fontSize: 16,
  },
  stepTextContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textMain,
  },
  stepDesc: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },

  /* NAVIGATION */
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
  },
  navIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...THEME.shadows.soft,
    shadowOpacity: 0.05,
  },
  sectionTag: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: THEME.colors.primaryLight,
    borderRadius: THEME.radius.pill,
  },
  sectionTagText: {
    color: THEME.colors.primaryDark,
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
  },

  /* PROGRESS */
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
    marginVertical: THEME.spacing.md,
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textMain,
    width: 40,
    textAlign: 'right',
  },

  /* QUESTION AREA */
  questionScroll: {
    padding: THEME.spacing.lg,
    paddingBottom: 120, // space for bottom float
  },
  questionCard: {
    padding: THEME.spacing.xl,
    borderRadius: 24,
  },
  questionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.colors.textMain,
    lineHeight: 30,
    marginBottom: 8,
  },
  questionDesc: {
    fontSize: 16,
    color: THEME.colors.textSub,
    lineHeight: 24,
    marginBottom: 16,
  },
  instructionBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    marginTop: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 13,
    color: THEME.colors.textSub,
    lineHeight: 20,
  },

  /* ANSWERS */
  answersContainer: {
    marginTop: THEME.spacing.md,
  },
  boolRow: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
  },
  boolOption: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    ...THEME.shadows.soft,
  },
  boolSelectedYes: {
    backgroundColor: THEME.colors.success,
    ...THEME.shadows.float,
    shadowColor: THEME.colors.success,
  },
  boolSelectedNo: {
    backgroundColor: THEME.colors.textSub, // Neutral dark for No
    ...THEME.shadows.float,
  },
  boolText: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textSub,
  },

  listOptions: {
    gap: 12,
  },
  listOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...THEME.shadows.soft,
  },
  listOptionSelected: {
    borderColor: THEME.colors.primary,
    backgroundColor: '#FFF1F2',
  },
  checkboxBase: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  checkboxActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  listOptionText: {
    fontSize: 16,
    color: THEME.colors.textMain,
    fontWeight: '500',
    flex: 1,
  },
  listOptionTextSelected: {
    color: THEME.colors.primaryDark,
    fontWeight: '700',
  },

  /* FOOTER */
  bottomFloat: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: THEME.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 0 : THEME.spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.9)',
  },
  mainButton: {
    borderRadius: 22,
    overflow: 'hidden',
    ...THEME.shadows.float,
    shadowColor: THEME.colors.primary,
  },
  disabledButton: {
    shadowOpacity: 0,
    elevation: 0,
  },
  gradientBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  mainButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },

  /* RESULTS SPECIFIC */
  resultCard: {
    alignItems: 'center',
    borderTopWidth: 6,
    paddingVertical: 40,
  },
  resultIconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultLevel: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  resultMessage: {
    fontSize: 16,
    color: THEME.colors.textSub,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '90%',
  },
  sectionBlock: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.colors.textMain,
    marginBottom: 16,
    marginLeft: 4,
  },
  flagCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    gap: 12,
    paddingVertical: 16,
  },
  flagText: {
    flex: 1,
    color: '#991B1B', // Red 800
    fontSize: 14,
    fontWeight: '600',
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 16,
  },
  todoCheck: {
    marginTop: 2,
  },
  todoText: {
    flex: 1,
    fontSize: 15,
    color: THEME.colors.textMain,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    color: THEME.colors.textSub,
    fontWeight: '500',
  },
  outlineBtn: {
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    alignItems: 'center',
  },
  outlineBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textSub,
  },
});