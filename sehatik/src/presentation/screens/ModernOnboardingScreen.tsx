/**
 * ModernOnboardingScreen - First-time user experience
 * Features: Swipeable slides, illustrations, skip/next navigation
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Button } from '../components/common/Button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  emoji: string;
  title: string;
  description: string;
  backgroundColor: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: 1,
    emoji: '🎗️',
    title: 'Welcome to Sehatik',
    description: 'Your personal health companion for breast cancer awareness and early detection. Take control of your health journey.',
    backgroundColor: colors.primarySoft,
  },
  {
    id: 2,
    emoji: '🔬',
    title: 'AI-Powered Diagnosis',
    description: 'Upload mammograms for instant AI analysis. Get preliminary results and recommendations based on advanced machine learning.',
    backgroundColor: '#E3F2FD',
  },
  {
    id: 3,
    emoji: '🤲',
    title: 'Self-Examination Guide',
    description: 'Learn proper self-check techniques with step-by-step instructions. Regular self-exams can save lives through early detection.',
    backgroundColor: '#F3E5F5',
  },
  {
    id: 4,
    emoji: '📊',
    title: 'Track Your Health',
    description: 'Monitor your health journey, set reminders, and access your complete medical history. Stay informed and proactive.',
    backgroundColor: '#FFF3E0',
  },
  {
    id: 5,
    emoji: '🏥',
    title: 'Your Health, Your Privacy',
    description: 'All data is encrypted and secure. Your privacy matters to us. We never share your information without consent.',
    backgroundColor: '#E8F5E9',
  },
];

export const ModernOnboardingScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = () => {
    // Navigate to main app
    console.log('Get started');
  };

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Skip Button */}
      {!isLastSlide && (
        <Pressable style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      )}

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {SLIDES.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            {/* Illustration Container */}
            <View
              style={[
                styles.illustrationContainer,
                { backgroundColor: slide.backgroundColor },
              ]}
            >
              <Text style={styles.emoji}>{slide.emoji}</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        {isLastSlide ? (
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            variant="primary"
            size="large"
            fullWidth
          />
        ) : (
          <Button
            title="Next"
            onPress={handleNext}
            variant="primary"
            size="large"
            fullWidth
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  
  // Skip Button
  skipButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.md,
    zIndex: 10,
    padding: spacing.sm,
  },
  skipText: {
    ...typography.body1Medium,
    color: colors.primary,
  },
  
  // ScrollView
  scrollView: {
    flex: 1,
  },
  
  // Slide
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  
  // Illustration
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    marginTop: spacing.xxxl,
    marginBottom: spacing.xl,
  },
  emoji: {
    fontSize: 120,
  },
  
  // Content
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  title: {
    ...typography.header1Semibold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body1Regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // Pagination
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.round,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
  
  // Navigation
  navigation: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
});
