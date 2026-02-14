/**
 * ModernSelfCheckScreen - Step-by-step self-examination guide
 * Features: Progress indicator, illustrations, interactive steps
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STEPS = [
  {
    id: 1,
    title: 'Firstly',
    instruction: 'Click the Upload Mammogram button to upload the image from your device.',
    illustration: '📱',
    stepNumber: '1 of 5',
  },
  {
    id: 2,
    title: 'Secondly',
    instruction: 'Make sure the image is clear and properly focused before uploading.',
    illustration: '🔍',
    stepNumber: '2 of 5',
  },
  {
    id: 3,
    title: 'Thirdly',
    instruction: 'Please upload an image of the breast tissue.',
    illustration: '🩺',
    stepNumber: '3 of 5',
  },
  {
    id: 4,
    title: 'Position',
    instruction: 'Start in an upright position. Hands on your hips. Look at your breasts with the help of a mirror or mobile phone, or a friend.',
    illustration: '🧍‍♀️',
    stepNumber: '4 of 5',
  },
  {
    id: 5,
    title: 'Feel',
    instruction: 'Use the pads of your fingers and feel your breasts. Follow a pattern: Feel for lumps, hardened knots and thickenings.',
    illustration: '🤲',
    stepNumber: '5 of 5',
  },
];

export const ModernSelfCheckScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  if (completed) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.completedContainer}>
          <View style={styles.completedIcon}>
            <Text style={styles.completedEmoji}>✅</Text>
          </View>
          <Text style={styles.completedTitle}>Great Job!</Text>
          <Text style={styles.completedDescription}>
            You've completed the self-check guide. Remember to perform self-examinations regularly.
          </Text>
          <Button
            title="Back to Home"
            onPress={() => setCompleted(false)}
            variant="primary"
            size="large"
            fullWidth
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Self-Check</Text>
          <Text style={styles.stepCounter}>{currentStepData.stepNumber}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <View style={styles.progressDots}>
            {STEPS.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index <= currentStep && styles.progressDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Step Card */}
          <Card variant="elevated" style={styles.stepCard}>
            {/* Illustration */}
            <View style={styles.illustrationContainer}>
              <View style={styles.illustrationCircle}>
                <Text style={styles.illustration}>{currentStepData.illustration}</Text>
              </View>
            </View>

            {/* Step Content */}
            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepTitle}>{currentStepData.title}</Text>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>{currentStep + 1}</Text>
                </View>
              </View>
              
              <Text style={styles.stepInstruction}>
                {currentStepData.instruction}
              </Text>
            </View>
          </Card>

          {/* Info Cards */}
          <Card variant="filled" style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>💡</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Pro Tip</Text>
                <Text style={styles.infoText}>
                  Perform self-checks at the same time each month, ideally a few days after your period ends.
                </Text>
              </View>
            </View>
          </Card>

          {/* What to Look For */}
          <View style={styles.lookForSection}>
            <Text style={styles.lookForTitle}>What Should I Look For?</Text>
            
            <View style={styles.symptomsList}>
              <SymptomItem
                icon="🔴"
                title="Lumps, knots, or thickenings"
                description="Any unusual masses in the breast tissue"
              />
              <SymptomItem
                icon="📏"
                title="Change in size or shape"
                description="Notable differences between breasts"
              />
              <SymptomItem
                icon="🎀"
                title="Skin changes"
                description="Dimpling, redness, or unusual texture"
              />
            </View>
          </View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigation}>
          <Button
            title="Back"
            onPress={handleBack}
            variant="outlined"
            size="large"
            disabled={currentStep === 0}
            style={styles.navButton}
          />
          <Button
            title={currentStep === STEPS.length - 1 ? 'Finish' : 'Next'}
            onPress={handleNext}
            variant="primary"
            size="large"
            style={styles.navButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const SymptomItem: React.FC<{
  icon: string;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <View style={styles.symptomItem}>
    <Text style={styles.symptomIcon}>{icon}</Text>
    <View style={styles.symptomContent}>
      <Text style={styles.symptomTitle}>{title}</Text>
      <Text style={styles.symptomDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  screenTitle: {
    ...typography.header1Semibold,
    color: colors.text,
  },
  stepCounter: {
    ...typography.body1Medium,
    color: colors.primary,
  },
  
  // Progress
  progressContainer: {
    marginBottom: spacing.lg,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.round,
    backgroundColor: colors.border,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
  },
  
  // Scroll Content
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  
  // Step Card
  stepCard: {
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  illustrationContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.primarySoft,
  },
  illustrationCircle: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  illustration: {
    fontSize: 64,
  },
  stepContent: {
    padding: spacing.lg,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stepTitle: {
    ...typography.title1Medium,
    color: colors.text,
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBadgeText: {
    ...typography.body1Medium,
    color: colors.textOnPrimary,
  },
  stepInstruction: {
    ...typography.body1Regular,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  
  // Info Card
  infoCard: {
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  infoIcon: {
    fontSize: 32,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    ...typography.title2Medium,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  infoText: {
    ...typography.body1Regular,
    color: colors.text,
    lineHeight: 22,
  },
  
  // Look For Section
  lookForSection: {
    marginBottom: spacing.lg,
  },
  lookForTitle: {
    ...typography.title1Medium,
    color: colors.text,
    marginBottom: spacing.md,
  },
  symptomsList: {
    gap: spacing.md,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  symptomIcon: {
    fontSize: 24,
  },
  symptomContent: {
    flex: 1,
  },
  symptomTitle: {
    ...typography.title2Medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  symptomDescription: {
    ...typography.body1Regular,
    color: colors.textSecondary,
  },
  
  // Navigation
  navigation: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navButton: {
    flex: 1,
  },
  
  // Completed State
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  completedIcon: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  completedEmoji: {
    fontSize: 64,
  },
  completedTitle: {
    ...typography.header1Semibold,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  completedDescription: {
    ...typography.body1Regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
});
