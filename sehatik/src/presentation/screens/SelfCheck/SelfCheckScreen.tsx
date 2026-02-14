/**
 * Self-Check Screen — Premium 2026 Redesign
 * Interactive guided breast self-examination with modern, warm UI.
 * Glassmorphism cards, fluid animations, soft gradients, generous spacing.
 *
 * Phases:
 *   1. Landing      - Last check info, step overview, "Start" CTA
 *   2. Instructions - Step-by-step instruction carousel with media
 *   3. Chat         - Conversational Q&A powered by the conversation engine
 *   4. Results      - Summary with risk level, concerns, and next steps
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MedicalDisclaimer } from '../../components/common/MedicalDisclaimer';
import { StepChat } from '../../components/selfCheck/StepChat';
import { useLanguageStore } from '../../../application/store/languageStore';
import { useSelfCheckStore } from '../../../application/store/selfCheckStore';
import { SELF_CHECK_STEPS } from '../../../infrastructure/data/selfCheckSteps';
import {
  getAllQuestionNodes,
  STEP_CONVERSATIONS,
} from '../../../infrastructure/data/selfCheckConversations';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, MIN_TOUCH_TARGET } from '../../theme/spacing';
import { fontSizes, fontWeights, typography } from '../../theme/typography';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

// ────────────────────────────────────────────────────────────
// Shadows
// ────────────────────────────────────────────────────────────

const SHADOW_XS = Platform.select({
  ios: {
    shadowColor: 'rgba(0,0,0,0.04)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  android: { elevation: 1 },
  default: {},
});

const SHADOW_SM = Platform.select({
  ios: {
    shadowColor: 'rgba(0,0,0,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  android: { elevation: 2 },
  default: {},
});

const SHADOW_MD = Platform.select({
  ios: {
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
  },
  android: { elevation: 4 },
  default: {},
});

const SHADOW_CTA = Platform.select({
  ios: {
    shadowColor: '#E8467A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  android: { elevation: 6 },
  default: {},
});

const CARD_RADIUS = 22;

// ────────────────────────────────────────────────────────────
// Image map: mediaPlaceholder → require()
// ────────────────────────────────────────────────────────────

const INSTRUCTION_IMAGES: Record<string, any> = {
  visual_step_mirror: require('../../../../assets/selfcheck/visual_mirror.png'),
  visual_step_arms_sides: require('../../../../assets/selfcheck/visual_arms_sides.png'),
  visual_step_hands_hips: require('../../../../assets/selfcheck/visual_hands_hips.png'),
  visual_step_arms_raised: require('../../../../assets/selfcheck/visual_arms_raised.png'),
  palpation_step_finger_pads: require('../../../../assets/selfcheck/palpation_finger_pads.png'),
  palpation_step_circular_motion: require('../../../../assets/selfcheck/palpation_circular_motion.png'),
  palpation_step_armpit: require('../../../../assets/selfcheck/palpation_armpit.png'),
  palpation_step_standing: require('../../../../assets/selfcheck/palpation_standing.png'),
  palpation_step_lying: require('../../../../assets/selfcheck/palpation_lying.png'),
  palpation_step_repeat: require('../../../../assets/selfcheck/palpation_repeat.png'),
  nipple_step_squeeze: require('../../../../assets/selfcheck/nipple_squeeze.png'),
  nipple_step_observe: require('../../../../assets/selfcheck/nipple_observe.png'),
};

// ────────────────────────────────────────────────────────────
// Helper sub-components
// ────────────────────────────────────────────────────────────

/** Animated progress bar with smooth gradient */
const ProgressBar: React.FC<{
  percentage: number;
  current: number;
  total: number;
}> = ({ percentage, current, total }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: percentage,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const animWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={s.progressContainer}>
      <View style={s.progressTrack}>
        <Animated.View style={[s.progressFill, { width: animWidth }]}>
          <LinearGradient
            colors={['#E8467A', '#F48FB1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
      <View style={s.progressPill}>
        <Text style={s.progressText}>
          {current}/{total}
        </Text>
      </View>
    </View>
  );
};

/** Instruction illustration — shows actual image with step badge overlay */
const InstructionVisual: React.FC<{
  icon: string;
  decorIcon?: string;
  accentColor: string;
  stepNumber: number;
  totalSteps: number;
  mediaPlaceholder?: string;
}> = ({ icon, accentColor, stepNumber, totalSteps, mediaPlaceholder }) => {
  const imageSource = mediaPlaceholder ? INSTRUCTION_IMAGES[mediaPlaceholder] : null;

  return (
    <View style={s.mediaWrapper}>
      {imageSource ? (
        <View style={s.mediaImageContainer}>
          <Image
            source={imageSource}
            style={s.mediaImage}
            resizeMode="cover"
          />
        </View>
      ) : (
        <LinearGradient
          colors={[accentColor + '12', accentColor + '05']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.mediaGradient}
        >
          <View style={[s.mediaIconOuter, { backgroundColor: accentColor + '12' }]}>
            <View style={[s.mediaIconMiddle, { backgroundColor: accentColor + '10' }]}>
              <View style={[s.mediaIconInner, { backgroundColor: '#FFFFFF' }]}>
                <Ionicons
                  name={icon as IoniconsName}
                  size={32}
                  color={accentColor}
                />
              </View>
            </View>
          </View>
          <View style={[s.mediaBadge, { backgroundColor: accentColor + '18' }]}>
            <Ionicons name="ribbon-outline" size={12} color={accentColor} />
            <Text style={[s.mediaBadgeText, { color: accentColor }]}>
              {stepNumber}/{totalSteps}
            </Text>
          </View>
        </LinearGradient>
      )}
    </View>
  );
};
/** Modern step dots */
const StepDots: React.FC<{
  total: number;
  current: number;
  accentColor: string;
}> = ({ total, current, accentColor }) => (
  <View style={s.dotsRow}>
    {Array.from({ length: total }).map((_, i) => (
      <View
        key={i}
        style={[
          s.dot,
          i === current
            ? { backgroundColor: accentColor, width: 28 }
            : { backgroundColor: '#E2E8F0' },
        ]}
      />
    ))}
  </View>
);

/** Fade-in animation wrapper */
const FadeIn: React.FC<{ delay?: number; children: React.ReactNode }> = ({
  delay = 0,
  children,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 450,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 450,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
};

/** Pressable with spring scale */
const AnimPress: React.FC<{
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  disabled?: boolean;
  activeOpacity?: number;
}> = ({ children, onPress, style, disabled }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => {
        Animated.spring(scaleAnim, {
          toValue: 0.97,
          useNativeDriver: true,
          speed: 50,
          bounciness: 4,
        }).start();
      }}
      onPressOut={() => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 50,
          bounciness: 4,
        }).start();
      }}
    >
      <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

// ────────────────────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────────────────────

export const SelfCheckScreen: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();
  const store = useSelfCheckStore();
  const { width: screenWidth } = useWindowDimensions();
  const isWide = screenWidth > 400;

  useEffect(() => {
    store.loadHistory();
  }, []);

  const {
    isActive,
    currentStepIndex,
    currentInstructionIndex,
    phase,
    result,
    lastCheckDate,
    lastResult,
  } = store;

  // ──────────────────────────────────────────────────────
  // 1. LANDING PAGE
  // ──────────────────────────────────────────────────────
  if (!isActive && !result) {
    const daysSinceCheck = lastCheckDate
      ? Math.floor(
        (Date.now() - lastCheckDate) / (1000 * 60 * 60 * 24),
      )
      : null;

    return (
      <View style={s.rootBg}>
        <LinearGradient
          colors={['#FFF5F8', '#FEF0F4', '#F8F9FC', '#F5F6FA']}
          locations={[0, 0.2, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={s.container} edges={['top']}>
          <ScrollView
            contentContainerStyle={s.landingScroll}
            showsVerticalScrollIndicator={false}
            bounces
          >
            {/* ─── Hero Header ─── */}
            <FadeIn>
              <View style={s.heroHeader}>
                <LinearGradient
                  colors={['#E8467A', '#F06292', '#F8A4C0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={s.heroHeaderGradient}
                >
                  {/* Organic blobs */}
                  <View style={s.heroBlob1} />
                  <View style={s.heroBlob2} />
                  <View style={s.heroBlob3} />

                  <View style={[s.heroHeaderRow, isRTL && s.rowReverse]}>
                    <View style={s.heroHeaderText}>
                      <Text
                        style={[s.heroHeaderTitle, isRTL && s.textRTL]}
                        numberOfLines={2}
                      >
                        {t('selfCheck.title')}
                      </Text>
                      <Text
                        style={[s.heroHeaderSub, isRTL && s.textRTL]}
                        numberOfLines={2}
                      >
                        {t('selfCheck.subtitle')}
                      </Text>
                    </View>
                    <View style={s.heroHeaderIconWrap}>
                      <View style={s.heroHeaderIconInner}>
                        <Ionicons
                          name="heart"
                          size={26}
                          color="#E8467A"
                        />
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </FadeIn>

            {/* ─── Content area ─── */}
            <View style={[s.landingContent, isWide && s.landingContentWide]}>
              {/* Last Check Card */}
              {lastCheckDate && (
                <FadeIn delay={80}>
                  <View style={s.lastCheckCard}>
                    <View style={[s.lastCheckRow, isRTL && s.rowReverse]}>
                      <View style={s.lastCheckIconBg}>
                        <Ionicons
                          name="calendar-outline"
                          size={18}
                          color="#E8467A"
                        />
                      </View>
                      <View style={s.lastCheckInfo}>
                        <Text
                          style={[s.lastCheckLabel, isRTL && s.textRTL]}
                          numberOfLines={1}
                        >
                          {t('selfCheck.lastCheck')}
                        </Text>
                        <Text
                          style={[s.lastCheckValue, isRTL && s.textRTL]}
                          numberOfLines={1}
                        >
                          {daysSinceCheck !== null
                            ? t('home.daysAgo', { count: daysSinceCheck })
                            : '—'}
                        </Text>
                      </View>
                    </View>

                    {lastResult && (
                      <View
                        style={[
                          s.lastResultBadge,
                          {
                            backgroundColor:
                              lastResult.riskLevel === 'low'
                                ? '#ECFDF5'
                                : lastResult.riskLevel === 'moderate'
                                  ? '#FFFBEB'
                                  : '#FEF2F2',
                          },
                        ]}
                      >
                        <Ionicons
                          name={
                            (lastResult.riskLevel === 'low'
                              ? 'checkmark-circle'
                              : lastResult.riskLevel === 'moderate'
                                ? 'alert-circle'
                                : 'warning') as IoniconsName
                          }
                          size={14}
                          color={
                            lastResult.riskLevel === 'low'
                              ? '#10B981'
                              : lastResult.riskLevel === 'moderate'
                                ? '#F59E0B'
                                : '#EF4444'
                          }
                        />
                        <Text
                          style={[
                            s.lastResultText,
                            {
                              color:
                                lastResult.riskLevel === 'low'
                                  ? '#065F46'
                                  : lastResult.riskLevel === 'moderate'
                                    ? '#92400E'
                                    : '#991B1B',
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {t(lastResult.recommendationKey)}
                        </Text>
                      </View>
                    )}
                  </View>
                </FadeIn>
              )}

              {/* Steps Overview */}
              <FadeIn delay={160}>
                <Text style={[s.sectionTitle, isRTL && s.textRTL]}>
                  {t('selfCheck.stepsOverview')}
                </Text>
              </FadeIn>

              {SELF_CHECK_STEPS.map((step, idx) => (
                <FadeIn key={step.id} delay={200 + idx * 60}>
                  <View style={[s.overviewCard, isRTL && s.rowReverse]}>
                    {/* Timeline connector */}
                    {idx < SELF_CHECK_STEPS.length - 1 && (
                      <View style={s.timelineConnector} />
                    )}
                    <View
                      style={[
                        s.overviewBadge,
                        { backgroundColor: step.accentColor },
                      ]}
                    >
                      <Text style={s.overviewBadgeText}>{idx + 1}</Text>
                    </View>
                    <View style={s.overviewTextWrap}>
                      <Text
                        style={[s.overviewTitle, isRTL && s.textRTL]}
                        numberOfLines={2}
                      >
                        {t(step.titleKey)}
                      </Text>
                      <Text
                        style={[s.overviewDesc, isRTL && s.textRTL]}
                        numberOfLines={3}
                      >
                        {t(step.descriptionKey)}
                      </Text>
                    </View>
                    <View
                      style={[
                        s.overviewIconBg,
                        { backgroundColor: step.accentColor + '10' },
                      ]}
                    >
                      <Ionicons
                        name={step.icon as IoniconsName}
                        size={20}
                        color={step.accentColor}
                      />
                    </View>
                  </View>
                </FadeIn>
              ))}

              <FadeIn delay={400}>
                <MedicalDisclaimer type="assessment" />
              </FadeIn>

              {/* Start Button */}
              <FadeIn delay={460}>
                <AnimPress onPress={store.startCheck} style={s.ctaOuter}>
                  <LinearGradient
                    colors={['#E8467A', '#D63A6B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={s.ctaGradient}
                  >
                    <Text style={s.ctaText}>
                      {t('selfCheck.startButton')}
                    </Text>
                    <Ionicons
                      name={isRTL ? 'arrow-back' : 'arrow-forward'}
                      size={20}
                      color="#FFFFFF"
                    />
                  </LinearGradient>
                </AnimPress>
              </FadeIn>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // ──────────────────────────────────────────────────────
  // 4. RESULTS PAGE
  // ──────────────────────────────────────────────────────
  if (result && !isActive) {
    const riskColor =
      result.riskLevel === 'high'
        ? '#EF4444'
        : result.riskLevel === 'moderate'
          ? '#F59E0B'
          : '#10B981';
    const riskBgLight =
      result.riskLevel === 'high'
        ? '#FEF2F2'
        : result.riskLevel === 'moderate'
          ? '#FFFBEB'
          : '#ECFDF5';
    const riskIconName: IoniconsName =
      result.riskLevel === 'high'
        ? 'warning'
        : result.riskLevel === 'moderate'
          ? 'alert-circle'
          : 'checkmark-circle';

    return (
      <View style={s.rootBg}>
        <LinearGradient
          colors={['#FFF5F8', '#FEF0F4', '#F8F9FC', '#F5F6FA']}
          locations={[0, 0.2, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={s.container} edges={['top']}>
          <ScrollView
            contentContainerStyle={s.resultsScroll}
            showsVerticalScrollIndicator={false}
          >
            <FadeIn>
              <Text style={[s.resultsTitle, isRTL && s.textRTL]}>
                {t('selfCheck.result.title')}
              </Text>
            </FadeIn>

            {/* Risk Card */}
            <FadeIn delay={80}>
              <View style={[s.riskCard, { borderColor: riskColor + '30' }]}>
                <LinearGradient
                  colors={[riskBgLight, '#FFFFFF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={s.riskCardInner}
                >
                  <View
                    style={[
                      s.riskIconCircle,
                      { backgroundColor: riskColor + '15' },
                    ]}
                  >
                    <Ionicons name={riskIconName} size={34} color={riskColor} />
                  </View>
                  <Text style={[s.riskLevelText, { color: riskColor }]}>
                    {t(result.recommendationKey)}
                  </Text>
                  <Text
                    style={[s.riskMessage, isRTL && s.textRTL]}
                  >
                    {t(result.messageKey)}
                  </Text>

                  {/* Score bar */}
                  <View style={s.scoreSection}>
                    <View style={s.scoreTrack}>
                      <View
                        style={[
                          s.scoreFill,
                          {
                            width: `${Math.min(
                              (result.score / Math.max(result.maxScore, 1)) *
                              100,
                              100,
                            )}%`,
                            backgroundColor: riskColor,
                          },
                        ]}
                      />
                    </View>
                    <Text style={s.scoreLabel}>
                      {result.score}/{result.maxScore}
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            </FadeIn>

            {/* Concerns */}
            {result.concerns.length > 0 && (
              <FadeIn delay={160}>
                <View style={s.section}>
                  <Text style={[s.sectionTitle, isRTL && s.textRTL]}>
                    {t('selfCheck.result.concerns')}
                  </Text>
                  {result.concerns.map((qId) => {
                    const allQuestions = Object.values(
                      STEP_CONVERSATIONS,
                    ).flatMap((script) => getAllQuestionNodes(script));
                    const q = allQuestions.find(
                      (question) => question.id === qId,
                    );
                    return (
                      <View
                        key={qId}
                        style={[s.concernItem, isRTL && s.rowReverse]}
                      >
                        <View style={s.concernIconWrap}>
                          <Ionicons
                            name="alert-circle"
                            size={16}
                            color="#F59E0B"
                          />
                        </View>
                        <Text
                          style={[s.concernText, isRTL && s.textRTL]}
                          numberOfLines={3}
                        >
                          {q ? t(q.textKey) : qId}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </FadeIn>
            )}

            {/* Next Steps */}
            <FadeIn delay={240}>
              <View style={s.section}>
                <Text style={[s.sectionTitle, isRTL && s.textRTL]}>
                  {t('selfCheck.result.nextSteps')}
                </Text>
                {[
                  'selfCheck.result.steps.monthlyExam',
                  'selfCheck.result.steps.consultDoctor',
                  'selfCheck.result.steps.noteChanges',
                ].map((key, idx) => (
                  <View
                    key={key}
                    style={[s.nextStepItem, isRTL && s.rowReverse]}
                  >
                    <LinearGradient
                      colors={[riskColor, riskColor + 'CC']}
                      style={s.nextStepNum}
                    >
                      <Text style={s.nextStepNumText}>{idx + 1}</Text>
                    </LinearGradient>
                    <Text style={[s.nextStepText, isRTL && s.textRTL]}>
                      {t(key)}
                    </Text>
                  </View>
                ))}
              </View>
            </FadeIn>

            <FadeIn delay={320}>
              <MedicalDisclaimer />
            </FadeIn>

            {/* New Check CTA */}
            <FadeIn delay={380}>
              <AnimPress onPress={store.resetCheck} style={s.ctaOuter}>
                <LinearGradient
                  colors={['#E8467A', '#D63A6B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={s.ctaGradient}
                >
                  <Ionicons
                    name="refresh-outline"
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text style={s.ctaText}>
                    {t('selfCheck.result.newCheck')}
                  </Text>
                </LinearGradient>
              </AnimPress>
            </FadeIn>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // ──────────────────────────────────────────────────────
  // 2 & 3. ACTIVE FLOW: Instructions + Chat
  // ──────────────────────────────────────────────────────
  const step = SELF_CHECK_STEPS[currentStepIndex];
  const progress = store.getOverallProgress();

  // ─── Chat phase ───
  if (phase === 'chat') {
    return (
      <View style={s.rootBg}>
        <LinearGradient
          colors={['#FFF5F8', '#F8F9FC', '#F5F6FA']}
          locations={[0, 0.4, 1]}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={s.container} edges={['top']}>
          {/* Back button header */}
          <Pressable
            style={[s.flowBackBtn, isRTL && s.rowReverse]}
            onPress={store.resetCheck}
          >
            <Ionicons
              name={(isRTL ? 'chevron-forward' : 'chevron-back') as IoniconsName}
              size={22}
              color="#64748B"
            />
            <Text style={s.flowBackText}>{t('common.back')}</Text>
          </Pressable>

          <ProgressBar
            percentage={progress.percentage}
            current={progress.current}
            total={progress.total}
          />

          <View style={[s.stepIndicator, isRTL && s.rowReverse]}>
            <LinearGradient
              colors={[step.accentColor, step.accentColor + 'CC']}
              style={s.stepBadge}
            >
              <Text style={s.stepBadgeText}>
                {currentStepIndex + 1}
              </Text>
            </LinearGradient>
            <Text
              style={[s.stepTitle, isRTL && s.textRTL]}
              numberOfLines={1}
            >
              {t(step.titleKey)}
            </Text>
            <View
              style={[
                s.chatIndicator,
                { backgroundColor: step.accentColor + '12' },
              ]}
            >
              <Ionicons
                name="chatbubbles-outline"
                size={14}
                color={step.accentColor}
              />
            </View>
          </View>

          <StepChat
            stepId={step.id}
            accentColor={step.accentColor}
            stepIcon={step.icon}
            onComplete={(answers) => store.completeStepChat(answers)}
            onBack={() => store.backToInstructions()}
          />
        </SafeAreaView>
      </View>
    );
  }

  // ─── Instructions phase ───
  const instruction = step.instructions[currentInstructionIndex];
  const isLastInstruction =
    currentInstructionIndex === step.instructions.length - 1;

  const handleInstructionNext = () => {
    if (!isLastInstruction) {
      store.nextInstruction();
    } else {
      store.startChat();
    }
  };

  const handleInstructionBack = () => {
    if (currentInstructionIndex > 0) {
      store.previousInstruction();
    } else if (currentStepIndex > 0) {
      useSelfCheckStore.setState({
        currentStepIndex: currentStepIndex - 1,
        phase: 'chat',
        currentInstructionIndex: 0,
      });
    }
  };

  const canGoBack = currentInstructionIndex > 0 || currentStepIndex > 0;

  return (
    <View style={s.rootBg}>
      <LinearGradient
        colors={['#FFF5F8', '#F8F9FC', '#F5F6FA']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={s.container} edges={['top']}>
        {/* Back button header */}
        <Pressable
          style={[s.flowBackBtn, isRTL && s.rowReverse]}
          onPress={store.resetCheck}
        >
          <Ionicons
            name={(isRTL ? 'chevron-forward' : 'chevron-back') as IoniconsName}
            size={22}
            color="#64748B"
          />
          <Text style={s.flowBackText}>{t('common.back')}</Text>
        </Pressable>

        <ProgressBar
          percentage={progress.percentage}
          current={progress.current}
          total={progress.total}
        />

        <View style={[s.stepIndicator, isRTL && s.rowReverse]}>
          <LinearGradient
            colors={[step.accentColor, step.accentColor + 'CC']}
            style={s.stepBadge}
          >
            <Text style={s.stepBadgeText}>{currentStepIndex + 1}</Text>
          </LinearGradient>
          <Text
            style={[s.stepTitle, isRTL && s.textRTL]}
            numberOfLines={1}
          >
            {t(step.titleKey)}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={s.instructionScroll}
          showsVerticalScrollIndicator={false}
        >
          <InstructionVisual
            icon={instruction.icon}
            decorIcon={instruction.decorIcon}
            accentColor={step.accentColor}
            stepNumber={currentInstructionIndex + 1}
            totalSteps={step.instructions.length}
            mediaPlaceholder={instruction.mediaPlaceholder}
          />

          <View
            style={[
              s.instructionCard,
              { borderLeftColor: step.accentColor },
            ]}
          >
            <Text style={[s.instructionText, isRTL && s.textRTL]}>
              {t(instruction.textKey)}
            </Text>
          </View>

          <StepDots
            total={step.instructions.length}
            current={currentInstructionIndex}
            accentColor={step.accentColor}
          />

          <View
            style={[
              s.hintCard,
              { borderColor: step.accentColor + '20' },
            ]}
          >
            <View
              style={[
                s.hintIconWrap,
                { backgroundColor: step.accentColor + '10' },
              ]}
            >
              <Ionicons
                name="information-circle-outline"
                size={17}
                color={step.accentColor}
              />
            </View>
            <Text style={[s.hintText, isRTL && s.textRTL]}>
              {t(step.descriptionKey)}
            </Text>
          </View>
        </ScrollView>

        {/* Navigation Bar */}
        <View style={[s.navBar, isRTL && s.navBarRTL]}>
          <Pressable
            style={s.navBackBtn}
            onPress={handleInstructionBack}
            disabled={!canGoBack}
          >
            <Ionicons
              name={
                (isRTL ? 'chevron-forward' : 'chevron-back') as IoniconsName
              }
              size={18}
              color={canGoBack ? '#64748B' : '#CBD5E1'}
            />
            <Text
              style={[
                s.navBackText,
                !canGoBack && s.navDisabledText,
              ]}
            >
              {t('common.previous')}
            </Text>
          </Pressable>

          <AnimPress
            onPress={handleInstructionNext}
            style={[
              s.navNextBtn,
              { backgroundColor: step.accentColor },
            ]}
          >
            <Text style={s.navNextText}>
              {isLastInstruction
                ? t('selfCheck.answerQuestions')
                : t('common.next')}
            </Text>
            <Ionicons
              name={
                (isRTL ? 'chevron-back' : 'chevron-forward') as IoniconsName
              }
              size={18}
              color="#FFFFFF"
            />
          </AnimPress>
        </View>
      </SafeAreaView>
    </View>
  );
};

// ────────────────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  /* ─── Base ─── */
  rootBg: { flex: 1 },
  container: { flex: 1 },
  textRTL: { textAlign: 'right', writingDirection: 'rtl' },

  /* ─── Flow Back Button ─── */
  flowBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 4,
  },
  flowBackText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: -0.2,
  },
  rowReverse: { flexDirection: 'row-reverse' },

  /* ─── Progress Bar ─── */
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressPill: {
    backgroundColor: '#FDE8EF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 12,
    color: '#E8467A',
    fontWeight: '700',
  },

  /* ─── Landing: Hero Header ─── */
  landingScroll: {
    paddingBottom: spacing.xxl + spacing.lg,
  },
  heroHeader: {
    paddingHorizontal: 0,
    ...SHADOW_MD,
  },
  heroHeaderGradient: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  heroBlob1: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.12)',
    top: -30,
    right: -20,
  },
  heroBlob2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -20,
    left: 30,
  },
  heroBlob3: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.10)',
    top: 20,
    left: -10,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroHeaderText: {
    flex: 1,
    paddingRight: spacing.md,
  },
  heroHeaderTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  heroHeaderSub: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  heroHeaderIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroHeaderIconInner: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW_SM,
  },

  /* ─── Landing: Content ─── */
  landingContent: {
    paddingHorizontal: 20,
    paddingTop: spacing.lg,
  },
  landingContentWide: {
    paddingHorizontal: 28,
  },

  /* ─── Last Check Card ─── */
  lastCheckCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    padding: 16,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    ...SHADOW_SM,
  },
  lastCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  lastCheckIconBg: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FDE8EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lastCheckInfo: { flex: 1 },
  lastCheckLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  lastCheckValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  lastResultBadge: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  lastResultText: {
    fontSize: 12,
    fontWeight: '600',
  },

  /* ─── Section ─── */
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: spacing.md,
    letterSpacing: -0.3,
  },

  /* ─── Overview Cards (Timeline style) ─── */
  overviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    ...SHADOW_XS,
  },
  timelineConnector: {
    position: 'absolute',
    left: 30,
    top: 52,
    bottom: -18,
    width: 2,
    backgroundColor: '#E2E8F0',
    borderRadius: 1,
  },
  overviewBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  overviewBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  overviewTextWrap: { flex: 1 },
  overviewTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  overviewDesc: {
    fontSize: 12,
    fontWeight: '400',
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 17,
  },
  overviewIconBg: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ─── CTA Button ─── */
  ctaOuter: {
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: spacing.xl,
    ...SHADOW_CTA,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 16,
    minHeight: MIN_TOUCH_TARGET,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },

  /* ─── Step Indicator ─── */
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  stepTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  chatIndicator: {
    width: 32,
    height: 32,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ─── Instruction Phase ─── */
  instructionScroll: {
    padding: 20,
    paddingBottom: spacing.xxl,
  },
  mediaWrapper: {
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...SHADOW_SM,
  },
  mediaImageContainer: {
    width: '100%',
    height: 240,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  mediaGradient: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
  },
  mediaRing1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    top: -30,
    right: -30,
  },
  mediaRing2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
    bottom: -20,
    left: -20,
  },
  mediaDecorIconWrap: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
  },
  mediaAccent: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  mediaIconOuter: {
    width: 92,
    height: 92,
    borderRadius: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaIconMiddle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaIconInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW_SM,
  },
  mediaBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  mediaBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  instructionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    padding: 20,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    ...SHADOW_SM,
  },
  instructionText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#334155',
    lineHeight: 24,
  },

  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: spacing.lg,
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
  },

  hintCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    padding: 16,
    borderWidth: 1,
  },
  hintIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '400',
    color: '#64748B',
    lineHeight: 20,
    paddingTop: 6,
  },

  /* ─── Results ─── */
  resultsScroll: {
    padding: 20,
    paddingBottom: spacing.xxl,
  },
  resultsTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: spacing.lg,
    letterSpacing: -0.5,
  },

  riskCard: {
    borderRadius: CARD_RADIUS,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...SHADOW_MD,
  },
  riskCardInner: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  riskIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  riskLevelText: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  riskMessage: {
    fontSize: 15,
    fontWeight: '400',
    color: '#334155',
    lineHeight: 23,
    textAlign: 'center',
  },
  scoreSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  scoreTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: 3,
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    minWidth: 32,
    textAlign: 'right',
  },

  concernItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    ...SHADOW_XS,
  },
  concernIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#FFFBEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  concernText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: '#334155',
    lineHeight: 21,
  },

  nextStepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  nextStepNum: {
    width: 32,
    height: 32,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextStepNumText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  nextStepText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: '#334155',
    lineHeight: 22,
    paddingTop: 5,
  },

  /* ─── Navigation Bar ─── */
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  navBarRTL: { flexDirection: 'row-reverse' },
  navBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    minHeight: MIN_TOUCH_TARGET,
  },
  navBackText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
  },
  navDisabledText: { color: '#CBD5E1' },
  navNextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: MIN_TOUCH_TARGET,
    ...SHADOW_SM,
  },
  navNextText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
