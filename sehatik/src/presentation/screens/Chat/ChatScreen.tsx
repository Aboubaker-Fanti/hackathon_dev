/**
 * Chat Screen - AI Health Assistant
 * Complete chat with Anthropic Claude integration + offline fallback
 * All conversations confidential - never logged
 */

import React, { useState, useRef, useEffect } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { MedicalDisclaimer } from '../../components/common/MedicalDisclaimer';
import { useLanguageStore } from '../../../application/store/languageStore';
import { useChatStore, type ChatMessage } from '../../../application/store/chatStore';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, MIN_TOUCH_TARGET } from '../../theme/spacing';
import { fontSizes, fontWeights } from '../../theme/typography';

export const ChatScreen: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();
  const { messages, isTyping, sendMessage, loadChat } = useChatStore();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadChat();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, isTyping]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText('');
    await sendMessage(text);
  };

  const suggestions = [
    t('chat.suggestions.symptoms'),
    t('chat.suggestions.screening'),
    t('chat.suggestions.selfExam'),
  ];

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View
      style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.assistantBubble,
        isRTL && (item.isUser ? styles.userBubbleRTL : styles.assistantBubbleRTL),
      ]}
    >
      {!item.isUser && (
        <View style={styles.assistantAvatar}>
          <Text style={styles.avatarText}>💗</Text>
        </View>
      )}
      <View style={[
        styles.bubbleContent,
        item.isUser ? styles.userBubbleContent : styles.assistantBubbleContent,
      ]}>
        <Text
          style={[
            styles.messageText,
            item.isUser ? styles.userMessageText : styles.assistantMessageText,
            isRTL && styles.textRTL,
          ]}
        >
          {item.text}
        </Text>
        <Text style={[styles.messageTime, item.isUser && styles.messageTimeUser]}>
          {new Date(item.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { direction: isRTL ? 'rtl' : 'ltr' }]}
      edges={['top', 'left', 'right']}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={{ fontSize: 24 }}>💗</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, isRTL && styles.textRTL]}>{t('chat.title')}</Text>
          <Text style={[styles.subtitle, isRTL && styles.textRTL]}>{t('chat.subtitle')}</Text>
        </View>
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimerContainer}>
        <MedicalDisclaimer compact />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.welcomeIcon}>👋</Text>
            <Text style={[styles.welcomeText, isRTL && styles.textRTL]}>
              {t('chat.welcome')}
            </Text>
          </View>
        }
        ListFooterComponent={
          <>
            {isTyping && (
              <View style={[styles.messageBubble, styles.assistantBubble]}>
                <View style={styles.assistantAvatar}>
                  <Text style={styles.avatarText}>💗</Text>
                </View>
                <View style={styles.typingContainer}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={styles.typingText}>{t('chat.thinking')}</Text>
                </View>
              </View>
            )}
            {messages.length === 0 && (
              <View style={styles.suggestionsContainer}>
                {suggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionChip}
                    onPress={() => sendMessage(suggestion)}
                    accessibilityRole="button"
                  >
                    <Text style={[styles.suggestionText, isRTL && styles.textRTL]}>
                      {suggestion}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        }
      />

      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.inputContainer, isRTL && styles.inputContainerRTL]}>
          <TextInput
            style={[styles.input, isRTL && styles.inputRTL]}
            placeholder={t('chat.placeholder')}
            placeholderTextColor={colors.textLight}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
            textAlign={isRTL ? 'right' : 'left'}
            onSubmitEditing={handleSend}
            editable={!isTyping}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isTyping) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isTyping}
            accessibilityRole="button"
            accessibilityLabel={t('chat.send')}
          >
            <Text style={styles.sendIcon}>{isRTL ? '⬅️' : '➡️'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  textRTL: { textAlign: 'right', writingDirection: 'rtl' },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md, paddingBottom: spacing.sm,
  },
  headerIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary + '15',
    justifyContent: 'center', alignItems: 'center',
  },
  headerText: { flex: 1 },
  title: { fontSize: fontSizes.xl, fontWeight: fontWeights.bold, color: colors.text },
  subtitle: { fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: 2 },
  disclaimerContainer: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  messagesList: { padding: spacing.md, flexGrow: 1 },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xl },
  welcomeIcon: { fontSize: 40, marginBottom: spacing.md },
  welcomeText: {
    fontSize: fontSizes.md, color: colors.textSecondary, textAlign: 'center',
    lineHeight: fontSizes.md * 1.5, paddingHorizontal: spacing.lg,
  },
  messageBubble: {
    flexDirection: 'row', marginBottom: spacing.md, alignItems: 'flex-end',
  },
  userBubble: { justifyContent: 'flex-end' },
  assistantBubble: { justifyContent: 'flex-start' },
  userBubbleRTL: { justifyContent: 'flex-start' },
  assistantBubbleRTL: { justifyContent: 'flex-end' },
  assistantAvatar: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary + '15',
    justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm,
  },
  avatarText: { fontSize: 16 },
  bubbleContent: { maxWidth: '78%', padding: spacing.md, borderRadius: borderRadius.lg },
  userBubbleContent: {
    backgroundColor: colors.primary, borderBottomRightRadius: spacing.xs,
  },
  assistantBubbleContent: {
    backgroundColor: colors.surface, borderBottomLeftRadius: spacing.xs,
    elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
  },
  messageText: { fontSize: fontSizes.md, lineHeight: fontSizes.md * 1.5 },
  userMessageText: { color: colors.textOnPrimary },
  assistantMessageText: { color: colors.text },
  messageTime: {
    fontSize: fontSizes.xs, color: colors.textLight, marginTop: spacing.xs, alignSelf: 'flex-end',
  },
  messageTimeUser: { color: colors.textOnPrimary + 'AA' },
  typingContainer: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.lg,
  },
  typingText: { fontSize: fontSizes.sm, color: colors.textSecondary, fontStyle: 'italic' },
  suggestionsContainer: { gap: spacing.sm, marginTop: spacing.lg },
  suggestionChip: {
    backgroundColor: colors.accent + '10', borderRadius: borderRadius.xl,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    borderWidth: 1, borderColor: colors.accent + '30',
    minHeight: MIN_TOUCH_TARGET, justifyContent: 'center',
  },
  suggestionText: { fontSize: fontSizes.sm, color: colors.accent, fontWeight: fontWeights.medium },
  inputContainer: {
    flexDirection: 'row', alignItems: 'flex-end', padding: spacing.md,
    backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.sm,
  },
  inputContainerRTL: { flexDirection: 'row-reverse' },
  input: {
    flex: 1, backgroundColor: colors.background, borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    fontSize: fontSizes.md, color: colors.text, maxHeight: 100, minHeight: MIN_TOUCH_TARGET,
  },
  inputRTL: { textAlign: 'right', writingDirection: 'rtl' },
  sendButton: {
    width: MIN_TOUCH_TARGET, height: MIN_TOUCH_TARGET, borderRadius: borderRadius.round,
    backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  sendButtonDisabled: { backgroundColor: colors.disabled },
  sendIcon: { fontSize: 20 },
});
