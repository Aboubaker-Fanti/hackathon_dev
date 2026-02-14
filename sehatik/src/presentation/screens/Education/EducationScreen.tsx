/**
 * Education Screen — Breast Cancer Awareness Hub
 * "Premium Pink" Redesign with Video Integration
 */

import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Platform,
  Animated,
  Pressable,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore } from '../../../application/store/languageStore';
import { colors } from '../../theme/colors';

/* ------------------------------------------------------------------ */
/* Constants                                                          */
/* ------------------------------------------------------------------ */
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_HORIZONTAL_PAD = 24;

/* ------------------------------------------------------------------ */
/* Image Assets                                                       */
/* ------------------------------------------------------------------ */
const IMAGES = {
  hero: require('../../../../assets/education/hero_awareness.png'),
  earlySigns: require('../../../../assets/education/early_signs.png'),
  mammogram: require('../../../../assets/education/mammogram.png'),
  selfExam: require('../../../../assets/education/self_exam.png'),
  survivalStats: require('../../../../assets/education/survival_stats.png'),
  support: require('../../../../assets/education/support.png'),
  visualExplanation: require('../../../../assets/education/visual_explanation_illustration.png'),
};

/* ------------------------------------------------------------------ */
/* Props                                                              */
/* ------------------------------------------------------------------ */
interface Props {
  onArticlePress?: (articleId: string) => void;
}

/* ------------------------------------------------------------------ */
/* Animated fade-in wrapper                                           */
/* ------------------------------------------------------------------ */
const FadeIn: React.FC<{ delay?: number; children: React.ReactNode }> = ({
  delay = 0,
  children,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

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
/* Pressable card with scale animation                                */
/* ------------------------------------------------------------------ */
const PressCard: React.FC<{
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
}> = ({ children, onPress, style }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.98,
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

  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

/* ================================================================== */
/* Main Component                                                     */
/* ================================================================== */

export const EducationScreen: React.FC<Props> = ({ onArticlePress }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();
  const rtlText = isRTL ? s.textRTL : undefined;

  /* ---- Shocking Facts Data ---- */
  const shockingFacts = [
    {
      icon: '⚡',
      textKey: 'education.awareness.fact1',
      color: colors.primaryDark,
      bgColor: '#FCE4EC',
    },
    {
      icon: '🧬',
      textKey: 'education.awareness.fact2',
      color: '#7C3AED',
      bgColor: '#F3E8FF',
    },
    {
      icon: '🌍',
      textKey: 'education.awareness.fact3',
      color: '#059669',
      bgColor: '#ECFDF5',
    },
    {
      icon: '⏳',
      textKey: 'education.awareness.fact4',
      color: '#B45309',
      bgColor: '#FFFBEB',
    },
  ];

  /* ---- Warning Signs Data ---- */
  const warningSigns = [
    { icon: '🔴', textKey: 'education.awareness.sign1' },
    { icon: '🟠', textKey: 'education.awareness.sign2' },
    { icon: '🟡', textKey: 'education.awareness.sign3' },
    { icon: '🟣', textKey: 'education.awareness.sign4' },
    { icon: '🔵', textKey: 'education.awareness.sign5' },
    { icon: '⚫', textKey: 'education.awareness.sign6' },
  ];

  return (
    <View style={s.root}>
      <SafeAreaView style={s.safe} edges={['top']}>
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
          bounces
        >
          {/* ═══════ HEADER ═══════ */}
          <View style={[s.header, isRTL && s.rowRTL]}>
            <View>
              <Text style={[s.headerTitle, rtlText]}>
                {t('education.title')}
              </Text>
              <Text style={[s.headerSubtitle, rtlText]}>
                {t('education.subtitle')}
              </Text>
            </View>
            <View style={s.headerIcon}>
              <Ionicons name="ribbon" size={28} color={colors.primary} />
            </View>
          </View>

          {/* ═══════ HERO BANNER ═══════ */}
          <FadeIn>
            <PressCard style={s.heroCard} onPress={() => onArticlePress?.('what_is_breast_cancer')}>
              <Image source={IMAGES.hero} style={s.heroImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={s.heroOverlay}
              >
                <View style={s.urgentBadge}>
                  <Text style={s.urgentBadgeText}>
                    {t('education.awareness.urgentBadge')}
                  </Text>
                </View>
                <Text style={[s.heroTitle, rtlText]}>
                  {t('education.awareness.heroTitle')}
                </Text>
              </LinearGradient>
            </PressCard>
          </FadeIn>

          {/* ═══════ VISUAL EXPLANATION (IMAGE) ═══════ */}
          <FadeIn delay={100}>
            <View style={s.section}>
              <View style={[s.sectionHeader, isRTL && s.rowRTL]}>
                <Ionicons name="eye" size={24} color={colors.primary} />
                <Text style={[s.sectionTitle, rtlText]}>
                  Visual Explanation
                </Text>
              </View>

              <PressCard style={s.contentCard} onPress={() => onArticlePress?.('what_is_breast_cancer')}>
                <Image source={IMAGES.visualExplanation} style={s.cardImage} />
              </PressCard>
            </View>
          </FadeIn>

          {/* ═══════ SHOCKING FACTS ═══════ */}
          <FadeIn delay={200}>
            <View style={s.section}>
              <View style={[s.sectionHeader, isRTL && s.rowRTL]}>
                <Ionicons name="information-circle" size={24} color={colors.primary} />
                <Text style={[s.sectionTitle, rtlText]}>
                  {t('education.awareness.factsTitle')}
                </Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[s.factsScroll, isRTL && s.rowRTL]}
                decelerationRate="fast"
                snapToInterval={SCREEN_WIDTH * 0.75 + 16}
              >
                {shockingFacts.map((fact, idx) => (
                  <PressCard key={idx} style={[s.factCard, { backgroundColor: fact.bgColor }]}>
                    <Text style={s.factIcon}>{fact.icon}</Text>
                    <Text style={[s.factText, { color: fact.color }, rtlText]}>
                      {t(fact.textKey)}
                    </Text>
                  </PressCard>
                ))}
              </ScrollView>
            </View>
          </FadeIn>

          {/* ═══════ EARLY SIGNS ═══════ */}
          <FadeIn delay={300}>
            <View style={s.section}>
              <View style={[s.sectionHeader, isRTL && s.rowRTL]}>
                <Ionicons name="warning" size={24} color={colors.warning} />
                <Text style={[s.sectionTitle, rtlText]}>
                  {t('education.awareness.signsTitle')}
                </Text>
              </View>

              <PressCard style={s.contentCard} onPress={() => onArticlePress?.('early_signs')}>
                <Image source={IMAGES.earlySigns} style={s.cardImage} />

                <View style={s.signsGrid}>
                  {warningSigns.map((sign, idx) => (
                    <View key={idx} style={[s.signItem, isRTL && s.rowRTL]}>
                      <Text style={s.signIcon}>{sign.icon}</Text>
                      <Text style={[s.signText, rtlText]}>{t(sign.textKey)}</Text>
                    </View>
                  ))}
                </View>

                <View style={[s.alertBox, isRTL && s.rowRTL]}>
                  <Ionicons name="alert-circle" size={20} color="#D32F2F" />
                  <Text style={[s.alertText, rtlText]}>
                    {t('education.awareness.dontIgnore')}
                  </Text>
                </View>
              </PressCard>
            </View>
          </FadeIn>

          {/* ═══════ SURVIVAL STATS ═══════ */}
          <FadeIn delay={400}>
            <View style={s.section}>
              <View style={[s.sectionHeader, isRTL && s.rowRTL]}>
                <Ionicons name="stats-chart" size={24} color={colors.success} />
                <Text style={[s.sectionTitle, rtlText]}>
                  {t('education.awareness.statsTitle')}
                </Text>
              </View>

              <PressCard style={s.contentCard} onPress={() => onArticlePress?.('treatment_prognosis')}>
                <Image source={IMAGES.survivalStats} style={s.cardImage} />
                <View style={s.cardContent}>
                  <Text style={[s.cardCaption, rtlText]}>
                    {t('education.awareness.statsMessage')}
                  </Text>
                </View>
              </PressCard>
            </View>
          </FadeIn>

          {/* ═══════ REAL STORIES ═══════ */}
          <FadeIn delay={500}>
            <View style={s.section}>
              <View style={[s.sectionHeader, isRTL && s.rowRTL]}>
                <Ionicons name="heart" size={24} color={colors.primary} />
                <Text style={[s.sectionTitle, rtlText]}>
                  {t('education.awareness.storiesTitle')}
                </Text>
              </View>

              <PressCard style={s.contentCard} onPress={() => onArticlePress?.('real_stories')}>
                {/* Fatima */}
                <View style={[s.storyItem, isRTL && s.rowRTL]}>
                  <View style={[s.storyAvatar, { backgroundColor: '#E8F5E9' }]}>
                    <Text style={{ fontSize: 18 }}>👩🏽</Text>
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <View style={[s.storyHeaderRow, isRTL && s.rowRTL]}>
                      <Text style={[s.storyName, rtlText]}>{t('education.awareness.story1Name')}</Text>
                      <View style={[s.badge, { backgroundColor: '#E8F5E9' }]}>
                        <Text style={[s.badgeText, { color: '#2E7D32' }]}>{t('education.awareness.story1Badge')}</Text>
                      </View>
                    </View>
                    <Text style={[s.storyText, rtlText]} numberOfLines={3}>
                      {t('education.awareness.story1Text')}
                    </Text>
                  </View>
                </View>

                <View style={s.divider} />

                {/* Khadija */}
                <View style={[s.storyItem, isRTL && s.rowRTL]}>
                  <View style={[s.storyAvatar, { backgroundColor: '#FFHBEE' }]}>
                    <Text style={{ fontSize: 18 }}>👵🏽</Text>
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <View style={[s.storyHeaderRow, isRTL && s.rowRTL]}>
                      <Text style={[s.storyName, rtlText]}>{t('education.awareness.story2Name')}</Text>
                      <View style={[s.badge, { backgroundColor: '#FFEBEE' }]}>
                        <Text style={[s.badgeText, { color: '#C62828' }]}>{t('education.awareness.story2Badge')}</Text>
                      </View>
                    </View>
                    <Text style={[s.storyText, rtlText]} numberOfLines={3}>
                      {t('education.awareness.story2Text')}
                    </Text>
                  </View>
                </View>
              </PressCard>
            </View>
          </FadeIn>

          {/* ═══════ CTA SECTION ═══════ */}
          <FadeIn delay={600}>
            <View style={s.ctaContainer}>
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.ctaGradient}
              >
                <Text style={[s.ctaTitle, rtlText]}>
                  {t('education.awareness.ctaTitle')}
                </Text>
                <Text style={[s.ctaSubtitle, rtlText]}>
                  {t('education.awareness.ctaSubtitle')}
                </Text>

                <TouchableOpacity
                  style={s.ctaButton}
                  onPress={() => onArticlePress?.('early_detection')}
                  activeOpacity={0.9}
                >
                  <Text style={s.ctaButtonText}>
                    {t('education.awareness.bookScreening')}
                  </Text>
                  <Ionicons name={isRTL ? "arrow-back" : "arrow-forward"} size={20} color={colors.primary} />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </FadeIn>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

/* ================================================================== */
/* Styles                                                             */
/* ================================================================== */

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundPink, // Soft pink background
  },
  safe: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 24,
  },
  textRTL: {
    textAlign: 'right' as const,
    writingDirection: 'rtl' as const,
  },
  rowRTL: {
    flexDirection: 'row-reverse' as const,
  },

  /* ---- Header ---- */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: CARD_HORIZONTAL_PAD,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  /* ---- Hero ---- */
  heroCard: {
    marginHorizontal: CARD_HORIZONTAL_PAD,
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    justifyContent: 'flex-end',
    padding: 20,
  },
  urgentBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  urgentBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
    lineHeight: 28,
  },

  /* ---- Sections ---- */
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: CARD_HORIZONTAL_PAD,
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },

  /* ---- Video ---- */
  videoCard: {
    marginHorizontal: CARD_HORIZONTAL_PAD,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  video: {
    width: '100%',
    height: '100%',
  },

  /* ---- Facts ---- */
  factsScroll: {
    paddingHorizontal: CARD_HORIZONTAL_PAD,
    gap: 12,
  },
  factCard: {
    width: SCREEN_WIDTH * 0.75,
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  factIcon: {
    fontSize: 32,
  },
  factText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },

  /* ---- Content Cards (White) ---- */
  contentCard: {
    marginHorizontal: CARD_HORIZONTAL_PAD,
    backgroundColor: colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  cardImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  cardCaption: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 20,
    textAlign: 'center',
  },

  /* ---- Signs Grid ---- */
  signsGrid: {
    padding: 16,
    gap: 8,
  },
  signItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  signIcon: {
    fontSize: 16,
  },
  signText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    margin: 16,
    marginTop: 0,
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  alertText: {
    flex: 1,
    color: '#C62828',
    fontSize: 13,
    fontWeight: '700',
  },

  /* ---- Stories ---- */
  storyItem: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  storyAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  storyName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  storyText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 16,
  },

  /* ---- CTA ---- */
  ctaContainer: {
    marginHorizontal: CARD_HORIZONTAL_PAD,
    marginTop: 32,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  ctaGradient: {
    padding: 32,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ctaButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
