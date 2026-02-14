/**
 * Medical Disclaimer Component — Premium 2026 Design
 * Must be shown prominently per healthcare compliance requirements.
 * This app is educational only - NOT a medical device.
 */

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { spacing } from '../../theme/spacing';

interface MedicalDisclaimerProps {
  type?: 'general' | 'assessment';
  compact?: boolean;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({
  type = 'general',
  compact = false,
}) => {
  const { t } = useTranslation();

  return (
    <View
      style={[styles.container, compact && styles.containerCompact]}
      accessibilityRole="text"
      accessibilityLabel={t('disclaimer.title')}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="medical-outline" size={compact ? 14 : 16} color="#3B82F6" />
      </View>
      <Text style={[styles.text, compact && styles.textCompact]}>
        {t(`disclaimer.${type}`)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.08)',
  },
  containerCompact: {
    padding: spacing.sm + 2,
    borderRadius: 12,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: 'rgba(59,130,246,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: '#334155',
    lineHeight: 21,
  },
  textCompact: {
    fontSize: 12,
    lineHeight: 18,
  },
});
