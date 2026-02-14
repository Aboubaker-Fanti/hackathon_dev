/**
 * Welcome/Onboarding Screen
 * First screen users see - introduces the app with culturally sensitive messaging
 * Includes language selection + disclaimer acceptance
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  ViewToken,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguageStore } from '../../../application/store/languageStore';
import { useAuthStore } from '../../../application/store/authStore';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '../../../infrastructure/i18n';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, MIN_TOUCH_TARGET } from '../../theme/spacing';
import { fontSizes, fontWeights } from '../../theme/typography';

const { width } = Dimensions.get('window');

interface SlideData {
  id: string;
  icon: string;
  titleKey: string;
  subtitleKey: string;
  color: string;
}

const SLIDES: SlideData[] = [
  {
    id: '1',
    icon: '💗',
    titleKey: 'onboarding.slide1_title',
    subtitleKey: 'onboarding.slide1_subtitle',
    color: colors.primary,
  },
  {
    id: '2',
    icon: '🩺',
    titleKey: 'onboarding.slide2_title',
    subtitleKey: 'onboarding.slide2_subtitle',
    color: colors.secondary,
  },
  {
    id: '3',
    icon: '🔒',
    titleKey: 'onboarding.slide3_title',
    subtitleKey: 'onboarding.slide3_subtitle',
    color: colors.accent,
  },
];

interface Props {
  onComplete: () => void;
}

export const WelcomeScreen: React.FC<Props> = ({ onComplete }) => {
  const { t } = useTranslation();
  const { currentLanguage, setLanguage, isRTL } = useLanguageStore();
  const { completeOnboarding } = useAuthStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const showDisclaimer = currentIndex >= SLIDES.length - 1;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const handleAcceptDisclaimer = async () => {
    setDisclaimerAccepted(true);
    await completeOnboarding();
    onComplete();
  };

  const renderSlide = ({ item }: { item: SlideData }) => (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <Text style={[styles.slideTitle, isRTL && styles.textRTL]}>
        {t(item.titleKey)}
      </Text>
      <Text style={[styles.slideSubtitle, isRTL && styles.textRTL]}>
        {t(item.subtitleKey)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Language Selector at top */}
      <View style={styles.languageRow}>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.langChip,
              currentLanguage === lang.code && styles.langChipActive,
            ]}
            onPress={() => setLanguage(lang.code as LanguageCode)}
          >
            <Text
              style={[
                styles.langChipText,
                currentLanguage === lang.code && styles.langChipTextActive,
              ]}
            >
              {lang.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      {/* Page Indicators */}
      <View style={styles.pagination}>
        {SLIDES.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.dotActive]}
          />
        ))}
      </View>

      {/* Disclaimer + Accept (shown on last slide) */}
      {showDisclaimer ? (
        <View style={styles.disclaimerSection}>
          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerIcon}>⚕️</Text>
            <Text style={[styles.disclaimerText, isRTL && styles.textRTL]}>
              {t('onboarding.disclaimer_text')}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={handleAcceptDisclaimer}
            accessibilityRole="button"
          >
            <Text style={styles.acceptButtonText}>
              {t('onboarding.disclaimer_accept')}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.bottomButtons}>
          <TouchableOpacity onPress={handleAcceptDisclaimer} style={styles.skipButton}>
            <Text style={[styles.skipText, isRTL && styles.textRTL]}>
              {t('onboarding.skip')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>{t('common.next')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  langChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
  langChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  langChipText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
  langChipTextActive: {
    color: colors.textOnPrimary,
    fontWeight: fontWeights.bold,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  icon: {
    fontSize: 56,
  },
  slideTitle: {
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  slideSubtitle: {
    fontSize: fontSizes.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: fontSizes.lg * 1.5,
    paddingHorizontal: spacing.lg,
  },
  textRTL: {
    writingDirection: 'rtl',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  disclaimerSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  disclaimerBox: {
    flexDirection: 'row',
    backgroundColor: colors.info + '10',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  disclaimerIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  disclaimerText: {
    flex: 1,
    fontSize: fontSizes.sm,
    color: colors.text,
    lineHeight: fontSizes.sm * 1.6,
  },
  acceptButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
  acceptButtonText: {
    color: colors.textOnPrimary,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  skipButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
  skipText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
  nextButtonText: {
    color: colors.textOnPrimary,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
  },
});
