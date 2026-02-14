/**
 * Education Screen - Hub for breast health learning
 * Beautiful, user-friendly design with featured articles,
 * search, category filters, and polished article cards
 */

import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguageStore } from '../../../application/store/languageStore';
import {
  EDUCATION_ARTICLES,
  getArticlesByCategory,
  type Article,
} from '../../../infrastructure/data/educationContent';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, MIN_TOUCH_TARGET } from '../../theme/spacing';
import { fontSizes, fontWeights } from '../../theme/typography';

interface Props {
  onArticlePress?: (articleId: string) => void;
}

const CATEGORIES = [
  { id: 'all', titleKey: 'education.categories.all', icon: '📚', color: '#6C5CE7', bgColor: '#6C5CE710' },
  { id: 'whatIs', titleKey: 'education.categories.whatIs', icon: '🎗️', color: colors.primary, bgColor: colors.primary + '10' },
  { id: 'detection', titleKey: 'education.categories.detection', icon: '🔍', color: colors.success, bgColor: colors.success + '10' },
  { id: 'signs', titleKey: 'education.categories.signs', icon: '⚠️', color: colors.warning, bgColor: colors.warning + '10' },
  { id: 'treatment', titleKey: 'education.categories.treatment', icon: '💊', color: colors.secondary, bgColor: colors.secondary + '10' },
  { id: 'stories', titleKey: 'education.categories.stories', icon: '💬', color: '#E91E63', bgColor: '#E91E6310' },
  { id: 'myths', titleKey: 'education.categories.myths', icon: '🚫', color: '#E67E22', bgColor: '#E67E2210' },
  { id: 'faq', titleKey: 'education.categories.faq', icon: '❓', color: '#6C5CE7', bgColor: '#6C5CE710' },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FEATURED_CARD_WIDTH = SCREEN_WIDTH - spacing.lg * 2;

/** Pick a few featured articles to highlight at the top */
const FEATURED_IDS = ['what_is_breast_cancer', 'early_detection', 'early_signs'];

export const EducationScreen: React.FC<Props> = ({ onArticlePress }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Featured articles
  const featuredArticles = useMemo(
    () => EDUCATION_ARTICLES.filter((a) => FEATURED_IDS.includes(a.id)),
    [],
  );

  // Filtered articles based on category + search
  const filteredArticles = useMemo(() => {
    let articles =
      selectedCategory === 'all'
        ? EDUCATION_ARTICLES
        : getArticlesByCategory(selectedCategory);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      articles = articles.filter(
        (a) =>
          t(a.titleKey).toLowerCase().includes(query) ||
          t(a.summaryKey).toLowerCase().includes(query),
      );
    }

    return articles;
  }, [selectedCategory, searchQuery, t]);

  // Article count per category
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return EDUCATION_ARTICLES.length;
    return getArticlesByCategory(categoryId).length;
  };

  const getCategoryMeta = (categoryId: string) => {
    return CATEGORIES.find((c) => c.id === categoryId);
  };

  // ---- Render Functions ----

  const renderFeaturedCard = ({ item, index }: { item: Article; index: number }) => {
    const category = getCategoryMeta(item.category);
    const gradientColors = [
      { from: '#FF6B9D', to: '#FF8FB5' },
      { from: '#9B59B6', to: '#B07CC6' },
      { from: '#27AE60', to: '#2ECC71' },
    ];
    const gradient = gradientColors[index % gradientColors.length];

    return (
      <TouchableOpacity
        style={[styles.featuredCard, { backgroundColor: gradient.from }]}
        onPress={() => onArticlePress?.(item.id)}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={t(item.titleKey)}
      >
        {/* Decorative circles */}
        <View style={[styles.featuredCircle1, { backgroundColor: gradient.to }]} />
        <View style={[styles.featuredCircle2, { backgroundColor: gradient.to }]} />

        <View style={styles.featuredContent}>
          {/* Category badge */}
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeIcon}>{category?.icon}</Text>
            <Text style={styles.featuredBadgeText}>{t(category?.titleKey || '')}</Text>
          </View>

          {/* Title & Summary */}
          <Text style={[styles.featuredTitle, isRTL && styles.textRTL]} numberOfLines={2}>
            {t(item.titleKey)}
          </Text>
          <Text style={[styles.featuredSummary, isRTL && styles.textRTL]} numberOfLines={2}>
            {t(item.summaryKey)}
          </Text>

          {/* Read time & CTA */}
          <View style={[styles.featuredFooter, isRTL && styles.rowReverse]}>
            <View style={styles.featuredReadTime}>
              <Text style={styles.featuredReadTimeIcon}>🕐</Text>
              <Text style={styles.featuredReadTimeText}>
                {t('education.duration', { minutes: item.readTimeMinutes })}
              </Text>
            </View>
            <View style={styles.featuredCTA}>
              <Text style={styles.featuredCTAText}>{t('education.readArticle')}</Text>
              <Text style={styles.featuredCTAArrow}>{isRTL ? '←' : '→'}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderArticleCard = ({ item, index }: { item: Article; index: number }) => {
    const category = getCategoryMeta(item.category);
    const accentColor = category?.color || colors.primary;

    return (
      <TouchableOpacity
        style={[styles.articleCard]}
        onPress={() => onArticlePress?.(item.id)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={t(item.titleKey)}
      >
        {/* Left accent bar */}
        <View style={[styles.articleAccent, { backgroundColor: accentColor }]} />

        <View style={[styles.articleInner, isRTL && styles.rowReverse]}>
          {/* Icon container */}
          <View style={[styles.articleIconBox, { backgroundColor: accentColor + '12' }]}>
            <Text style={styles.articleIconText}>{item.icon}</Text>
          </View>

          {/* Text content */}
          <View style={styles.articleTextContent}>
            {/* Category tag */}
            <View style={[styles.articleCategoryTag, isRTL && styles.rowReverse]}>
              <View style={[styles.articleCategoryDot, { backgroundColor: accentColor }]} />
              <Text style={[styles.articleCategoryLabel, { color: accentColor }]}>
                {t(category?.titleKey || '')}
              </Text>
            </View>

            <Text
              style={[styles.articleTitle, isRTL && styles.textRTL]}
              numberOfLines={2}
            >
              {t(item.titleKey)}
            </Text>
            <Text
              style={[styles.articleSummary, isRTL && styles.textRTL]}
              numberOfLines={2}
            >
              {t(item.summaryKey)}
            </Text>

            {/* Footer */}
            <View style={[styles.articleFooter, isRTL && styles.rowReverse]}>
              <View style={[styles.articleReadTime, isRTL && styles.rowReverse]}>
                <Text style={styles.articleReadTimeIcon}>🕐</Text>
                <Text style={styles.articleReadTimeText}>
                  {t('education.duration', { minutes: item.readTimeMinutes })}
                </Text>
              </View>
              <Text style={styles.articleSections}>
                {item.contentSections.length} {t('education.sections')}
              </Text>
            </View>
          </View>

          {/* Arrow */}
          <View style={styles.articleArrowContainer}>
            <Text style={[styles.articleArrow, { color: accentColor }]}>
              {isRTL ? '‹' : '›'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        {/* ===== Header ===== */}
        <View style={styles.header}>
          <View style={[styles.headerTop, isRTL && styles.rowReverse]}>
            <View style={styles.headerTextBlock}>
              <Text style={[styles.headerTitle, isRTL && styles.textRTL]}>
                {t('education.title')}
              </Text>
              <Text style={[styles.headerSubtitle, isRTL && styles.textRTL]}>
                {t('education.subtitle')}
              </Text>
            </View>
            <View style={styles.headerIconContainer}>
              <Text style={styles.headerIcon}>📚</Text>
            </View>
          </View>

          {/* Article count */}
          <View style={[styles.statsRow, isRTL && styles.rowReverse]}>
            <View style={styles.statBadge}>
              <Text style={styles.statNumber}>{EDUCATION_ARTICLES.length}</Text>
              <Text style={styles.statLabel}>{t('education.articles')}</Text>
            </View>
            <View style={styles.statBadge}>
              <Text style={styles.statNumber}>{CATEGORIES.length - 1}</Text>
              <Text style={styles.statLabel}>{t('education.topics')}</Text>
            </View>
            <View style={styles.statBadge}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>{t('education.languages')}</Text>
            </View>
          </View>
        </View>

        {/* ===== Search Bar ===== */}
        <View style={styles.searchSection}>
          <View style={[
            styles.searchContainer,
            isSearchFocused && styles.searchContainerFocused,
            isRTL && styles.rowReverse,
          ]}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={[styles.searchInput, isRTL && styles.textRTL]}
              placeholder={t('education.searchPlaceholder')}
              placeholderTextColor={colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              returnKeyType="search"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.searchClear}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.searchClearText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ===== Featured Section (only if no search query) ===== */}
        {!searchQuery.trim() && selectedCategory === 'all' && (
          <View style={styles.featuredSection}>
            <View style={[styles.sectionHeader, isRTL && styles.rowReverse]}>
              <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
                {t('education.featured')}
              </Text>
              <View style={styles.sectionTitleAccent} />
            </View>
            <FlatList
              data={featuredArticles}
              renderItem={renderFeaturedCard}
              keyExtractor={(item) => `featured-${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
              snapToInterval={FEATURED_CARD_WIDTH + spacing.md}
              decelerationRate="fast"
              pagingEnabled={false}
            />
          </View>
        )}

        {/* ===== Category Filters ===== */}
        <View style={styles.categorySection}>
          <View style={[styles.sectionHeader, isRTL && styles.rowReverse]}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t('education.categories.title')}
            </Text>
            <View style={styles.sectionTitleAccent} />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = getCategoryCount(cat.id);
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    isSelected && { backgroundColor: cat.color, borderColor: cat.color },
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.categoryText,
                      isSelected && styles.categoryTextActive,
                    ]}
                  >
                    {t(cat.titleKey)}
                  </Text>
                  <View
                    style={[
                      styles.categoryCount,
                      isSelected && styles.categoryCountActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryCountText,
                        isSelected && styles.categoryCountTextActive,
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ===== Articles List ===== */}
        <View style={styles.articlesSection}>
          <View style={[styles.sectionHeader, isRTL && styles.rowReverse]}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {searchQuery.trim()
                ? t('education.searchResults')
                : selectedCategory === 'all'
                  ? t('education.allArticles')
                  : t(getCategoryMeta(selectedCategory)?.titleKey || '')}
            </Text>
            <Text style={styles.articlesCount}>
              {filteredArticles.length} {t('education.articles')}
            </Text>
          </View>

          {filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => (
              <View key={article.id}>
                {renderArticleCard({ item: article, index })}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Text style={styles.emptyIcon}>📄</Text>
              </View>
              <Text style={[styles.emptyTitle, isRTL && styles.textRTL]}>
                {t('education.noResults')}
              </Text>
              <Text style={[styles.emptySubtitle, isRTL && styles.textRTL]}>
                {t('education.tryDifferent')}
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                <Text style={styles.emptyButtonText}>{t('education.showAll')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },

  // ===== Header =====
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    lineHeight: fontSizes.md * 1.5,
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  headerIcon: {
    fontSize: 28,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statBadge: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // ===== Search =====
  searchSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 50,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  searchContainerFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSizes.md,
    color: colors.text,
    paddingVertical: 0,
  },
  searchClear: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchClearText: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: fontWeights.bold,
  },

  // ===== Featured Section =====
  featuredSection: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  sectionTitleAccent: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    borderRadius: 1,
  },
  featuredList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  featuredCard: {
    width: FEATURED_CARD_WIDTH,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    minHeight: 200,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  featuredCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.3,
  },
  featuredCircle2: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.2,
  },
  featuredContent: {
    zIndex: 1,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  featuredBadgeIcon: {
    fontSize: 14,
  },
  featuredBadgeText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semiBold,
    color: '#FFFFFF',
  },
  featuredTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
    lineHeight: fontSizes.xxl * 1.25,
  },
  featuredSummary: {
    fontSize: fontSizes.sm,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: fontSizes.sm * 1.5,
    marginBottom: spacing.md,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredReadTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  featuredReadTimeIcon: {
    fontSize: 14,
  },
  featuredReadTimeText: {
    fontSize: fontSizes.xs,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: fontWeights.medium,
  },
  featuredCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    gap: spacing.xs,
  },
  featuredCTAText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    color: '#FFFFFF',
  },
  featuredCTAArrow: {
    fontSize: fontSizes.md,
    color: '#FFFFFF',
    fontWeight: fontWeights.bold,
  },

  // ===== Category Filters =====
  categorySection: {
    marginBottom: spacing.lg,
  },
  categoryList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    minHeight: 42,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.textOnPrimary,
    fontWeight: fontWeights.bold,
  },
  categoryCount: {
    backgroundColor: colors.border,
    borderRadius: borderRadius.round,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  categoryCountActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  categoryCountText: {
    fontSize: fontSizes.xs - 1,
    fontWeight: fontWeights.bold,
    color: colors.textSecondary,
  },
  categoryCountTextActive: {
    color: '#FFFFFF',
  },

  // ===== Articles List =====
  articlesSection: {
    paddingHorizontal: spacing.lg,
  },
  articlesCount: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
  articleCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  articleAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: borderRadius.lg,
    borderBottomLeftRadius: borderRadius.lg,
  },
  articleInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    paddingLeft: spacing.md + 4,
    gap: spacing.md,
  },
  articleIconBox: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleIconText: {
    fontSize: 26,
  },
  articleTextContent: {
    flex: 1,
  },
  articleCategoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  articleCategoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  articleCategoryLabel: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  articleTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
    color: colors.text,
    marginBottom: 4,
    lineHeight: fontSizes.md * 1.3,
  },
  articleSummary: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: fontSizes.sm * 1.45,
    marginBottom: spacing.sm,
  },
  articleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  articleReadTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  articleReadTimeIcon: {
    fontSize: 12,
  },
  articleReadTimeText: {
    fontSize: fontSizes.xs,
    color: colors.textLight,
    fontWeight: fontWeights.medium,
  },
  articleSections: {
    fontSize: fontSizes.xs,
    color: colors.textLight,
    fontWeight: fontWeights.medium,
  },
  articleArrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleArrow: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
  },

  // ===== Empty State =====
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: fontSizes.sm * 1.5,
    marginBottom: spacing.lg,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
  emptyButtonText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
    color: colors.textOnPrimary,
  },
});
