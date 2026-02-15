/**
 * Home Screen — Premium 2026 Health Dashboard
 * Enhanced UI: Glassmorphism, Organic Gradients, Colored Shadows.
 * Functionality: Preserved 100%.
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
import LottieView from 'lottie-react-native';
import { MedicalDisclaimer } from '../../components/common/MedicalDisclaimer';
import { useLanguageStore } from '../../../application/store/languageStore';
import { useExamStore } from '../../../application/store/examStore';
import { useReminderStore } from '../../../application/store/reminderStore';
import { colors } from '../../theme/colors'; // Assuming this exists, but overridden locally for specific UI
import { spacing } from '../../theme/spacing';

/* ------------------------------------------------------------------ */
/* Constants                                                          */
/* ------------------------------------------------------------------ */

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PAD = 24; // Increased for breathable layout

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

interface Props {
  onNavigateToExam?: () => void;
  onNavigateToChat?: () => void;
  onNavigateToCenters?: () => void;
}

/* ------------------------------------------------------------------ */
/* Animated pressable card — spring scale on press                    */
/* ------------------------------------------------------------------ */

interface AnimCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  accessibilityLabel?: string;
  shadowColor?: string; // New prop for colored shadows
}

const AnimCard: React.FC<AnimCardProps> = ({
  children,
  onPress,
  style,
  accessibilityLabel,
  shadowColor = '#000',
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 5,
    }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 5,
    }).start();
  }, [scale]);

  // Merge style with dynamic colored shadow for iOS/Android
  const shadowStyle = Platform.select({
    ios: {
      shadowColor: shadowColor,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 18,
    },
    android: { elevation: 6, shadowColor: shadowColor },
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View style={[style, shadowStyle, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

/* ------------------------------------------------------------------ */
/* Subtle fade-in wrapper                                             */
/* ------------------------------------------------------------------ */

const FadeIn: React.FC<{ delay?: number; children: React.ReactNode }> = ({
  delay = 0,
  children,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(25)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        useNativeDriver: true,
        damping: 20,
        stiffness: 90,
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
/* Main component                                                     */
/* ------------------------------------------------------------------ */

export const HomeScreen: React.FC<Props> = ({
  onNavigateToExam,
  onNavigateToChat,
  onNavigateToCenters,
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();
  const { lastExamDate, examHistory, loadHistory, lastScreeningDate } = useExamStore();
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

  const reminderStr = nextReminder
    ? nextReminder.toLocaleDateString(isRTL ? 'ar' : 'fr-FR', {
      day: 'numeric',
      month: 'short',
    })
    : '—';

  const rtlText = isRTL ? s.textRTL : undefined;

  return (
    <View style={s.root}>
      {/* Premium Background: 
         A subtle mesh gradient simulation using multiple gradients/layers 
         is usually best, but here we use a refined clean gradient 
         fading from warm top to cool bottom.
      */}
      <LinearGradient
        colors={['#FFF0F5', '#FFF5F7', '#F0F7FF', '#F8FAFC']}
        locations={[0, 0.2, 0.6, 1]}
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
                <Text style={[s.dateText, rtlText]}>{dateStr.toUpperCase()}</Text>
                <Text style={[s.greetingText, rtlText]}>
                  {greeting}
                </Text>
              </View>
              <Pressable style={s.avatarWrap}>
                <LinearGradient
                  colors={['#FDA4AF', '#F43F5E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={s.avatarGradient}
                >
                  <Ionicons name="person" size={20} color="#fff" />
                </LinearGradient>
                <View style={s.notificationDot} />
              </Pressable>
            </View>
          </FadeIn>

          {/* ═══════ Hero CTA Card (The "Island") ═══════ */}
          <FadeIn delay={100}>
            <View style={s.heroContainer}>
              <AnimCard
                onPress={onNavigateToExam}
                style={s.heroOuter}
                accessibilityLabel={t('home.startExam')}
                shadowColor="#F43F5E"
              >
                <LinearGradient
                  colors={['#BE123C', '#E11D48', '#FB7185']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={s.heroGradient}
                >
                  {/* Abstract Mesh Background */}
                  <View style={s.meshCircle1} />
                  <View style={s.meshCircle2} />
                  <View style={s.meshCircle3} />

                  {/* Lottie Background Animation */}
                  <LottieView
                    source={require('../../../../assets/Breast Cancer Awareness Month.json')}
                    autoPlay
                    loop
                    speed={0.6}
                    style={s.heroLottie}
                  />

                  <View style={[s.heroContent, isRTL && s.heroContentRTL]}>
                    <View style={s.heroLeft}>
                      <View style={s.badgePill}>
                        <View style={s.badgeDot} />
                        <Text style={s.badgeText}>
                          {t('home.selfExamLabel', 'Priorité Santé')}
                        </Text>
                      </View>

                      <Text style={[s.heroTitle, rtlText]}>
                        {t('home.startExam')}
                      </Text>

                      <Text style={[s.heroSubtitle, rtlText]}>
                        {t('autopalpation.subtitle', 'Détecter tôt pour mieux guérir.')}
                      </Text>

                      <View style={[s.ctaButton, isRTL && s.rowRTL]}>
                        <Text style={s.ctaText}>
                          {t('home.heroCtaLabel', 'Commencer')}
                        </Text>
                        <View style={s.ctaIconBg}>
                          <Ionicons
                            name={isRTL ? 'arrow-back' : 'arrow-forward'}
                            size={14}
                            color="#E11D48"
                          />
                        </View>
                      </View>
                    </View>

                    {/* Right Side Visual */}
                    <View style={s.heroRight}>
                      {/* Glassy Circular Progress simulation */}
                      <View style={s.glassCircleOuter}>
                        <View style={s.glassCircleInner}>
                          <Ionicons name="scan-outline" size={32} color="#FFF" />
                        </View>
                      </View>

                      {daysSinceExam !== null && (
                        <View style={s.floatingStat}>
                          <Text style={s.floatingStatNum}>{daysSinceExam}</Text>
                          <Text style={s.floatingStatLabel}>
                            {t('home.daysLabel', 'Jours')}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </LinearGradient>
              </AnimCard>
            </View>
          </FadeIn>

          {/* ═══════ Quick Actions (Bento Grid) ═══════ */}
          <FadeIn delay={200}>
            <View style={s.section}>
              <Text style={[s.sectionTitle, rtlText]}>
                {t('home.quickActions')}
              </Text>

              <View style={[s.bentoGrid, isRTL && s.rowRTL]}>
                {/* AI Chat */}
                <AnimCard
                  onPress={onNavigateToChat}
                  style={s.bentoItem}
                  accessibilityLabel={t('home.askQuestion')}
                  shadowColor="#3B82F6"
                >
                  <LinearGradient
                    colors={['#FFFFFF', '#F0F9FF']}
                    style={s.bentoGradient}
                  >
                    <View style={s.bentoHeader}>
                      <View style={[s.iconBox, { backgroundColor: '#DBEAFE' }]}>
                        <Ionicons name="sparkles" size={22} color="#2563EB" />
                      </View>
                      <View style={s.arrowCircle}>
                        <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={14} color="#94A3B8" />
                      </View>
                    </View>
                    <View style={s.bentoTextContent}>
                      <Text style={[s.bentoTitle, rtlText]} numberOfLines={2}>
                        {t('home.askQuestion')}
                      </Text>
                      <Text style={[s.bentoDesc, rtlText]} numberOfLines={1}>
                        {t('home.chatDesc', 'Assistant IA')}
                      </Text>
                    </View>
                  </LinearGradient>
                </AnimCard>

                {/* Centers */}
                <AnimCard
                  onPress={onNavigateToCenters}
                  style={s.bentoItem}
                  accessibilityLabel={t('home.findCenter')}
                  shadowColor="#10B981"
                >
                  <LinearGradient
                    colors={['#FFFFFF', '#ECFDF5']}
                    style={s.bentoGradient}
                  >
                    <View style={s.bentoHeader}>
                      <View style={[s.iconBox, { backgroundColor: '#D1FAE5' }]}>
                        <Ionicons name="map" size={22} color="#059669" />
                      </View>
                      <View style={s.arrowCircle}>
                        <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={14} color="#94A3B8" />
                      </View>
                    </View>
                    <View style={s.bentoTextContent}>
                      <Text style={[s.bentoTitle, rtlText]} numberOfLines={2}>
                        {t('home.findCenter')}
                      </Text>
                      <Text style={[s.bentoDesc, rtlText]} numberOfLines={1}>
                        {t('home.centerDesc', 'Centres proches')}
                      </Text>
                    </View>
                  </LinearGradient>
                </AnimCard>
              </View>
            </View>
          </FadeIn>

          {/* ═══════ Health Overview ═══════ */}
          {/* ═══════ Health Reminders (Monthly & Yearly) ═══════ */}
          <FadeIn delay={300}>
            <View style={s.section}>
              <View style={[s.sectionHeaderRow, isRTL && s.rowRTL]}>
                <Text style={s.sectionTitle}>{t('home.remindersTitle')}</Text>
              </View>

              <View style={[s.remindersRow, isRTL && s.rowRTL]}>
                {/* Monthly Self-Check */}
                <View style={[s.reminderCard, s.monthlyCard]}>
                  <View style={s.reminderHeader}>
                    <View style={[s.reminderIconBox, { backgroundColor: '#FFE4E6' }]}>
                      <Ionicons name="finger-print" size={20} color="#E11D48" />
                    </View>
                    <Pressable>
                      <Ionicons name="ellipsis-horizontal" size={18} color="#FDA4AF" />
                    </Pressable>
                  </View>

                  <View style={s.reminderBody}>
                    <Text style={[s.reminderLabel, rtlText]}>
                      {t('home.monthlyCheck', 'Auto-palpation')}
                    </Text>

                    {daysSinceExam !== null ? (
                      <>
                        {daysSinceExam < 30 ? (
                          <View>
                            <Text style={[s.reminderCountBig, { color: '#E11D48' }]}>
                              {30 - daysSinceExam}
                            </Text>
                            <Text style={[s.reminderUnit, rtlText]}>
                              {t('home.daysLeft', 'Jours restants')}
                            </Text>
                          </View>
                        ) : (
                          <View>
                            <Text style={[s.reminderCountBig, { color: '#DC2626' }]}>
                              {daysSinceExam - 30}
                            </Text>
                            <Text style={[s.reminderUnit, rtlText]}>
                              {t('home.daysOverdue', 'Jours de retard')}
                            </Text>
                          </View>
                        )}
                      </>
                    ) : (
                      <View>
                        <Text style={[s.reminderCountBig, { color: '#E11D48', fontSize: 22 }]}>
                          !
                        </Text>
                        <Text style={[s.reminderUnit, rtlText]}>
                          {t('home.startNow', 'Commencer')}
                        </Text>
                      </View>
                    )}

                    <View style={s.progressBarBg}>
                      <View
                        style={[
                          s.progressBarFill,
                          {
                            backgroundColor: '#E11D48',
                            width: daysSinceExam !== null
                              ? `${Math.min(100, Math.max(0, (daysSinceExam / 30) * 100))}%`
                              : '0%'
                          }
                        ]}
                      />
                    </View>
                  </View>
                </View>

                {/* Yearly Clinical Screening */}
                <Pressable onPress={onNavigateToCenters} style={[s.reminderCard, s.yearlyCard]}>
                  <View style={s.reminderHeader}>
                    <View style={[s.reminderIconBox, { backgroundColor: '#E0F2FE' }]}>
                      <Ionicons name="medical" size={20} color="#0284C7" />
                    </View>
                    <Pressable>
                      <Ionicons name="ellipsis-horizontal" size={18} color="#BAE6FD" />
                    </Pressable>
                  </View>

                  <View style={s.reminderBody}>
                    <Text style={[s.reminderLabel, rtlText]}>
                      {t('home.yearlyCheck', 'Examen Clinique')}
                    </Text>

                    {lastScreeningDate ? (
                      (() => {
                        const daysSinceScreening = Math.floor((Date.now() - lastScreeningDate) / (1000 * 60 * 60 * 24));
                        const yearlyTarget = 365;
                        const daysLeft = yearlyTarget - daysSinceScreening;

                        return daysLeft > 0 ? (
                          <View>
                            <Text style={[s.reminderCountBig, { color: '#0284C7' }]}>
                              {daysLeft}
                            </Text>
                            <Text style={[s.reminderUnit, rtlText]}>
                              {t('home.daysLeft', 'Jours restants')}
                            </Text>
                          </View>
                        ) : (
                          <View>
                            <Text style={[s.reminderCountBig, { color: '#DC2626' }]}>
                              {Math.abs(daysLeft)}
                            </Text>
                            <Text style={[s.reminderUnit, rtlText]}>
                              {t('home.daysOverdue', 'Jours de retard')}
                            </Text>
                          </View>
                        );
                      })()
                    ) : (
                      <View>
                        <Text style={[s.reminderCountBig, { color: '#0284C7', fontSize: 22 }]}>
                          !
                        </Text>
                        <Text style={[s.reminderUnit, rtlText]}>
                          {t('home.scheduleNow', 'À planifier')}
                        </Text>
                      </View>
                    )}

                    <View style={s.progressBarBg}>
                      {/* 
                          Progress logic: 
                          If lastScreeningDate exists, calc progress 0-100% of the year.
                        */}
                      <View
                        style={[
                          s.progressBarFill,
                          {
                            backgroundColor: '#0284C7',
                            width: lastScreeningDate
                              ? `${Math.min(100, Math.max(0, ((Date.now() - lastScreeningDate) / (365 * 24 * 60 * 60 * 1000)) * 100))}%`
                              : '0%'
                          }
                        ]}
                      />
                    </View>
                  </View>
                </Pressable>
              </View>
            </View>
          </FadeIn>

          {/* ═══════ Motivation Banner (Glass Style) ═══════ */}
          <FadeIn delay={400}>
            <View style={s.section}>
              <LinearGradient
                colors={['#F3E8FF', '#E9D5FF', '#FAE8FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.banner}
              >
                <View style={[s.bannerContent, isRTL && s.rowRTL]}>
                  <View style={s.bannerIcon}>
                    <Ionicons name="shield-checkmark" size={28} color="#7C3AED" />
                  </View>
                  <View style={s.bannerTextWrap}>
                    <Text style={[s.bannerTitle, rtlText]}>
                      {t('home.motivTitle', 'Santé Préventive')}
                    </Text>
                    <Text style={[s.bannerSub, rtlText]}>
                      {t('home.motivSub', 'La régularité est la clé de la tranquillité.')}
                    </Text>
                  </View>
                </View>
                {/* Decorative sheen */}
                <View style={s.bannerSheen} />
              </LinearGradient>
            </View>
          </FadeIn>

          {/* ═══════ Disclaimer ═══════ */}
          <FadeIn delay={500}>
            <View style={s.footer}>
              <MedicalDisclaimer compact />
            </View>
          </FadeIn>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

/* ================================================================== */
/* Refined Styles                                                     */
/* ================================================================== */

const s = StyleSheet.create({
  /* ---- Layout & Base ---- */
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 40,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PAD,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  headerTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  avatarWrap: {
    position: 'relative',
    ...Platform.select({
      ios: { shadowColor: '#FDA4AF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  avatarGradient: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFF',
  },

  /* ---- Hero Card (The Island) ---- */
  heroContainer: {
    paddingHorizontal: HORIZONTAL_PAD,
    marginBottom: 10,
  },
  heroOuter: {
    borderRadius: 32,
    backgroundColor: '#FFF',
  },
  heroGradient: {
    borderRadius: 32,
    padding: 24,
    minHeight: 200,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  /* Abstract Shapes */
  meshCircle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  meshCircle2: {
    position: 'absolute',
    bottom: -50,
    left: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  meshCircle3: {
    position: 'absolute',
    top: 40,
    right: 60,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroLottie: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 220,
    height: 220,
    opacity: 0.25,
  },

  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  heroContentRTL: {
    flexDirection: 'row-reverse',
  },
  heroLeft: {
    flex: 1.4,
    paddingRight: 10,
  },
  badgePill: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
    marginRight: 6,
  },
  badgeText: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 30,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
    fontWeight: '500',
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    // Soft shadow for button
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  ctaText: {
    color: '#E11D48',
    fontWeight: '800',
    fontSize: 14,
  },
  ctaIconBg: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFE4E6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  heroRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassCircleOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  glassCircleInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingStat: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    alignItems: 'center',
    minWidth: 70,
  },
  floatingStatNum: {
    fontSize: 16,
    fontWeight: '900',
    color: '#E11D48',
  },
  floatingStatLabel: {
    fontSize: 9,
    color: '#881337',
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  /* ---- Bento Grid ---- */
  section: {
    marginTop: 28,
    paddingHorizontal: HORIZONTAL_PAD,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.4,
    marginBottom: 16,
  },
  bentoGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  bentoItem: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: '#FFF',
  },
  bentoGradient: {
    flex: 1,
    borderRadius: 28,
    padding: 18,
    height: 150,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  bentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bentoTextContent: {
    gap: 4,
  },
  bentoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
  },
  bentoDesc: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },

  /* ---- Health Reminders ---- */
  remindersRow: {
    flexDirection: 'row',
    gap: 12,
  },
  reminderCard: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
  },
  monthlyCard: {
    backgroundColor: '#FFF0F5', // Light pink bg
    borderColor: '#FBCFE8',
  },
  yearlyCard: {
    backgroundColor: '#F0F9FF', // Light blue bg
    borderColor: '#BAE6FD',
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reminderIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderBody: {
    gap: 8,
  },
  reminderLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  reminderCountBig: {
    fontSize: 28,
    fontWeight: '800',
    includeFontPadding: false,
    lineHeight: 32,
  },
  reminderUnit: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  /* ---- Stats Row ---- */
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    // Soft drop shadow
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },

  /* ---- Banner ---- */
  banner: {
    borderRadius: 24,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    zIndex: 2,
  },
  bannerIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  bannerTextWrap: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5B21B6',
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 13,
    color: '#6D28D9',
    lineHeight: 18,
  },
  bannerSheen: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.4)',
    zIndex: 1,
  },

  /* ---- Footer ---- */
  footer: {
    marginTop: 32,
    paddingHorizontal: HORIZONTAL_PAD,
    marginBottom: 20,
    opacity: 0.8,
  },
});