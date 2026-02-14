/**
 * Home Screen — Premium 2026 Health Dashboard
 * Inspired by Apple Health, Flo, Withings — glassmorphism, soft depth,
 * rich micro-interactions, warm tones, generous whitespace, fluid layout.
 */

import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MedicalDisclaimer } from '../../components/common/MedicalDisclaimer';
import { useLanguageStore } from '../../../application/store/languageStore';
import { useExamStore } from '../../../application/store/examStore';
import { useReminderStore } from '../../../application/store/reminderStore';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 12;
const HORIZONTAL_PAD = 20;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Props {
  onNavigateToExam?: () => void;
  onNavigateToChat?: () => void;
  onNavigateToCenters?: () => void;
}

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

/* ------------------------------------------------------------------ */
/*  Animated pressable card — spring scale on press                    */
/* ------------------------------------------------------------------ */

interface AnimCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  accessibilityLabel?: string;
}

const AnimCard: React.FC<AnimCardProps> = ({
  children,
  onPress,
  style,
  accessibilityLabel,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scale]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

/* ------------------------------------------------------------------ */
/*  Subtle fade-in wrapper                                             */
/* ------------------------------------------------------------------ */

const FadeIn: React.FC<{ delay?: number; children: React.ReactNode }> = ({
  delay = 0,
  children,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
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

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export const HomeScreen: React.FC<Props> = ({
  onNavigateToExam,
  onNavigateToChat,
  onNavigateToCenters,
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();
  const { lastExamDate, examHistory, loadHistory } = useExamStore();
  const { getNextReminderDate, loadReminders } = useReminderStore();

  useEffect(() => {
    loadHistory();
    loadReminders();
  }, []);

  /* ---- derived state ---- */
  const nextReminder = getNextReminderDate();
  const daysSinceExam = lastExamDate
    ? Math.floor((Date.now() - lastExamDate) / (1000 * 60 * 60 * 24))
    : null;
  const lastResult = examHistory.length > 0 ? examHistory[0].result : null;

  /* ---- time-based greeting ---- */
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t('home.goodMorning', 'Bonjour')
      : hour < 18
        ? t('home.goodAfternoon', 'Bon après-midi')
        : t('home.goodEvening', 'Bonsoir');

  /* ---- formatted date ---- */
  const dateStr = new Date().toLocaleDateString(isRTL ? 'ar' : 'fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  /* ---- formatted next reminder ---- */
  const reminderStr = nextReminder
    ? nextReminder.toLocaleDateString(isRTL ? 'ar' : 'fr-FR', {
        day: 'numeric',
        month: 'short',
      })
    : '—';

  /* ---- RTL helpers ---- */
  const rtlText = isRTL ? s.textRTL : undefined;
  const rtlRow = isRTL ? s.rowRTL : undefined;

  return (
    <View style={s.root}>
      {/* Background gradient overlay */}
      <LinearGradient
        colors={['#FFF5F8', '#FEF0F4', '#F8F9FC', '#F5F6FA']}
        locations={[0, 0.25, 0.6, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={s.safe} edges={['top']}>
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
          bounces
        >
          {/* ═══════ Header ═══════ */}
          <FadeIn>
            <View style={[s.header, isRTL && s.headerRTL]}>
              <View style={s.headerTextWrap}>
                <Text style={[s.dateText, rtlText]}>{dateStr}</Text>
                <Text style={[s.greetingText, rtlText]}>
                  {greeting} 👋
                </Text>
              </View>
              <Pressable style={s.avatarWrap}>
                <LinearGradient
                  colors={['#F9A8C9', '#EC407A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={s.avatarGradient}
                >
                  <Ionicons name="heart" size={18} color="#fff" />
                </LinearGradient>
              </Pressable>
            </View>
          </FadeIn>

          {/* ═══════ Hero CTA Card ═══════ */}
          <FadeIn delay={80}>
            <View style={s.heroWrap}>
              <AnimCard
                onPress={onNavigateToExam}
                style={s.heroOuter}
                accessibilityLabel={t('home.startExam')}
              >
                <LinearGradient
                  colors={['#E8467A', '#F06292', '#F8A4C0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={s.heroGradient}
                >
                  {/* Decorative organic shapes */}
                  <View style={s.blob1} />
                  <View style={s.blob2} />
                  <View style={s.blob3} />
                  <View style={s.blob4} />

                  <View style={[s.heroContent, isRTL && s.heroContentRTL]}>
                    <View style={s.heroLeft}>
                      <View style={s.heroPill}>
                        <View style={s.heroPillDot} />
                        <Text style={s.heroPillText}>
                          {t('home.selfExamLabel', 'Auto-examen')}
                        </Text>
                      </View>
                      <Text style={[s.heroTitle, rtlText]}>
                        {t('home.startExam')}
                      </Text>
                      <Text style={[s.heroSubtitle, rtlText]}>
                        {t('autopalpation.subtitle')}
                      </Text>
                      <View style={[s.heroCta, isRTL && s.rowRTL]}>
                        <Text style={s.heroCtaText}>
                          {t('home.heroCtaLabel', 'Commencer')}
                        </Text>
                        <Ionicons
                          name={isRTL ? 'arrow-back' : 'arrow-forward'}
                          size={15}
                          color="#E8467A"
                          style={{ marginTop: 1 }}
                        />
                      </View>
                    </View>

                    <View style={s.heroRight}>
                      <View style={s.heroIconOuter}>
                        <View style={s.heroIconMiddle}>
                          <View style={s.heroIconInner}>
                            <Ionicons name="body-outline" size={28} color="#E8467A" />
                          </View>
                        </View>
                      </View>
                      {daysSinceExam !== null && (
                        <View style={s.heroDaysBadge}>
                          <Text style={s.heroDaysNum}>{daysSinceExam}</Text>
                          <Text style={s.heroDaysLabel}>
                            {t('home.daysLabel', 'jours')}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </LinearGradient>
              </AnimCard>
            </View>
          </FadeIn>

          {/* ═══════ Quick Actions — Feature Cards ═══════ */}
          <FadeIn delay={160}>
            <View style={s.section}>
              <Text style={[s.sectionTitle, rtlText]}>
                {t('home.quickActions')}
              </Text>

              <View style={[s.bentoRow, isRTL && s.rowRTL]}>
                {/* AI Chat card */}
                <AnimCard
                  onPress={onNavigateToChat}
                  style={s.bentoCard}
                  accessibilityLabel={t('home.askQuestion')}
                >
                  <LinearGradient
                    colors={['#EBF4FF', '#DBEAFE']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={s.bentoGradientBg}
                  >
                    <View style={s.bentoInner}>
                      <View style={s.bentoIconWrap}>
                        <LinearGradient
                          colors={['#3B82F6', '#2563EB']}
                          style={s.bentoIcon}
                        >
                          <Ionicons name="chatbubble-ellipses" size={20} color="#FFFFFF" />
                        </LinearGradient>
                      </View>
                      <Text style={[s.bentoLabel, rtlText]} numberOfLines={2}>
                        {t('home.askQuestion')}
                      </Text>
                      <Text style={[s.bentoSub, rtlText]} numberOfLines={2}>
                        {t('home.chatDesc', 'Assistant IA confidentiel')}
                      </Text>
                      <View style={[s.bentoArrow, isRTL && s.rowRTL]}>
                        <Ionicons
                          name={isRTL ? 'arrow-back-circle' : 'arrow-forward-circle'}
                          size={24}
                          color="#3B82F6"
                        />
                      </View>
                    </View>
                  </LinearGradient>
                </AnimCard>

                {/* Find Center card */}
                <AnimCard
                  onPress={onNavigateToCenters}
                  style={s.bentoCard}
                  accessibilityLabel={t('home.findCenter')}
                >
                  <LinearGradient
                    colors={['#ECFDF5', '#D1FAE5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={s.bentoGradientBg}
                  >
                    <View style={s.bentoInner}>
                      <View style={s.bentoIconWrap}>
                        <LinearGradient
                          colors={['#10B981', '#059669']}
                          style={s.bentoIcon}
                        >
                          <Ionicons name="location" size={20} color="#FFFFFF" />
                        </LinearGradient>
                      </View>
                      <Text style={[s.bentoLabel, rtlText]} numberOfLines={2}>
                        {t('home.findCenter')}
                      </Text>
                      <Text style={[s.bentoSub, rtlText]} numberOfLines={2}>
                        {t('home.centerDesc', 'Près de chez vous')}
                      </Text>
                      <View style={[s.bentoArrow, isRTL && s.rowRTL]}>
                        <Ionicons
                          name={isRTL ? 'arrow-back-circle' : 'arrow-forward-circle'}
                          size={24}
                          color="#10B981"
                        />
                      </View>
                    </View>
                  </LinearGradient>
                </AnimCard>
              </View>
            </View>
          </FadeIn>

          {/* ═══════ Health Overview ═══════ */}
          <FadeIn delay={240}>
            <View style={s.section}>
              <Text style={[s.sectionTitle, rtlText]}>
                {t('home.yourHealth')}
              </Text>

              <View style={[s.insightsRow, isRTL && s.rowRTL]}>
                {/* Last Exam */}
                <View style={s.insightCard}>
                  <View style={s.insightHeader}>
                    <View style={[s.insightIconWrap, { backgroundColor: '#FDE8EF' }]}>
                      <Ionicons name="clipboard-outline" size={16} color="#E8467A" />
                    </View>
                  </View>
                  <Text style={[s.insightLabel, rtlText]} numberOfLines={1}>
                    {t('home.lastExam')}
                  </Text>
                  <Text style={[s.insightValue, rtlText]} numberOfLines={1}>
                    {daysSinceExam !== null
                      ? t('home.daysAgo', { count: daysSinceExam })
                      : t('home.neverDone')}
                  </Text>

                  {lastResult && (
                    <View
                      style={[
                        s.riskBadge,
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
                      <View
                        style={[
                          s.riskDot,
                          {
                            backgroundColor:
                              lastResult.riskLevel === 'low'
                                ? '#10B981'
                                : lastResult.riskLevel === 'moderate'
                                  ? '#F59E0B'
                                  : '#EF4444',
                          },
                        ]}
                      />
                      <Text
                        style={[
                          s.riskText,
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

                {/* Next Reminder */}
                <View style={s.insightCard}>
                  <View style={s.insightHeader}>
                    <View style={[s.insightIconWrap, { backgroundColor: '#EFF6FF' }]}>
                      <Ionicons name="notifications-outline" size={16} color="#3B82F6" />
                    </View>
                  </View>
                  <Text style={[s.insightLabel, rtlText]} numberOfLines={1}>
                    {t('home.nextReminder')}
                  </Text>
                  <Text style={[s.insightValue, rtlText]} numberOfLines={1}>
                    {reminderStr}
                  </Text>
                </View>
              </View>
            </View>
          </FadeIn>

          {/* ═══════ Health Tip of the Day ═══════ */}
          <FadeIn delay={320}>
            <View style={s.section}>
              <Text style={[s.sectionTitle, rtlText]}>
                {t('home.healthTip')}
              </Text>

              <View style={s.tipCard}>
                <View style={[s.tipInner, isRTL && s.rowRTL]}>
                  <LinearGradient
                    colors={['#FEF3C7', '#FDE68A']}
                    style={s.tipIconBg}
                  >
                    <Ionicons name="bulb" size={20} color="#D97706" />
                  </LinearGradient>
                  <View style={s.tipTextWrap}>
                    <Text style={[s.tipText, rtlText]}>
                      {t('home.earlyDetection')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </FadeIn>

          {/* ═══════ Motivation Banner ═══════ */}
          <FadeIn delay={400}>
            <View style={s.section}>
              <LinearGradient
                colors={['#F5F3FF', '#EDE9FE', '#F5F3FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.motivBanner}
              >
                <View style={[s.motivContent, isRTL && s.rowRTL]}>
                  <View style={s.motivIconWrap}>
                    <LinearGradient
                      colors={['#8B5CF6', '#7C3AED']}
                      style={s.motivIconGradient}
                    >
                      <Ionicons name="shield-checkmark" size={22} color="#FFFFFF" />
                    </LinearGradient>
                  </View>
                  <View style={s.motivTextWrap}>
                    <Text style={[s.motivTitle, rtlText]}>
                      {t('home.motivTitle', 'Prenez soin de vous')}
                    </Text>
                    <Text style={[s.motivSub, rtlText]}>
                      {t('home.motivSub', 'Un auto-examen régulier peut sauver des vies')}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </FadeIn>

          {/* ═══════ Disclaimer ═══════ */}
          <FadeIn delay={480}>
            <View style={s.sectionLast}>
              <MedicalDisclaimer compact />
            </View>
          </FadeIn>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

/* ================================================================== */
/*  Styles                                                             */
/* ================================================================== */

const SHADOW_SM = Platform.select({
  ios: {
    shadowColor: 'rgba(0,0,0,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  android: { elevation: 2 },
}) as any;

const SHADOW_MD = Platform.select({
  ios: {
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
  },
  android: { elevation: 4 },
}) as any;

const SHADOW_LG = Platform.select({
  ios: {
    shadowColor: '#E8467A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  android: { elevation: 8 },
}) as any;

const CARD_RADIUS = 22;

const s = StyleSheet.create({
  /* ---- Root ---- */
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  scroll: {
    paddingBottom: spacing.xxl + spacing.xl,
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  rowRTL: {
    flexDirection: 'row-reverse',
  },

  /* ---- Header ---- */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: HORIZONTAL_PAD,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  headerTextWrap: {
    flex: 1,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94A3B8',
    marginBottom: 2,
    textTransform: 'capitalize',
    letterSpacing: 0.2,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.8,
  },
  avatarWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    ...SHADOW_SM,
  },
  avatarGradient: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ---- Hero Card ---- */
  heroWrap: {
    paddingHorizontal: HORIZONTAL_PAD,
    paddingTop: spacing.lg,
  },
  heroOuter: {
    borderRadius: 26,
    overflow: 'hidden',
    ...SHADOW_LG,
  },
  heroGradient: {
    padding: 24,
    minHeight: 190,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.14)',
    top: -40,
    right: -30,
  },
  blob2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.10)',
    bottom: -30,
    left: 20,
  },
  blob3: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.12)',
    top: 30,
    left: -10,
  },
  blob4: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: 50,
    right: 60,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  heroContentRTL: {
    flexDirection: 'row-reverse',
  },
  heroLeft: {
    flex: 1,
    paddingRight: 16,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
    marginBottom: 14,
  },
  heroPillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E8467A',
  },
  heroPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E8467A',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  heroSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 18,
    marginBottom: 18,
  },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 14,
    gap: 6,
    ...SHADOW_SM,
  },
  heroCtaText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E8467A',
  },
  heroRight: {
    alignItems: 'center',
  },
  heroIconOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroIconMiddle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroIconInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroDaysBadge: {
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  heroDaysNum: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroDaysLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  /* ---- Section ---- */
  section: {
    marginTop: 28,
    paddingHorizontal: HORIZONTAL_PAD,
  },
  sectionLast: {
    marginTop: 20,
    paddingHorizontal: HORIZONTAL_PAD,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
    letterSpacing: -0.3,
  },

  /* ---- Bento Actions ---- */
  bentoRow: {
    flexDirection: 'row',
    gap: CARD_GAP,
  },
  bentoCard: {
    flex: 1,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    ...SHADOW_MD,
  },
  bentoGradientBg: {
    flex: 1,
    borderRadius: CARD_RADIUS,
  },
  bentoInner: {
    padding: 18,
    minHeight: 175,
    justifyContent: 'space-between',
  },
  bentoIconWrap: {
    marginBottom: 14,
  },
  bentoIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bentoLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 4,
  },
  bentoSub: {
    fontSize: 12,
    fontWeight: '400',
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 8,
  },
  bentoArrow: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },

  /* ---- Insights Row ---- */
  insightsRow: {
    flexDirection: 'row',
    gap: CARD_GAP,
  },
  insightCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    ...SHADOW_SM,
  },
  insightHeader: {
    marginBottom: 14,
  },
  insightIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },

  /* ---- Risk Badge ---- */
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  riskDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  riskText: {
    fontSize: 11,
    fontWeight: '600',
  },

  /* ---- Tip Card ---- */
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    ...SHADOW_SM,
  },
  tipInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  tipIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  tipTextWrap: {
    flex: 1,
    paddingTop: 2,
  },
  tipText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#334155',
    lineHeight: 22,
  },

  /* ---- Motivation Banner ---- */
  motivBanner: {
    borderRadius: CARD_RADIUS,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.1)',
  },
  motivContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  motivIconWrap: {
    flexShrink: 0,
  },
  motivIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  motivTextWrap: {
    flex: 1,
  },
  motivTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4C1D95',
    marginBottom: 3,
  },
  motivSub: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6D28D9',
    lineHeight: 19,
  },
});
