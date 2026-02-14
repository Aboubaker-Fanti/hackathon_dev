/**
 * Article Detail Screen
 * Beautiful full article reader with hero header, reading progress,
 * numbered sections, and related articles suggestion
 */

import React, { useState, useRef, useMemo, useCallback } from 'react';
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
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  const accentColor = article
    ? CATEGORY_COLORS[article.category] || colors.primary
    : colors.primary;

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

  if (!article) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>📄</Text>
          <Text style={styles.errorText}>{t('education.articleNotFound')}</Text>
          <TouchableOpacity style={styles.errorButton} onPress={onBack}>
            <Text style={styles.errorButtonText}>{t('common.close')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Reading progress bar */}
      <View style={styles.progressBarContainer}>
        <View
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
          <Text style={styles.backArrow}>{isRTL ? '→' : '←'}</Text>
        </TouchableOpacity>

        <View style={[styles.headerMeta, isRTL && styles.rowReverse]}>
          <View style={[styles.readTimeBadge, { backgroundColor: accentColor + '15' }]}>
            <Text style={styles.readTimeIcon}>🕐</Text>
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
        <View style={[styles.heroSection, { backgroundColor: accentColor }]}>
          {/* Decorative elements */}
          <View style={[styles.heroCircle1, { backgroundColor: 'rgba(255,255,255,0.15)' }]} />
          <View style={[styles.heroCircle2, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
          <View style={[styles.heroCircle3, { backgroundColor: 'rgba(255,255,255,0.08)' }]} />

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
              <View style={[styles.heroMetaItem, isRTL && styles.rowReverse]}>
                <Text style={styles.heroMetaIcon}>📑</Text>
                <Text style={styles.heroMetaText}>
                  {article.contentSections.length} {t('education.sections')}
                </Text>
              </View>
              <View style={styles.heroMetaDot} />
              <View style={[styles.heroMetaItem, isRTL && styles.rowReverse]}>
                <Text style={styles.heroMetaIcon}>🕐</Text>
                <Text style={styles.heroMetaText}>
                  {t('education.duration', { minutes: article.readTimeMinutes })}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ===== Content Sections ===== */}
        <View style={styles.contentArea}>
          {article.contentSections.map((section, index) => (
            <View key={index} style={styles.sectionCard}>
              {/* Section number indicator */}
              <View style={[styles.sectionNumberRow, isRTL && styles.rowReverse]}>
                <View style={[styles.sectionNumber, { backgroundColor: accentColor }]}>
                  <Text style={styles.sectionNumberText}>{index + 1}</Text>
                </View>
                <View style={[styles.sectionNumberLine, { backgroundColor: accentColor + '20' }]} />
              </View>

              {/* Section content */}
              <View style={styles.sectionBody}>
                <Text style={[styles.sectionHeading, isRTL && styles.textRTL]}>
                  {t(section.headingKey)}
                </Text>
                <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
                  {t(section.bodyKey)}
                </Text>
              </View>
            </View>
          ))}

          {/* ===== Medical Disclaimer ===== */}
          <View style={styles.disclaimerSection}>
            <MedicalDisclaimer />
          </View>

          {/* ===== Related Articles ===== */}
          {relatedArticles.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={[styles.relatedTitle, isRTL && styles.textRTL]}>
                {t('education.relatedArticles')}
              </Text>

              {relatedArticles.map((related) => (
                <TouchableOpacity
                  key={related.id}
                  style={[styles.relatedCard, isRTL && styles.rowReverse]}
                  onPress={() => onArticlePress?.(related.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.relatedIconBox,
                      {
                        backgroundColor:
                          (CATEGORY_COLORS[related.category] || colors.primary) + '12',
                      },
                    ]}
                  >
                    <Text style={styles.relatedIconText}>{related.icon}</Text>
                  </View>
                  <View style={styles.relatedTextContent}>
                    <Text
                      style={[styles.relatedCardTitle, isRTL && styles.textRTL]}
                      numberOfLines={2}
                    >
                      {t(related.titleKey)}
                    </Text>
                    <Text style={[styles.relatedCardMeta, isRTL && styles.textRTL]}>
                      {t('education.duration', { minutes: related.readTimeMinutes })}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.relatedArrow,
                      {
                        color: CATEGORY_COLORS[related.category] || colors.primary,
                      },
                    ]}
                  >
                    {isRTL ? '‹' : '›'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Bottom spacing */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    backgroundColor: colors.border,
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backArrow: {
    fontSize: fontSizes.xl,
    color: colors.text,
    fontWeight: fontWeights.medium,
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
    gap: spacing.xs,
  },
  readTimeIcon: {
    fontSize: 14,
  },
  readTimeText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
  },

  // ===== Hero Section =====
  heroSection: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl + spacing.md,
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  heroCircle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  heroCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  heroCircle3: {
    position: 'absolute',
    top: 40,
    left: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  heroContent: {
    zIndex: 1,
  },
  heroCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  heroCategoryIcon: {
    fontSize: 14,
  },
  heroCategoryText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semiBold,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: fontSizes.xxl + 2,
    fontWeight: fontWeights.bold,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
    lineHeight: (fontSizes.xxl + 2) * 1.25,
  },
  heroSummary: {
    fontSize: fontSizes.md,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: fontSizes.md * 1.6,
    marginBottom: spacing.lg,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  heroMetaIcon: {
    fontSize: 14,
  },
  heroMetaText: {
    fontSize: fontSizes.sm,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: fontWeights.medium,
  },
  heroMetaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },

  // ===== Content Sections =====
  contentArea: {
    paddingHorizontal: spacing.lg,
  },
  sectionCard: {
    marginBottom: spacing.lg,
  },
  sectionNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  sectionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionNumberText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: '#FFFFFF',
  },
  sectionNumberLine: {
    flex: 1,
    height: 2,
    borderRadius: 1,
  },
  sectionBody: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeading: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: fontSizes.lg * 1.3,
  },
  sectionText: {
    fontSize: fontSizes.md,
    color: colors.text,
    lineHeight: fontSizes.md * 1.75,
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
  relatedTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  relatedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  relatedIconBox: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  relatedIconText: {
    fontSize: 22,
  },
  relatedTextContent: {
    flex: 1,
  },
  relatedCardTitle: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    color: colors.text,
    marginBottom: 4,
    lineHeight: fontSizes.sm * 1.3,
  },
  relatedCardMeta: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  relatedArrow: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
  },

  // ===== Error State =====
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  errorText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    marginBottom: spacing.lg,
  },
  errorButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
  errorButtonText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
    color: colors.textOnPrimary,
  },

  bottomSpacer: {
    height: spacing.xxl,
  },
});
