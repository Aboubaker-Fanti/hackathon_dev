/**
 * QuickReplyChips - Horizontally scrollable quick-reply buttons
 * for the self-check conversation questions.
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '../../../application/store/languageStore';
import type { QuickReplyOption } from '../../../infrastructure/data/selfCheckConversations';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, MIN_TOUCH_TARGET } from '../../theme/spacing';
import { fontSizes, fontWeights } from '../../theme/typography';

interface QuickReplyChipsProps {
  options: QuickReplyOption[];
  accentColor: string;
  onSelect: (value: string, labelKey: string) => void;
}

export const QuickReplyChips: React.FC<QuickReplyChipsProps> = ({
  options,
  accentColor,
  onSelect,
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          isRTL && styles.scrollContentRTL,
        ]}
      >
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[styles.chip, { borderColor: accentColor + '50' }]}
            onPress={() => onSelect(option.value, option.labelKey)}
            accessibilityRole="button"
            accessibilityLabel={t(option.labelKey)}
          >
            <Text style={[styles.chipText, { color: accentColor }]}>
              {t(option.labelKey)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  scrollContent: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  scrollContentRTL: {
    flexDirection: 'row-reverse',
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    backgroundColor: colors.surface,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  chipText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
  },
});
