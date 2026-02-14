/**
 * ModernWelcomeScreen - Redesigned welcome/home screen
 * Features: Hero section, action cards, modern layout
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const ModernWelcomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome!</Text>
            <Text style={styles.tagline}>Take charge of your health</Text>
          </View>
          <Pressable style={styles.notificationBadge}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
            {/* Add bell icon here */}
          </Pressable>
        </View>

        {/* Hero Card with Illustration */}
        <Card variant="elevated" style={styles.heroCard}>
          <View style={styles.heroContent}>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Early Detection{'\n'}Saves Lives</Text>
              <Text style={styles.heroDescription}>
                Detecting breast cancer early boosts survival. Stay informed and proactive about your health.
              </Text>
            </View>
            <View style={styles.heroIllustration}>
              {/* Illustration placeholder - replace with actual illustration */}
              <View style={styles.illustrationPlaceholder}>
                <Text style={styles.illustrationEmoji}>🎀</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Actions</Text>
          
          <View style={styles.actionGrid}>
            {/* AI Diagnosis Card */}
            <Card
              variant="elevated"
              style={[styles.actionCard, { backgroundColor: colors.primary }]}
              onPress={() => {}}
            >
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>🔬</Text>
              </View>
              <Text style={styles.actionTitle}>AI Diagnosis</Text>
              <Text style={styles.actionSubtitle}>Upload & analyze</Text>
            </Card>

            {/* Self-Check Card */}
            <Card
              variant="elevated"
              style={[styles.actionCard, { backgroundColor: colors.accentBlue }]}
              onPress={() => {}}
            >
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>🤲</Text>
              </View>
              <Text style={styles.actionTitle}>Self-Check</Text>
              <Text style={styles.actionSubtitle}>Step-by-step guide</Text>
            </Card>
          </View>

          <View style={styles.actionGrid}>
            {/* Risk Calculator Card */}
            <Card
              variant="elevated"
              style={[styles.actionCard, { backgroundColor: colors.accentPurple }]}
              onPress={() => {}}
            >
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>📊</Text>
              </View>
              <Text style={styles.actionTitle}>Risk Calc</Text>
              <Text style={styles.actionSubtitle}>Know your risk</Text>
            </Card>

            {/* Symptoms Card */}
            <Card
              variant="elevated"
              style={[styles.actionCard, { backgroundColor: colors.warning }]}
              onPress={() => {}}
            >
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>⚠️</Text>
              </View>
              <Text style={styles.actionTitle}>Symptoms</Text>
              <Text style={styles.actionSubtitle}>What to look for</Text>
            </Card>
          </View>
        </View>

        {/* Next Reminder Card */}
        <Card variant="outlined" style={styles.reminderCard}>
          <View style={styles.reminderIcon}>
            <Text style={styles.reminderIconText}>⏰</Text>
          </View>
          <View style={styles.reminderContent}>
            <Text style={styles.reminderTitle}>Next Reminder</Text>
            <Text style={styles.reminderText}>
              You will automatically be reminded of your next self-check
            </Text>
            <Text style={styles.reminderDate}>
              This is on: 15 October, 2024 12:45 PM
            </Text>
          </View>
        </Card>

        {/* Educational Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learn More</Text>
          
          <Card variant="outlined" style={styles.resourceCard} onPress={() => {}}>
            <View style={styles.resourceContent}>
              <View style={styles.resourceText}>
                <Text style={styles.resourceTitle}>Understanding Breast Cancer</Text>
                <Text style={styles.resourceDescription}>
                  Comprehensive guide to detection and prevention
                </Text>
              </View>
              <Text style={styles.resourceArrow}>→</Text>
            </View>
          </Card>

          <Card variant="outlined" style={styles.resourceCard} onPress={() => {}}>
            <View style={styles.resourceContent}>
              <View style={styles.resourceText}>
                <Text style={styles.resourceTitle}>FAQs</Text>
                <Text style={styles.resourceDescription}>
                  Common questions answered
                </Text>
              </View>
              <Text style={styles.resourceArrow}>→</Text>
            </View>
          </Card>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacer} />
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.header1Semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tagline: {
    ...typography.body1Regular,
    color: colors.textSecondary,
  },
  notificationBadge: {
    position: 'relative',
    padding: spacing.sm,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.error,
    borderRadius: borderRadius.round,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  badgeText: {
    ...typography.subBodyMedium,
    color: colors.textOnPrimary,
  },
  
  // Hero Card
  heroCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primarySoft,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    ...typography.title1Medium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  heroDescription: {
    ...typography.body1Regular,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  heroIllustration: {
    width: 100,
    height: 100,
  },
  illustrationPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationEmoji: {
    fontSize: 48,
  },
  
  // Sections
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.title1Medium,
    color: colors.text,
    marginBottom: spacing.md,
  },
  
  // Action Grid
  actionGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  actionCard: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionIcon: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  actionIconText: {
    fontSize: 32,
  },
  actionTitle: {
    ...typography.title2Medium,
    color: colors.textOnPrimary,
    textAlign: 'center',
  },
  actionSubtitle: {
    ...typography.subBodyRegular,
    color: colors.textOnPrimary,
    opacity: 0.9,
    textAlign: 'center',
  },
  
  // Reminder Card
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
  },
  reminderIcon: {
    width: 48,
    height: 48,
    backgroundColor: colors.primarySoft,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderIconText: {
    fontSize: 24,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    ...typography.title2Medium,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  reminderText: {
    ...typography.body1Regular,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  reminderDate: {
    ...typography.subBodyMedium,
    color: colors.text,
  },
  
  // Resource Cards
  resourceCard: {
    marginBottom: spacing.md,
  },
  resourceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  resourceText: {
    flex: 1,
  },
  resourceTitle: {
    ...typography.title2Medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  resourceDescription: {
    ...typography.body1Regular,
    color: colors.textSecondary,
  },
  resourceArrow: {
    fontSize: 24,
    color: colors.primary,
  },
  
  bottomSpacer: {
    height: spacing.xl,
  },
});
