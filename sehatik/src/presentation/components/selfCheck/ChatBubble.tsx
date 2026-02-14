/**
 * ChatBubble - Reusable chat bubble for the self-check conversation.
 * Supports assistant and user message variants with step accent color.
 * Uses Ionicons for the assistant avatar (matching step icon).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore } from '../../../application/store/languageStore';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { fontSizes, fontWeights } from '../../theme/typography';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface ChatBubbleProps {
  type: 'assistant' | 'user';
  /** i18n key for the message (used for scripted messages) */
  textKey?: string;
  /** Raw text (used for free-text user input / LLM responses) */
  text?: string;
  /** Step accent color for the assistant avatar */
  accentColor: string;
  /** Ionicons name for the avatar (e.g. 'eye-outline') */
  stepIcon?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  type,
  textKey,
  text,
  accentColor,
  stepIcon = 'heart',
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();

  const displayText = textKey ? t(textKey) : text || '';

  if (type === 'assistant') {
    return (
      <View style={[styles.row, isRTL && styles.rowReverse]}>
        <View style={[styles.avatar, { backgroundColor: accentColor + '15' }]}>
          <Ionicons
            name={stepIcon as IoniconsName}
            size={16}
            color={accentColor}
          />
        </View>
        <View style={styles.assistantBubble}>
          <Text style={[styles.assistantText, isRTL && styles.textRTL]}>
            {displayText}
          </Text>
        </View>
      </View>
    );
  }

  // User bubble
  return (
    <View style={[styles.row, styles.userRow, isRTL && styles.userRowRTL]}>
      <View style={[styles.userBubble, { backgroundColor: accentColor }]}>
        <Text style={[styles.userText, isRTL && styles.textRTL]}>
          {displayText}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  rowReverse: { flexDirection: 'row-reverse' },
  userRow: { justifyContent: 'flex-end' },
  userRowRTL: { justifyContent: 'flex-start' },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  assistantBubble: {
    maxWidth: '78%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderBottomLeftRadius: spacing.xs,
    padding: spacing.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  assistantText: {
    fontSize: fontSizes.md,
    color: colors.text,
    lineHeight: fontSizes.md * 1.5,
  },
  userBubble: {
    maxWidth: '78%',
    borderRadius: borderRadius.lg,
    borderBottomRightRadius: spacing.xs,
    padding: spacing.md,
  },
  userText: {
    fontSize: fontSizes.md,
    color: colors.textOnPrimary,
    lineHeight: fontSizes.md * 1.5,
  },
  textRTL: { textAlign: 'right', writingDirection: 'rtl' },
});
