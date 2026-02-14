/**
 * ModernDiagnosisScreen - AI-powered diagnosis upload and results
 * Features: Image upload, analysis, results display
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

type DiagnosisState = 'upload' | 'analyzing' | 'results';

export const ModernDiagnosisScreen: React.FC = () => {
  const [state, setState] = useState<DiagnosisState>('upload');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleUpload = () => {
    // Simulate image upload
    setState('analyzing');
    setTimeout(() => {
      setState('results');
    }, 2000);
  };

  const renderUploadState = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.screenTitle}>AI Diagnosis</Text>
        <Text style={styles.screenSubtitle}>
          Upload your mammogram for AI-powered analysis
        </Text>
      </View>

      {/* Upload Card */}
      <Card variant="elevated" style={styles.uploadCard}>
        <View style={styles.uploadIcon}>
          <Text style={styles.uploadIconText}>📸</Text>
        </View>
        <Text style={styles.uploadTitle}>Please Upload Your Mammogram For Diagnosis</Text>
        <Text style={styles.uploadDescription}>
          Supported formats: JPEG, PNG, DICOM
        </Text>
        <Button
          title="Upload Mammogram"
          onPress={handleUpload}
          variant="primary"
          size="large"
          fullWidth
        />
      </Card>

      {/* Instructions */}
      <View style={styles.instructionsSection}>
        <Text style={styles.instructionsTitle}>Uploading Steps</Text>
        
        <View style={styles.stepsList}>
          <InstructionStep
            number="1"
            title="Firstly"
            description="Click the Upload Mammogram button to upload the image from your device."
          />
          <InstructionStep
            number="2"
            title="Secondly"
            description="Make sure the image is clear and properly focused."
          />
          <InstructionStep
            number="3"
            title="Thirdly"
            description="Please upload an image of the breast tissue."
          />
        </View>
      </View>

      {/* Safety Notice */}
      <Card variant="filled" style={styles.noticeCard}>
        <View style={styles.noticeHeader}>
          <Text style={styles.noticeIcon}>🔒</Text>
          <Text style={styles.noticeTitle}>Your Privacy Matters</Text>
        </View>
        <Text style={styles.noticeText}>
          All medical images are encrypted and processed securely. Your data is never shared with third parties.
        </Text>
      </Card>
    </ScrollView>
  );

  const renderAnalyzingState = () => (
    <View style={styles.centerContainer}>
      <View style={styles.analyzingIcon}>
        <Text style={styles.analyzingEmoji}>🔬</Text>
      </View>
      <Text style={styles.analyzingTitle}>Analyzing...</Text>
      <Text style={styles.analyzingDescription}>
        Our AI is examining your mammogram. This may take a few moments.
      </Text>
      <View style={styles.loadingBar}>
        <View style={styles.loadingFill} />
      </View>
    </View>
  );

  const renderResultsState = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.screenTitle}>Results</Text>
        <Text style={styles.screenSubtitle}>Analysis complete</Text>
      </View>

      {/* Uploaded Image Preview */}
      <Card variant="elevated" style={styles.imagePreviewCard}>
        <View style={styles.imagePreview}>
          {/* Placeholder - replace with actual mammogram image */}
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>Mammogram Image</Text>
          </View>
        </View>
      </Card>

      {/* Results Card */}
      <Card variant="elevated" style={styles.resultsCard}>
        <View style={styles.resultHeader}>
          <View style={styles.resultStatusBadge}>
            <Text style={styles.resultStatusIcon}>⚠️</Text>
          </View>
          <Text style={styles.resultTitle}>Positive Results</Text>
        </View>
        
        <View style={styles.resultDiagnosis}>
          <Text style={styles.diagnosisLabel}>Detected:</Text>
          <Text style={styles.diagnosisValue}>Benign Tumor</Text>
        </View>

        <View style={styles.confidenceSection}>
          <Text style={styles.confidenceLabel}>Confidence Level</Text>
          <View style={styles.confidenceBar}>
            <View style={[styles.confidenceFill, { width: '85%' }]} />
          </View>
          <Text style={styles.confidenceText}>85% confidence</Text>
        </View>
      </Card>

      {/* Action Required */}
      <Card variant="filled" style={styles.actionCard}>
        <Text style={styles.actionIcon}>👩‍⚕️</Text>
        <Text style={styles.actionTitle}>Please consult your doctor for treatment options</Text>
        <Text style={styles.actionDescription}>
          This AI diagnosis should be verified by a medical professional. Schedule an appointment with your healthcare provider.
        </Text>
      </Card>

      {/* Detailed Information */}
      <Card variant="outlined" style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Analysis Details</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Analysis Date:</Text>
          <Text style={styles.detailValue}>Feb 14, 2026</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Model Version:</Text>
          <Text style={styles.detailValue}>v2.1.0</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Image Quality:</Text>
          <Text style={styles.detailValue}>Excellent</Text>
        </View>
      </Card>

      {/* Actions */}
      <View style={styles.buttonGroup}>
        <Button
          title="Save Results"
          onPress={() => {}}
          variant="outlined"
          size="large"
          fullWidth
        />
        <Button
          title="New Analysis"
          onPress={() => setState('upload')}
          variant="primary"
          size="large"
          fullWidth
        />
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {state === 'upload' && renderUploadState()}
      {state === 'analyzing' && renderAnalyzingState()}
      {state === 'results' && renderResultsState()}
    </SafeAreaView>
  );
};

const InstructionStep: React.FC<{
  number: string;
  title: string;
  description: string;
}> = ({ number, title, description }) => (
  <View style={styles.stepItem}>
    <View style={styles.stepNumber}>
      <Text style={styles.stepNumberText}>{number}</Text>
    </View>
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  
  // Header
  headerSection: {
    marginBottom: spacing.lg,
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
  
  // Upload State
  uploadCard: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingVertical: spacing.xl,
  },
  uploadIcon: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  uploadIconText: {
    fontSize: 48,
  },
  uploadTitle: {
    ...typography.title1Medium,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  uploadDescription: {
    ...typography.body1Regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  
  // Instructions
  instructionsSection: {
    marginBottom: spacing.lg,
  },
  instructionsTitle: {
    ...typography.title1Medium,
    color: colors.text,
    marginBottom: spacing.md,
  },
  stepsList: {
    gap: spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    ...typography.body1Medium,
    color: colors.textOnPrimary,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    ...typography.title2Medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  stepDescription: {
    ...typography.body1Regular,
    color: colors.textSecondary,
  },
  
  // Notice Card
  noticeCard: {
    marginBottom: spacing.lg,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  noticeIcon: {
    fontSize: 24,
  },
  noticeTitle: {
    ...typography.title2Medium,
    color: colors.text,
  },
  noticeText: {
    ...typography.body1Regular,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  
  // Analyzing State
  analyzingIcon: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  analyzingEmoji: {
    fontSize: 64,
  },
  analyzingTitle: {
    ...typography.header1Semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  analyzingDescription: {
    ...typography.body1Regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  loadingBar: {
    width: '100%',
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  loadingFill: {
    height: '100%',
    width: '70%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
  },
  
  // Results State
  imagePreviewCard: {
    marginBottom: spacing.lg,
    padding: 0,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.border,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    ...typography.body1Regular,
    color: colors.textSecondary,
  },
  
  resultsCard: {
    marginBottom: spacing.lg,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  resultStatusBadge: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.round,
    backgroundColor: colors.warning + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  resultStatusIcon: {
    fontSize: 40,
  },
  resultTitle: {
    ...typography.header1Semibold,
    color: colors.text,
  },
  
  resultDiagnosis: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.primarySoft,
    borderRadius: borderRadius.md,
  },
  diagnosisLabel: {
    ...typography.body1Regular,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  diagnosisValue: {
    ...typography.title1Medium,
    color: colors.primary,
  },
  
  confidenceSection: {
    gap: spacing.sm,
  },
  confidenceLabel: {
    ...typography.title2Medium,
    color: colors.text,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: borderRadius.round,
  },
  confidenceText: {
    ...typography.body1Regular,
    color: colors.textSecondary,
  },
  
  // Action Card
  actionCard: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  actionIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  actionTitle: {
    ...typography.title1Medium,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  actionDescription: {
    ...typography.body1Regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Details Card
  detailsCard: {
    marginBottom: spacing.lg,
  },
  detailsTitle: {
    ...typography.title1Medium,
    color: colors.text,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  detailLabel: {
    ...typography.body1Regular,
    color: colors.textSecondary,
  },
  detailValue: {
    ...typography.body1Medium,
    color: colors.text,
  },
  
  // Button Group
  buttonGroup: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  
  bottomSpacer: {
    height: spacing.xl,
  },
});
