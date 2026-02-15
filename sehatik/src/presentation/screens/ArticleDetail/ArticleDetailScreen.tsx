/**
 * Article Detail Screen
 * Modern full article reader with hero header, reading progress,
 * glassmorphism-style cards, floating "Listen" FAB, and related articles
 */

import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Easing,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore } from '../../../application/store/languageStore';
import { MedicalDisclaimer } from '../../components/common/MedicalDisclaimer';
import {
  getArticleById,
  getArticlesByCategory,
  EDUCATION_ARTICLES,
  type Article,
} from '../../../infrastructure/data/educationContent';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, MIN_TOUCH_TARGET } from '../../theme/spacing';
import { fontSizes, fontWeights } from '../../theme/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/** Category color mapping */
const CATEGORY_COLORS: Record<string, string> = {
  whatIs: colors.primary,
  detection: colors.success,
  signs: colors.warning,
  treatment: colors.secondary,
  stories: '#E91E63',
  myths: '#E67E22',
  faq: '#6C5CE7',
};

const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  whatIs: [colors.primary, colors.primaryDark],
  detection: ['#4CAF50', '#2E7D32'],
  signs: ['#FF9800', '#E65100'],
  treatment: ['#424242', '#212121'],
  stories: ['#E91E63', '#AD1457'],
  myths: ['#E67E22', '#D35400'],
  faq: ['#6C5CE7', '#4A3DB8'],
};

const CATEGORY_ICONS: Record<string, string> = {
  whatIs: '🎗️',
  detection: '🔍',
  signs: '⚠️',
  treatment: '💊',
  stories: '💬',
  myths: '🚫',
  faq: '❓',
};

interface Props {
  articleId: string;
  onBack: () => void;
  onArticlePress?: (articleId: string) => void;
}

/* ------------------------------------------------------------------ */
/* Waveform Bar (single animated bar)                                  */
/* ------------------------------------------------------------------ */
const WaveBar: React.FC<{ color: string; delay: number; isPlaying: boolean }> = ({ color, delay, isPlaying }) => {
  const height = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    if (isPlaying) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(height, {
            toValue: 20 + Math.random() * 12,
            duration: 300 + Math.random() * 200,
            delay,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(height, {
            toValue: 6 + Math.random() * 6,
            duration: 300 + Math.random() * 200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      );
      anim.start();
      return () => anim.stop();
    } else {
      Animated.timing(height, {
        toValue: 8,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isPlaying]);

  return (
    <Animated.View
      style={{
        width: 3,
        height,
        borderRadius: 1.5,
        backgroundColor: color,
        marginHorizontal: 1.5,
      }}
    />
  );
};

/* ------------------------------------------------------------------ */
/* Audio Player Bar                                                    */
/* ------------------------------------------------------------------ */
type PlayerState = 'hidden' | 'mini' | 'expanded';

const AudioPlayerBar: React.FC<{
  accentColor: string;
  isRTL: boolean;
  articleTitle: string;
  totalMinutes: number;
  playerState: PlayerState;
  onChangeState: (state: PlayerState) => void;
}> = ({ accentColor, isRTL, articleTitle, totalMinutes, playerState, onChangeState }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const expandAnim = useRef(new Animated.Value(300)).current;
  const miniAnim = useRef(new Animated.Value(100)).current;
  const progressRef = useRef<Animated.CompositeAnimation | null>(null);
  const totalSeconds = totalMinutes * 60;
  const WAVE_COUNT = 20;

  // Animate based on state
  useEffect(() => {
    if (playerState === 'expanded') {
      Animated.parallel([
        Animated.spring(expandAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 22,
          stiffness: 180,
        }),
        Animated.timing(miniAnim, {
          toValue: 100,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (playerState === 'mini') {
      Animated.parallel([
        Animated.timing(expandAnim, {
          toValue: 300,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(miniAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 22,
          stiffness: 180,
        }),
      ]).start();
    } else {
      // hidden
      Animated.parallel([
        Animated.timing(expandAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(miniAnim, {
          toValue: 100,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Reset progress when fully hidden
        setIsPlaying(false);
        progress.setValue(0);
      });
    }
  }, [playerState]);

  // Fake progress animation
  useEffect(() => {
    if (isPlaying) {
      progressRef.current = Animated.timing(progress, {
        toValue: 1,
        duration: totalSeconds * 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      });
      progressRef.current.start(({ finished }) => {
        if (finished) setIsPlaying(false);
      });
    } else {
      progressRef.current?.stop();
    }
    return () => progressRef.current?.stop();
  }, [isPlaying]);

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

  const handleRewind = useCallback(() => {
    progress.setValue(0);
    if (isPlaying) {
      progressRef.current?.stop();
      progressRef.current = Animated.timing(progress, {
        toValue: 1,
        duration: totalSeconds * 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      });
      progressRef.current.start(({ finished }) => {
        if (finished) setIsPlaying(false);
      });
    }
  }, [isPlaying, totalSeconds]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const elapsedText = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, totalSeconds],
  });

  if (playerState === 'hidden') return null;

  return (
    <>
      {/* ===== Mini Player Bar ===== */}
      <Animated.View
        style={[
          styles.miniPlayerContainer,
          { transform: [{ translateY: miniAnim }] },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => onChangeState('expanded')}
          style={[styles.miniPlayerBar, { borderTopColor: accentColor + '30' }]}
        >
          {/* Mini progress at top */}
          <View style={styles.miniProgressTrack}>
            <Animated.View
              style={[
                styles.miniProgressFill,
                {
                  backgroundColor: accentColor,
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          <View style={[styles.miniContent, isRTL && styles.rowReverse]}>
            <View style={[styles.miniIconCircle, { backgroundColor: accentColor }]}>
              <Ionicons name="headset" size={16} color="#FFF" />
            </View>
            <Text style={[styles.miniTitle, isRTL && styles.textRTL]} numberOfLines={1}>
              {articleTitle}
            </Text>
            <TouchableOpacity onPress={togglePlay} style={[styles.miniPlayBtn, { backgroundColor: accentColor }]}>
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={18} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onChangeState('hidden')} style={styles.miniCloseBtn}>
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* ===== Expanded Player ===== */}
      <Animated.View
        style={[
          styles.playerContainer,
          { transform: [{ translateY: expandAnim }] },
        ]}
      >
        <View style={[styles.playerBar, { borderTopColor: accentColor + '30' }]}>
          {/* Top drag handle */}
          <View style={styles.playerHandle} />

          {/* Title row */}
          <View style={[styles.playerTitleRow, isRTL && styles.rowReverse]}>
            <View style={[styles.playerIconCircle, { backgroundColor: accentColor }]}>
              <Ionicons name="headset" size={18} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.playerNowPlaying, isRTL && styles.textRTL]} numberOfLines={1}>
                Now Playing
              </Text>
              <Text style={[styles.playerTitle, isRTL && styles.textRTL]} numberOfLines={1}>
                {articleTitle}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => onChangeState('mini')}
              style={styles.playerCloseBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="chevron-down" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Waveform visualization */}
          <View style={styles.waveformContainer}>
            {Array.from({ length: WAVE_COUNT }).map((_, i) => (
              <WaveBar
                key={i}
                color={isPlaying ? accentColor : colors.textLight}
                delay={i * 40}
                isPlaying={isPlaying}
              />
            ))}
          </View>

          {/* Progress track */}
          <View style={styles.progressTrackWrapper}>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: accentColor,
                    width: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.progressKnob,
                  {
                    backgroundColor: accentColor,
                    left: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <View style={[styles.timeRow, isRTL && styles.rowReverse]}>
              <AnimatedTimeText value={elapsedText} formatter={formatTime} style={styles.timeText} />
              <Text style={styles.timeText}>{formatTime(totalSeconds)}</Text>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controlsRow}>
            <TouchableOpacity onPress={handleRewind} style={styles.controlBtn}>
              <Ionicons name="play-back" size={22} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={togglePlay}
              style={[styles.playPauseBtn, { backgroundColor: accentColor }]}
              activeOpacity={0.85}
            >
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlBtn}>
              <Ionicons name="play-forward" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Animated time display                                               */
/* ------------------------------------------------------------------ */
const AnimatedTimeText: React.FC<{
  value: Animated.AnimatedInterpolation<number>;
  formatter: (v: number) => string;
  style: any;
}> = ({ value, formatter, style }) => {
  const [display, setDisplay] = useState('0:00');

  useEffect(() => {
    const id = value.addListener(({ value: v }) => {
      setDisplay(formatter(v));
    });
    return () => value.removeListener(id);
  }, [value, formatter]);

  return <Text style={style}>{display}</Text>;
};

export const ArticleDetailScreen: React.FC<Props> = ({
  articleId,
  onBack,
  onArticlePress,
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();
  const article = getArticleById(articleId);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [readProgress, setReadProgress] = useState(0);
  const [playerState, setPlayerState] = useState<PlayerState>('hidden');

  // Fade-in animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 90,
      }),
    ]).start();
  }, []);

  const accentColor = article
    ? CATEGORY_COLORS[article.category] || colors.primary
    : colors.primary;

  const gradient = article
    ? CATEGORY_GRADIENTS[article.category] || [colors.primary, colors.primaryDark]
    : [colors.primary, colors.primaryDark];

  // Related articles: same category, excluding current
  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return getArticlesByCategory(article.category)
      .filter((a) => a.id !== article.id)
      .slice(0, 3);
  }, [article]);

  // Track reading progress
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const totalScrollable = contentSize.height - layoutMeasurement.height;
      if (totalScrollable > 0) {
        const progress = Math.min(contentOffset.y / totalScrollable, 1);
        setReadProgress(progress);
      }
    },
    [],
  );

  const handleListenPress = useCallback(() => {
    setPlayerState('expanded');
  }, []);

  if (!article) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <Ionicons name="document-text-outline" size={48} color={colors.textSecondary} />
          </View>
          <Text style={styles.errorText}>{t('education.articleNotFound')}</Text>
          <TouchableOpacity style={styles.errorButton} onPress={onBack}>
            <Text style={styles.errorButtonText}>{t('common.close')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Reading progress bar */}
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: `${readProgress * 100}%`,
                backgroundColor: accentColor,
              },
            ]}
          />
        </View>

        {/* Header with back button */}
        <View style={[styles.header, isRTL && styles.headerRTL]}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            accessibilityLabel={t('common.close')}
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={22} color={colors.text} />
          </TouchableOpacity>

          <View style={[styles.headerMeta, isRTL && styles.rowReverse]}>
            <View style={[styles.readTimeBadge, { backgroundColor: accentColor + '15' }]}>
              <Ionicons name="time-outline" size={14} color={accentColor} />
              <Text style={[styles.readTimeText, { color: accentColor }]}>
                {t('education.duration', { minutes: article.readTimeMinutes })}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* ===== Hero Section ===== */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <LinearGradient
              colors={gradient as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroSection}
            >
              {/* Decorative elements */}
              <View style={[styles.heroCircle1, { backgroundColor: 'rgba(255,255,255,0.12)' }]} />
              <View style={[styles.heroCircle2, { backgroundColor: 'rgba(255,255,255,0.08)' }]} />
              <View style={[styles.heroCircle3, { backgroundColor: 'rgba(255,255,255,0.06)' }]} />
              <View style={[styles.heroCircle4, { backgroundColor: 'rgba(255,255,255,0.04)' }]} />

              <View style={styles.heroContent}>
                {/* Category badge */}
                <View style={[styles.heroCategoryBadge, isRTL && styles.rowReverse]}>
                  <Text style={styles.heroCategoryIcon}>
                    {CATEGORY_ICONS[article.category] || '📄'}
                  </Text>
                  <Text style={styles.heroCategoryText}>
                    {t(`education.categories.${article.category}`)}
                  </Text>
                </View>

                {/* Article icon */}
                <Text style={styles.heroIcon}>{article.icon}</Text>

                {/* Title */}
                <Text style={[styles.heroTitle, isRTL && styles.textRTL]}>
                  {t(article.titleKey)}
                </Text>

                {/* Summary */}
                <Text style={[styles.heroSummary, isRTL && styles.textRTL]}>
                  {t(article.summaryKey)}
                </Text>

                {/* Metadata row */}
                <View style={[styles.heroMetaRow, isRTL && styles.rowReverse]}>
                  <View style={[styles.heroMetaPill, isRTL && styles.rowReverse]}>
                    <Ionicons name="layers-outline" size={14} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.heroMetaText}>
                      {article.contentSections.length} {t('education.sections')}
                    </Text>
                  </View>
                  <View style={[styles.heroMetaPill, isRTL && styles.rowReverse]}>
                    <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.heroMetaText}>
                      {t('education.duration', { minutes: article.readTimeMinutes })}
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* ===== Content Sections ===== */}
          <View style={styles.contentArea}>
            {article.contentSections.map((section, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.sectionCard,
                  {
                    opacity: fadeAnim,
                    transform: [{
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 30],
                        outputRange: [0, 30 + index * 10],
                      }),
                    }],
                  },
                ]}
              >
                {/* Timeline connector */}
                <View style={[styles.timelineContainer, isRTL && styles.rowReverse]}>
                  <View style={styles.timelineTrack}>
                    <View style={[styles.sectionNumber, { backgroundColor: accentColor }]}>
                      <Text style={styles.sectionNumberText}>{index + 1}</Text>
                    </View>
                    {index < article.contentSections.length - 1 && (
                      <View style={[styles.timelineLine, { backgroundColor: accentColor + '25' }]} />
                    )}
                  </View>

                  {/* Section content card */}
                  <View style={styles.sectionBodyWrapper}>
                    <View style={[styles.sectionBody, { borderLeftColor: accentColor + '40' }]}>
                      <Text style={[styles.sectionHeading, isRTL && styles.textRTL]}>
                        {t(section.headingKey)}
                      </Text>
                      <View style={[styles.sectionDivider, { backgroundColor: accentColor + '20' }]} />
                      <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
                        {t(section.bodyKey)}
                      </Text>
                    </View>
                  </View>
                </View>
              </Animated.View>
            ))}

            {/* ===== Medical Disclaimer ===== */}
            <View style={styles.disclaimerSection}>
              <MedicalDisclaimer />
            </View>

            {/* ===== Related Articles ===== */}
            {relatedArticles.length > 0 && (
              <View style={styles.relatedSection}>
                <View style={[styles.relatedHeader, isRTL && styles.rowReverse]}>
                  <Ionicons name="book-outline" size={20} color={accentColor} />
                  <Text style={[styles.relatedTitle, isRTL && styles.textRTL]}>
                    {t('education.relatedArticles')}
                  </Text>
                </View>

                {relatedArticles.map((related) => {
                  const relatedColor = CATEGORY_COLORS[related.category] || colors.primary;
                  return (
                    <TouchableOpacity
                      key={related.id}
                      style={[styles.relatedCard, isRTL && styles.rowReverse]}
                      onPress={() => onArticlePress?.(related.id)}
                      activeOpacity={0.7}
                    >
                      <LinearGradient
                        colors={[relatedColor + '18', relatedColor + '08']}
                        style={styles.relatedIconBox}
                      >
                        <Text style={styles.relatedIconText}>{related.icon}</Text>
                      </LinearGradient>
                      <View style={styles.relatedTextContent}>
                        <Text
                          style={[styles.relatedCardTitle, isRTL && styles.textRTL]}
                          numberOfLines={2}
                        >
                          {t(related.titleKey)}
                        </Text>
                        <View style={[styles.relatedMetaRow, isRTL && styles.rowReverse]}>
                          <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
                          <Text style={[styles.relatedCardMeta, isRTL && styles.textRTL]}>
                            {t('education.duration', { minutes: related.readTimeMinutes })}
                          </Text>
                        </View>
                      </View>
                      <View style={[styles.relatedArrowCircle, { backgroundColor: relatedColor + '12' }]}>
                        <Ionicons
                          name={isRTL ? 'chevron-back' : 'chevron-forward'}
                          size={18}
                          color={relatedColor}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Bottom spacing for FAB */}
            <View style={styles.bottomSpacer} />
          </View>
        </ScrollView>

        {/* ===== Floating Listen Button ===== */}
        {playerState === 'hidden' && (
          <TouchableOpacity
            style={[styles.listenFab, { backgroundColor: accentColor }, isRTL ? { left: 20 } : { right: 20 }]}
            activeOpacity={0.85}
            onPress={handleListenPress}
          >
            <Ionicons name="headset-outline" size={24} color="#FFF" />
            <Text style={styles.listenFabLabel}>Listen</Text>
          </TouchableOpacity>
        )}

        {/* ===== Audio Player Bar ===== */}
        <AudioPlayerBar
          accentColor={accentColor}
          isRTL={isRTL}
          articleTitle={article ? t(article.titleKey) : ''}
          totalMinutes={article?.readTimeMinutes || 5}
          playerState={playerState}
          onChangeState={setPlayerState}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPink,
  },
  scrollContent: {
    flexGrow: 1,
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },

  // ===== Progress Bar =====
  progressBarContainer: {
    height: 3,
    backgroundColor: colors.border + '60',
  },
  progressBar: {
    height: 3,
    borderRadius: 2,
  },

  // ===== Header =====
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  readTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.round,
    gap: 6,
  },
  readTimeText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
  },

  // ===== Hero Section =====
  heroSection: {
    paddingTop: spacing.lg + 4,
    paddingBottom: spacing.xl + spacing.md,
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.md,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  heroCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  heroCircle2: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  heroCircle3: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  heroCircle4: {
    position: 'absolute',
    bottom: 20,
    right: 60,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  heroContent: {
    zIndex: 1,
  },
  heroCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.sm + 6,
    paddingVertical: spacing.xs + 3,
    gap: spacing.xs,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  heroCategoryIcon: {
    fontSize: 14,
  },
  heroCategoryText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semiBold,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroIcon: {
    fontSize: 52,
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  heroSummary: {
    fontSize: fontSizes.md,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: fontSizes.md * 1.7,
    marginBottom: spacing.lg,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  heroMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.round,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  heroMetaText: {
    fontSize: fontSizes.xs + 1,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: fontWeights.medium,
  },

  // ===== Content Sections =====
  contentArea: {
    paddingHorizontal: spacing.lg,
  },
  sectionCard: {
    marginBottom: spacing.md,
  },
  timelineContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  timelineTrack: {
    alignItems: 'center',
    width: 36,
  },
  sectionNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  sectionNumberText: {
    fontSize: fontSizes.sm,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  timelineLine: {
    width: 2.5,
    flex: 1,
    marginTop: 6,
    borderRadius: 2,
  },
  sectionBodyWrapper: {
    flex: 1,
    paddingBottom: spacing.sm,
  },
  sectionBody: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: colors.border + '60',
    borderLeftWidth: 4,
  },
  sectionDivider: {
    height: 2,
    borderRadius: 1,
    marginBottom: spacing.md,
    width: 40,
  },
  sectionHeading: {
    fontSize: fontSizes.lg + 1,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: (fontSizes.lg + 1) * 1.35,
    letterSpacing: -0.2,
  },
  sectionText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    lineHeight: fontSizes.md * 1.8,
    letterSpacing: 0.1,
  },

  // ===== Disclaimer =====
  disclaimerSection: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },

  // ===== Related Articles =====
  relatedSection: {
    marginBottom: spacing.lg,
  },
  relatedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.md,
  },
  relatedTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.2,
  },
  relatedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
    gap: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: colors.border + '50',
  },
  relatedIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  relatedIconText: {
    fontSize: 24,
  },
  relatedTextContent: {
    flex: 1,
    gap: 4,
  },
  relatedCardTitle: {
    fontSize: fontSizes.sm + 1,
    fontWeight: fontWeights.semiBold,
    color: colors.text,
    lineHeight: (fontSizes.sm + 1) * 1.35,
  },
  relatedMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  relatedCardMeta: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  relatedArrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ===== Listen FAB =====
  listenFab: {
    position: 'absolute',
    bottom: 28,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    gap: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  listenFabLabel: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // ===== Mini Player Bar =====
  miniPlayerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 200,
  },
  miniPlayerBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  miniProgressTrack: {
    height: 3,
    backgroundColor: colors.border,
  },
  miniProgressFill: {
    height: 3,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  miniContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  miniIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  miniPlayBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ===== Audio Player Bar (Expanded) =====
  playerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 201,
  },
  playerBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  playerHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 12,
  },
  playerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  playerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerNowPlaying: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  playerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  playerCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    marginBottom: 12,
  },
  progressTrackWrapper: {
    marginBottom: 12,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'visible',
    position: 'relative',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  progressKnob: {
    width: 14,
    height: 14,
    borderRadius: 7,
    position: 'absolute',
    top: -5,
    marginLeft: -7,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  // ===== Error State =====
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorIconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  errorText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    marginBottom: spacing.lg,
    lineHeight: fontSizes.md * 1.5,
  },
  errorButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.lg + 4,
    paddingVertical: spacing.sm + 4,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  errorButtonText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
    color: colors.textOnPrimary,
  },

  bottomSpacer: {
    height: 100, // Extra space for FAB
  },
});
