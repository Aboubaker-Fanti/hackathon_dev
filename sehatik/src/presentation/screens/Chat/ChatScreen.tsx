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
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
// Importing modern Lucide icons
import { 
  Bot, 
  Mic, 
  Image as ImageIcon, 
  Send, 
  MoreVertical, 
  X, 
  Activity, 
  AudioLines 
} from 'lucide-react-native';
import { MedicalDisclaimer } from '../../components/common/MedicalDisclaimer';
import { useLanguageStore } from '../../../application/store/languageStore';
import { useChatStore, type ChatMessage } from '../../../application/store/chatStore';
import { colors } from '../../theme/colors'; 
import { spacing } from '../../theme/spacing'; 
import { fontSizes } from '../../theme/typography'; 

const { width } = Dimensions.get('window');

// --- Sub-Components ---

// 1. Animated Robot Component (Now using Vector Icon)
const RobotAvatar = ({ isTyping }: { isTyping: boolean }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(bounceAnim, { toValue: -5, duration: 400, useNativeDriver: true }),
            Animated.timing(bounceAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(glowAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.timing(glowAnim, { toValue: 0.5, duration: 800, useNativeDriver: true }),
          ])
        ])
      ).start();
    } else {
      bounceAnim.setValue(0);
      glowAnim.setValue(0);
    }
  }, [isTyping]);

  return (
    <View style={styles.robotContainer}>
      <Animated.View style={[
        styles.robotGlow,
        {
          opacity: isTyping ? glowAnim : 0,
          transform: [{ scale: isTyping ? 1.2 : 1 }]
        }
      ]} />
      <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
        <View style={styles.robotCircle}>
          {/* Replaced Emoji with Lucide Bot Icon */}
          <Bot size={32} color="#4E9AF1" strokeWidth={1.5} />
        </View>
      </Animated.View>
      {isTyping && (
        <View style={styles.statusBadge}>
          <Activity size={10} color="#4E9AF1" />
          <Text style={styles.statusText}>Processing...</Text>
        </View>
      )}
    </View>
  );
};

// 2. Audio Recording Visualization
const RecordingBar = ({ onCancel }: { onCancel: () => void }) => {
  const waveAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, { toValue: 1.2, duration: 500, useNativeDriver: true }),
        Animated.timing(waveAnim, { toValue: 0.8, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.recordingContainer}>
      <View style={styles.recordingIndicator}>
        <Animated.View style={{ opacity: waveAnim, marginRight: 8 }}>
            <View style={styles.recordingDot} />
        </Animated.View>
        <Text style={styles.recordingTimer}>00:03</Text> 
      </View>
      
      <View style={styles.waveVisualizer}>
          <AudioLines size={24} color="#FF3D71" />
          <Text style={styles.recordingHint}>Recording...</Text>
      </View>

      <TouchableOpacity onPress={onCancel} style={styles.cancelRecordButton}>
        <X size={16} color="#8F9BB3" />
      </TouchableOpacity>
    </View>
  );
};

// --- Main Component ---

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

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    return (
      <View
        style={[
          styles.messageRow,
          item.isUser ? styles.rowUser : styles.rowBot,
          isRTL && (item.isUser ? styles.rowUserRTL : styles.rowBotRTL),
        ]}
      >
        <View style={[
          styles.bubble,
          item.isUser ? styles.bubbleUser : styles.bubbleBot,
        ]}>
          <Text
            style={[
              styles.messageText,
              item.isUser ? styles.textUser : styles.textBot,
              isRTL && styles.textRTL,
            ]}
          >
            {item.text}
          </Text>
          <Text style={[
            styles.timeStamp,
            item.isUser ? styles.timeUser : styles.timeBot
          ]}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { direction: isRTL ? 'rtl' : 'ltr' }]}
      edges={['top', 'left', 'right']}
    >
      {/* 1. Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, isRTL && styles.textRTL]}>{t('chat.title')}</Text>
          <Text style={[styles.headerSubtitle, isRTL && styles.textRTL]}>AI Health Assistant</Text>
        </View>
        <TouchableOpacity style={styles.optionsButton}>
          <MoreVertical size={24} color="#1A2B48" />
        </TouchableOpacity>
      </View>

      {/* 2. Robot Stage */}
      <View style={styles.robotStage}>
        <RobotAvatar isTyping={isTyping} />
      </View>

      <MedicalDisclaimer compact />

      {/* 3. Chat Area */}
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
              <Bot size={48} color="#CBD5E0" style={{marginBottom: 16}} />
              <Text style={styles.emptyText}>{t('chat.welcome')}</Text>
              <Text style={styles.emptySubText}>Ask me about your symptoms or health goals.</Text>
            </View>
          }
        />
      </View>

      {/* 4. Input Bar */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.inputWrapper, styles.shadow]}>
          
          {isRecording ? (
            <RecordingBar onCancel={() => setIsRecording(false)} />
          ) : (
            <>
              {/* Gallery Button (Non-functional) */}
              <TouchableOpacity 
                activeOpacity={1} 
                style={styles.actionButton}
              >
                <ImageIcon size={22} color="#8F9BB3" />
              </TouchableOpacity>

              <TextInput
                style={[styles.inputField, isRTL && styles.textRTL]}
                placeholder={t('chat.placeholder')}
                placeholderTextColor="#999"
                value={inputText}
                onChangeText={setInputText}
                multiline
                textAlign={isRTL ? 'right' : 'left'}
              />

              {inputText.length > 0 ? (
                /* Send Button */
                <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
                  <Send size={18} color="#fff" style={{ marginLeft: 2 }} />
                </TouchableOpacity>
              ) : (
                /* Audio Button */
                <TouchableOpacity 
                  onPress={() => setIsRecording(true)} 
                  style={styles.micButton}
                >
                  <Mic size={22} color="#4E9AF1" />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  textRTL: { textAlign: 'right', writingDirection: 'rtl' },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSizes.xl,
    fontWeight: '800',
    color: '#1A2B48',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: fontSizes.sm,
    color: '#8F9BB3',
    marginTop: 2,
  },
  optionsButton: {
    padding: spacing.sm,
  },

  // Robot Stage
  robotStage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    backgroundColor: '#F7F9FC',
    zIndex: 10,
  },
  robotContainer: {
    alignItems: 'center',
    position: 'relative',
    height: 80,
    justifyContent: 'center',
  },
  robotCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#22292F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    zIndex: 2,
    borderWidth: 1,
    borderColor: '#F0F4F8',
  },
  robotGlow: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4E9AF1',
    zIndex: 1,
  },
  statusBadge: {
    position: 'absolute',
    bottom: -15,
    backgroundColor: '#E4F0FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#fff',
  },
  statusText: {
    fontSize: 10,
    color: '#4E9AF1',
    fontWeight: '700',
  },

  // Chat Area
  chatArea: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  messageRow: {
    marginBottom: spacing.md,
    width: '100%',
    flexDirection: 'row',
  },
  rowUser: { justifyContent: 'flex-end' },
  rowBot: { justifyContent: 'flex-start' },
  rowUserRTL: { justifyContent: 'flex-start' },
  rowBotRTL: { justifyContent: 'flex-end' },

  bubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  bubbleUser: {
    backgroundColor: '#4E9AF1',
    borderBottomRightRadius: 4,
  },
  bubbleBot: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  textUser: { color: '#FFFFFF' },
  textBot: { color: '#2E3A59' },
  timeStamp: {
    fontSize: 10,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  timeUser: { color: 'rgba(255,255,255,0.7)' },
  timeBot: { color: '#8F9BB3' },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    opacity: 0.6,
  },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#2E3A59', marginBottom: 8 },
  emptySubText: { fontSize: 14, color: '#8F9BB3' },

  // Input Bar
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: spacing.md,
    marginBottom: Platform.OS === 'ios' ? 0 : spacing.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#EDF1F7',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    color: '#2E3A59',
    paddingHorizontal: 12,
    maxHeight: 100,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
  },
  actionButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4E9AF1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },

  // Recording UI
  recordingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    height: 40,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waveVisualizer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3D71',
  },
  recordingTimer: {
    color: '#FF3D71',
    fontWeight: '600',
    fontSize: 14,
    fontVariant: ['tabular-nums'],
  },
  recordingHint: {
    color: '#8F9BB3',
    fontSize: 14,
    marginLeft: 8
  },
  cancelRecordButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F7F9FC',
    justifyContent: 'center',
    alignItems: 'center',
  },
});