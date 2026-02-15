/**
 * ChatScreen — Modern 2026 Design
 * Clean, flat UI using app's pink theme.
 * Full-screen Lottie audio overlay (ChatGPT-style).
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
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { MedicalDisclaimer } from '../../components/common/MedicalDisclaimer';
import { useLanguageStore } from '../../../application/store/languageStore';
import { useChatStore, type ChatMessage } from '../../../application/store/chatStore';
import { spacing } from '../../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Typing Indicator ──────────────────────────────────────────────
const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      );
    Animated.parallel([
      animate(dot1, 0),
      animate(dot2, 150),
      animate(dot3, 300),
    ]).start();
  }, []);

  return (
    <View style={styles.typingRow}>
      <View style={styles.typingBubble}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            style={[styles.typingDot, { transform: [{ translateY: dot }] }]}
          />
        ))}
      </View>
    </View>
  );
};

// ─── Audio Overlay (ChatGPT-style) ─────────────────────────────────
const AudioOverlay = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const ring1 = useRef(new Animated.Value(1)).current;
  const ring2 = useRef(new Animated.Value(1)).current;
  const ring3 = useRef(new Animated.Value(1)).current;
  const ring1Opacity = useRef(new Animated.Value(0.3)).current;
  const ring2Opacity = useRef(new Animated.Value(0.2)).current;
  const ring3Opacity = useRef(new Animated.Value(0.1)).current;

  useEffect(() => {
    if (!visible) return;

    const pulseRing = (scale: Animated.Value, opacity: Animated.Value, maxScale: number, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scale, { toValue: maxScale, duration: 1500, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 1500, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: maxScale === 1.6 ? 0.3 : maxScale === 2 ? 0.2 : 0.1, duration: 0, useNativeDriver: true }),
          ]),
        ])
      );

    Animated.parallel([
      pulseRing(ring1, ring1Opacity, 1.6, 0),
      pulseRing(ring2, ring2Opacity, 2, 400),
      pulseRing(ring3, ring3Opacity, 2.4, 800),
    ]).start();
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
      <View style={styles.overlayContainer}>
        {/* Pulsing rings */}
        <View style={styles.ringsContainer}>
          {[
            { scale: ring1, opacity: ring1Opacity, size: 160 },
            { scale: ring2, opacity: ring2Opacity, size: 160 },
            { scale: ring3, opacity: ring3Opacity, size: 160 },
          ].map((ring, i) => (
            <Animated.View
              key={i}
              style={[
                styles.pulseRing,
                {
                  width: ring.size,
                  height: ring.size,
                  borderRadius: ring.size / 2,
                  transform: [{ scale: ring.scale }],
                  opacity: ring.opacity,
                },
              ]}
            />
          ))}

          {/* Lottie Robot */}
          <View style={styles.lottieWrapper}>
            <LottieView
              source={require('../../../../assets/robot.json')}
              autoPlay
              loop
              style={styles.lottieRobot}
            />
          </View>
        </View>

        {/* Label */}
        <Text style={styles.overlayLabel}>Listening...</Text>
        <Text style={styles.overlayHint}>Tap the button below to stop</Text>

        {/* Stop Button */}
        <TouchableOpacity onPress={onClose} style={styles.stopButton} activeOpacity={0.7}>
          <View style={styles.stopSquare} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

// ─── Main Component ─────────────────────────────────────────────────
export const ChatScreen: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();
  const { messages, isTyping, sendMessage, loadChat } = useChatStore();
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

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

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View
      style={[
        styles.messageRow,
        item.isUser ? styles.rowUser : styles.rowBot,
        isRTL && (item.isUser ? styles.rowUserRTL : styles.rowBotRTL),
      ]}
    >
      {/* Bot avatar */}
      {!item.isUser && (
        <View style={styles.avatarSmall}>
          <Ionicons name="sparkles" size={14} color="#E11D48" />
        </View>
      )}

      <View
        style={[
          styles.bubble,
          item.isUser ? styles.bubbleUser : styles.bubbleBot,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.isUser ? styles.textUser : styles.textBot,
            isRTL && styles.textRTL,
          ]}
        >
          {item.text}
        </Text>
        <Text
          style={[
            styles.timeStamp,
            item.isUser ? styles.timeUser : styles.timeBot,
          ]}
        >
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
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#E11D48" />
          </View>
          <View>
            <Text style={[styles.headerTitle, isRTL && styles.textRTL]}>
              {t('chat.title')}
            </Text>
            <Text style={[styles.headerSubtitle, isRTL && styles.textRTL]}>
              AI Health Assistant
            </Text>
          </View>
        </View>
        <View style={styles.onlineBadge}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>Online</Text>
        </View>
      </View>

      {/* ── Disclaimer ── */}
      <View style={styles.disclaimerWrap}>
        <MedicalDisclaimer compact />
      </View>

      {/* ── Chat Messages ── */}
      <View style={styles.chatArea}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="chatbubble-outline" size={36} color="#E11D48" />
              </View>
              <Text style={styles.emptyTitle}>{t('chat.welcome')}</Text>
              <Text style={styles.emptySubText}>
                Ask me about your symptoms or health goals.
              </Text>
            </View>
          }
        />
        {isTyping && <TypingIndicator />}
      </View>

      {/* ── Input Bar ── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.inputField, isRTL && styles.textRTL]}
            placeholder={t('chat.placeholder')}
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
            textAlign={isRTL ? 'right' : 'left'}
          />

          {inputText.length > 0 ? (
            <TouchableOpacity
              onPress={handleSend}
              style={styles.sendBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="send" size={18} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setIsRecording(true)}
              style={styles.micButton}
              activeOpacity={0.7}
            >
              <Ionicons name="mic-outline" size={22} color="#E11D48" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* ── Audio Overlay ── */}
      <AudioOverlay
        visible={isRecording}
        onClose={() => setIsRecording(false)}
      />
    </SafeAreaView>
  );
};

// ─── Styles ─────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 1,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  onlineText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16A34A',
  },

  /* Disclaimer */
  disclaimerWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },

  /* Chat Area */
  chatArea: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 12,
  },

  /* Messages */
  messageRow: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  rowUser: { justifyContent: 'flex-end' },
  rowBot: { justifyContent: 'flex-start' },
  rowUserRTL: { justifyContent: 'flex-start' },
  rowBotRTL: { justifyContent: 'flex-end' },

  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 2,
  },

  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  bubbleUser: {
    backgroundColor: '#E11D48',
    borderBottomRightRadius: 6,
  },
  bubbleBot: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },

  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  textUser: { color: '#FFFFFF' },
  textBot: { color: '#1F2937' },

  timeStamp: {
    fontSize: 10,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  timeUser: { color: 'rgba(255,255,255,0.7)' },
  timeBot: { color: '#9CA3AF' },

  /* Typing Indicator */
  typingRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderTopLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 5,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },

  /* Empty State */
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  emptySubText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    maxWidth: 260,
  },

  /* Input Bar */
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginBottom: Platform.OS === 'ios' ? 4 : 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputField: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    paddingHorizontal: 4,
    maxHeight: 100,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    lineHeight: 20,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E11D48',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  micButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  /* ── Audio Overlay ── */
  overlayContainer: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringsContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    backgroundColor: '#E11D48',
    borderWidth: 0,
  },
  lottieWrapper: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 10,
  },
  lottieRobot: {
    width: 140,
    height: 140,
  },

  overlayLabel: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 40,
    letterSpacing: 0.5,
  },
  overlayHint: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  stopButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48,
    ...Platform.select({
      ios: {
        shadowColor: '#DC2626',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: { elevation: 8 },
    }),
  },
  stopSquare: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
});