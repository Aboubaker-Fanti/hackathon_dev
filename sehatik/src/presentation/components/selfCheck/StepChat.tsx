/**
 * StepChat - Chat-based interaction for a self-check step.
 *
 * Renders:
 * - FlatList of chat bubbles (assistant + user)
 * - Quick-reply chips when a question is active
 * - Typing indicator
 * - Optional free-text input for clarification questions
 * - "Continue to next step" button when chat is complete
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore } from '../../../application/store/languageStore';
import {
  useSelfCheckChatStore,
  type ChatBubbleData,
} from '../../../application/store/selfCheckChatStore';
import { ChatBubble } from './ChatBubble';
import { QuickReplyChips } from './QuickReplyChips';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, MIN_TOUCH_TARGET } from '../../theme/spacing';
import { fontSizes, fontWeights } from '../../theme/typography';

interface StepChatProps {
  stepId: string;
  accentColor: string;
  stepIcon: string;
  /** Called when the chat is complete and user taps "Continue" */
  onComplete: (answers: Record<string, string>) => void;
  /** Called when user wants to go back to instructions */
  onBack: () => void;
}

export const StepChat: React.FC<StepChatProps> = ({
  stepId,
  accentColor,
  stepIcon,
  onComplete,
  onBack,
}) => {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguageStore();
  const flatListRef = useRef<FlatList>(null);
  const [clarifyText, setClarifyText] = useState('');
  const [showClarifyInput, setShowClarifyInput] = useState(false);

  const {
    messages,
    activeQuestion,
    isTyping,
    isClarifying,
    isComplete,
    initChat,
    handleQuickReply,
    handleClarification,
    getAnswers,
  } = useSelfCheckChatStore();

  // Initialize chat on mount
  useEffect(() => {
    initChat(stepId);
  }, [stepId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messages.length > 0 || isTyping) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 150);
    }
  }, [messages.length, isTyping, isComplete]);

  const handleQuickReplyPress = useCallback(
    (value: string, labelKey: string) => {
      if (!activeQuestion) return;
      handleQuickReply(activeQuestion.id, value, labelKey);
    },
    [activeQuestion, handleQuickReply],
  );

  const handleSendClarification = useCallback(async () => {
    const text = clarifyText.trim();
    if (!text) return;
    setClarifyText('');
    setShowClarifyInput(false);
    await handleClarification(text, currentLanguage);
  }, [clarifyText, currentLanguage, handleClarification]);

  const handleComplete = useCallback(() => {
    onComplete(getAnswers());
  }, [onComplete, getAnswers]);

  // ── Render items ───────────────────────────────────────

  const renderItem = useCallback(
    ({ item }: { item: ChatBubbleData }) => (
      <ChatBubble
        type={item.type === 'user' ? 'user' : 'assistant'}
        textKey={item.textKey}
        text={item.text}
        accentColor={accentColor}
        stepIcon={stepIcon}
      />
    ),
    [accentColor, stepIcon],
  );

  const keyExtractor = useCallback((item: ChatBubbleData) => item.id, []);

  // ── Footer: typing + quick replies + complete button ───

  const renderFooter = useCallback(() => (
    <>
      {/* Typing indicator */}
      {isTyping && (
        <View style={[styles.typingRow, isRTL && styles.typingRowRTL]}>
          <View style={[styles.typingAvatar, { backgroundColor: accentColor + '15' }]}>
            <Ionicons
              name={stepIcon as React.ComponentProps<typeof Ionicons>['name']}
              size={16}
              color={accentColor}
            />
          </View>
          <View style={styles.typingBubble}>
            <ActivityIndicator size="small" color={accentColor} />
            <Text style={styles.typingText}>{t('chat.thinking')}</Text>
          </View>
        </View>
      )}

      {/* Quick-reply chips */}
      {activeQuestion && !isTyping && (
        <QuickReplyChips
          options={activeQuestion.options}
          accentColor={accentColor}
          onSelect={handleQuickReplyPress}
        />
      )}

      {/* Complete button */}
      {isComplete && (
        <View style={styles.completeContainer}>
          <TouchableOpacity
            style={[styles.completeBtn, { backgroundColor: accentColor }]}
            onPress={handleComplete}
            accessibilityRole="button"
          >
            <Text style={styles.completeBtnText}>
              {t('selfCheck.chat.continue')}
            </Text>
            <Ionicons
              name={isRTL ? 'arrow-back' : 'arrow-forward'}
              size={18}
              color={colors.textOnPrimary}
            />
          </TouchableOpacity>
        </View>
      )}
    </>
  ), [
    isTyping, activeQuestion, isComplete, accentColor, stepIcon,
    isRTL, t, handleQuickReplyPress, handleComplete,
  ]);

  // ── Main render ────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Messages list */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
      />

      {/* Bottom bar: clarify input or back+help buttons */}
      <View style={[styles.bottomBar, isRTL && styles.bottomBarRTL]}>
        {showClarifyInput ? (
          // Expanded clarification input
          <View style={[styles.clarifyInputRow, isRTL && styles.clarifyInputRowRTL]}>
            <TouchableOpacity
              style={styles.closeClarifyBtn}
              onPress={() => setShowClarifyInput(false)}
            >
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <TextInput
              style={[styles.clarifyInput, isRTL && styles.clarifyInputRTL]}
              placeholder={t('selfCheck.chat.clarifyPlaceholder')}
              placeholderTextColor={colors.textLight}
              value={clarifyText}
              onChangeText={setClarifyText}
              multiline
              maxLength={500}
              textAlign={isRTL ? 'right' : 'left'}
              editable={!isClarifying}
              autoFocus
            />
            <TouchableOpacity
              style={[
                styles.sendClarifyBtn,
                { backgroundColor: accentColor },
                (!clarifyText.trim() || isClarifying) && styles.sendClarifyBtnDisabled,
              ]}
              onPress={handleSendClarification}
              disabled={!clarifyText.trim() || isClarifying}
            >
              <Ionicons
                name={isRTL ? 'arrow-back' : 'arrow-forward'}
                size={18}
                color={colors.textOnPrimary}
              />
            </TouchableOpacity>
          </View>
        ) : (
          // Default: back button + help button
          <>
            <TouchableOpacity style={styles.backBtn} onPress={onBack}>
              <Ionicons
                name={isRTL ? 'arrow-forward' : 'arrow-back'}
                size={18}
                color={colors.textSecondary}
              />
              <Text style={styles.backBtnText}>{t('selfCheck.chat.backToInstructions')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.helpBtn, { borderColor: accentColor + '40' }]}
              onPress={() => setShowClarifyInput(true)}
            >
              <Ionicons name="help-circle-outline" size={18} color={accentColor} />
              <Text style={[styles.helpBtnText, { color: accentColor }]}>
                {t('selfCheck.chat.askQuestion')}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    flexGrow: 1,
  },

  // Typing indicator
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  typingRowRTL: { flexDirection: 'row-reverse' },
  typingAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  typingText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },

  // Complete button
  completeContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    minHeight: MIN_TOUCH_TARGET,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  completeBtnText: {
    color: colors.textOnPrimary,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
  },

  // Bottom bar
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  bottomBarRTL: { flexDirection: 'row-reverse' },

  // Back button
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    minHeight: MIN_TOUCH_TARGET,
  },
  backBtnText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },

  // Help button
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    minHeight: MIN_TOUCH_TARGET,
  },
  helpBtnText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
  },

  // Clarification input
  clarifyInputRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  clarifyInputRowRTL: { flexDirection: 'row-reverse' },
  closeClarifyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clarifyInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSizes.md,
    color: colors.text,
    maxHeight: 80,
    minHeight: MIN_TOUCH_TARGET,
  },
  clarifyInputRTL: { textAlign: 'right', writingDirection: 'rtl' },
  sendClarifyBtn: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendClarifyBtnDisabled: { backgroundColor: colors.disabled },
});
