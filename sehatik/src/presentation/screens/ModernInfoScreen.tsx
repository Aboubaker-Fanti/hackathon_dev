/**
 * ModernInfoScreen - Educational content about breast cancer
 * Features: Informational cards, symptoms, prevention tips
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Card } from '../components/common/Card';

type InfoTab = 'symptoms' | 'prevention' | 'risk-factors' | 'treatment';

interface InfoCardData {
  icon: string;
  title: string;
  description: string;
}

const SYMPTOMS_DATA: InfoCardData[] = [
  {
    icon: '🔴',
    title: 'Lumps, knots, or thickenings',
    description: 'A lump or thickening in the breast or underarm that feels different from the surrounding tissue.',
  },
  {
    icon: '📏',
    title: 'Change in size or shape',
    description: 'Any unexplained change in the size, shape, or appearance of one or both breasts.',
  },
  {
    icon: '🎀',
    title: 'Skin changes',
    description: 'Redness, dimpling, puckering, or other changes in the breast skin texture.',
  },
  {
    icon: '💧',
    title: 'Nipple discharge',
    description: 'Unusual discharge from the nipple, especially if bloody or occurring without squeezing.',
  },
  {
    icon: '🔄',
    title: 'Nipple changes',
    description: 'Inversion of the nipple or changes in the nipple appearance.',
  },
];

const PREVENTION_DATA: InfoCardData[] = [
  {
    icon: '🩺',
    title: 'Regular Self-Exams',
    description: 'Perform monthly breast self-examinations to detect any changes early. Know what is normal for you.',
  },
  {
    icon: '🏃‍♀️',
    title: 'Stay Active',
    description: 'Regular physical activity can help reduce breast cancer risk. Aim for at least 30 minutes most days.',
  },
  {
    icon: '🥗',
    title: 'Healthy Diet',
    description: 'Eat a balanced diet rich in fruits, vegetables, and whole grains. Limit alcohol consumption.',
  },
  {
    icon: '⚖️',
    title: 'Maintain Healthy Weight',
    description: 'Being overweight or obese increases breast cancer risk, especially after menopause.',
  },
  {
    icon: '📅',
    title: 'Regular Screenings',
    description: 'Follow recommended mammogram screening guidelines based on your age and risk factors.',
  },
];

const RISK_FACTORS_DATA: InfoCardData[] = [
  {
    icon: '👩',
    title: 'Gender',
    description: 'Women are at much higher risk than men for developing breast cancer.',
  },
  {
    icon: '📆',
    title: 'Age',
    description: 'Risk increases with age, with most breast cancers diagnosed after age 50.',
  },
  {
    icon: '🧬',
    title: 'Family History',
    description: 'Having close relatives with breast cancer increases your risk.',
  },
  {
    icon: '🔬',
    title: 'Genetic Mutations',
    description: 'Inherited mutations in BRCA1 and BRCA2 genes significantly increase risk.',
  },
];

const TREATMENT_DATA: InfoCardData[] = [
  {
    icon: '🔪',
    title: 'Surgery',
    description: 'Lumpectomy or mastectomy to remove cancerous tissue.',
  },
  {
    icon: '💊',
    title: 'Chemotherapy',
    description: 'Medications to kill cancer cells or stop them from growing.',
  },
  {
    icon: '☢️',
    title: 'Radiation Therapy',
    description: 'High-energy rays to kill cancer cells after surgery.',
  },
  {
    icon: '💉',
    title: 'Hormone Therapy',
    description: 'Blocks hormones that fuel certain breast cancers.',
  },
];

export const ModernInfoScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InfoTab>('symptoms');

  const getTabData = (): InfoCardData[] => {
    switch (activeTab) {
      case 'symptoms':
        return SYMPTOMS_DATA;
      case 'prevention':
        return PREVENTION_DATA;
      case 'risk-factors':
        return RISK_FACTORS_DATA;
      case 'treatment':
        return TREATMENT_DATA;
      default:
        return SYMPTOMS_DATA;
    }
  };

  const getTabTitle = (): string => {
    switch (activeTab) {
      case 'symptoms':
        return 'What To Look For';
      case 'prevention':
        return 'Prevention Tips';
      case 'risk-factors':
        return 'Risk Factors';
      case 'treatment':
        return 'Treatment Options';
      default:
        return 'Information';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Health Info</Text>
        <Text style={styles.screenSubtitle}>
          Learn about breast cancer awareness and prevention
        </Text>
      </View>

      {/* Tab Navigation */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        <TabButton
          label="Symptoms"
          isActive={activeTab === 'symptoms'}
          onPress={() => setActiveTab('symptoms')}
        />
        <TabButton
          label="Prevention"
          isActive={activeTab === 'prevention'}
          onPress={() => setActiveTab('prevention')}
        />
        <TabButton
          label="Risk Factors"
          isActive={activeTab === 'risk-factors'}
          onPress={() => setActiveTab('risk-factors')}
        />
        <TabButton
          label="Treatment"
          isActive={activeTab === 'treatment'}
          onPress={() => setActiveTab('treatment')}
        />
      </ScrollView>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Title */}
        <Text style={styles.sectionTitle}>{getTabTitle()}</Text>

        {/* Info Cards */}
        <View style={styles.cardsContainer}>
          {getTabData().map((item, index) => (
            <Card
              key={index}
              variant="elevated"
              style={styles.infoCard}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardIcon}>
                  <Text style={styles.cardIconText}>{item.icon}</Text>
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription}>{item.description}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Emergency Notice */}
        <Card variant="filled" style={styles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <Text style={styles.emergencyIcon}>⚠️</Text>
            <Text style={styles.emergencyTitle}>Important Notice</Text>
          </View>
          <Text style={styles.emergencyText}>
            If you notice any concerning symptoms, please consult with a healthcare professional immediately. Early detection is key to successful treatment.
          </Text>
        </Card>

        {/* Resources Section */}
        <View style={styles.resourcesSection}>
          <Text style={styles.resourcesTitle}>Additional Resources</Text>
          
          <Card variant="outlined" style={styles.resourceCard} onPress={() => {}}>
            <View style={styles.resourceContent}>
              <View style={styles.resourceIcon}>
                <Text style={styles.resourceIconText}>📚</Text>
              </View>
              <View style={styles.resourceText}>
                <Text style={styles.resourceTitle}>
                  Breast Cancer Guide
                </Text>
                <Text style={styles.resourceDescription}>
                  Complete guide to understanding breast cancer
                </Text>
              </View>
              <Text style={styles.resourceArrow}>→</Text>
            </View>
          </Card>

          <Card variant="outlined" style={styles.resourceCard} onPress={() => {}}>
            <View style={styles.resourceContent}>
              <View style={styles.resourceIcon}>
                <Text style={styles.resourceIconText}>🏥</Text>
              </View>
              <View style={styles.resourceText}>
                <Text style={styles.resourceTitle}>
                  Find Healthcare Centers
                </Text>
                <Text style={styles.resourceDescription}>
                  Locate nearby screening facilities
                </Text>
              </View>
              <Text style={styles.resourceArrow}>→</Text>
            </View>
          </Card>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const TabButton: React.FC<{
  label: string;
  isActive: boolean;
  onPress: () => void;
}> = ({ label, isActive, onPress }) => (
  <Pressable
    style={[styles.tabButton, isActive && styles.tabButtonActive]}
    onPress={onPress}
  >
    <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
      {label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Header
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  screenTitle: {
    ...typography.header1Semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  screenSubtitle: {
    ...typography.body1Regular,
    color: colors.textSecondary,
  },
  
  // Tabs
  tabsContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  tabButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabButtonText: {
    ...typography.body1Medium,
    color: colors.text,
  },
  tabButtonTextActive: {
    color: colors.textOnPrimary,
  },
  
  // Content
  scrollContent: {
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    ...typography.title1Medium,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  
  // Info Cards
  cardsContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  infoCard: {
    backgroundColor: colors.surface,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconText: {
    fontSize: 24,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    ...typography.title2Medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardDescription: {
    ...typography.body1Regular,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  
  // Emergency Card
  emergencyCard: {
    marginBottom: spacing.lg,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  emergencyIcon: {
    fontSize: 24,
  },
  emergencyTitle: {
    ...typography.title2Medium,
    color: colors.warning,
  },
  emergencyText: {
    ...typography.body1Regular,
    color: colors.text,
    lineHeight: 22,
  },
  
  // Resources
  resourcesSection: {
    marginBottom: spacing.lg,
  },
  resourcesTitle: {
    ...typography.title1Medium,
    color: colors.text,
    marginBottom: spacing.md,
  },
  resourceCard: {
    marginBottom: spacing.md,
  },
  resourceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resourceIconText: {
    fontSize: 24,
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
