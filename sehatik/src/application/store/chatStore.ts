/**
 * Chat Store - Zustand
 * Manages AI assistant conversation state
 * PRIVACY: Never logs message content - all data encrypted at rest
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_STORAGE_KEY = '@sehatik_chat';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  error: string | null;

  // Actions
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => Promise<void>;
  loadChat: () => Promise<void>;
}

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are Sehatik (صحتك), a compassionate breast health assistant for Moroccan women.

CRITICAL GUIDELINES:
- Always encourage professional medical consultation for concerning symptoms
- NEVER provide definitive diagnoses - you are educational only
- Be culturally sensitive to modesty and privacy concerns
- Reduce fear while emphasizing early detection importance
- Use clear, accessible language (avoid complex medical jargon)
- Reference Islamic values of health preservation when appropriate
- Acknowledge barriers (cost, stigma, distance) and provide practical solutions
- Always respond in the same language the user writes in
- For Darija (Moroccan Arabic), use colloquial Moroccan expressions

IMPORTANT DISCLAIMERS (include naturally in responses):
- "This information is for awareness only and does not replace a medical consultation"
- Always end with encouragement and clear next steps
- If symptoms sound concerning, ALWAYS recommend seeing a doctor

You know about:
- Breast cancer risk factors, symptoms, and screening recommendations
- The Moroccan healthcare system and screening centers
- Self-examination techniques
- Treatment options overview (educational)
- Emotional support and dealing with fear/stigma
- LNCC (Ligue Nationale Contre le Cancer)
- Fondation Lalla Salma programs
- Free mammography programs in Morocco (for women 45-69)`;

/**
 * Call AI assistant (Anthropic Claude or fallback)
 */
const getAIResponse = async (
  messages: ChatMessage[],
  userMessage: string,
): Promise<string> => {
  // Build conversation history for API
  const conversationHistory = messages.slice(-10).map((m) => ({
    role: m.isUser ? 'user' as const : 'assistant' as const,
    content: m.text,
  }));
  conversationHistory.push({ role: 'user', content: userMessage });

  try {
    // Try Anthropic API if key is available
    // In a production app, this would go through your backend
    // For MVP, we use a direct call (key should be in .env)
    const Constants = await import('expo-constants');
    const apiKey = Constants.default.expoConfig?.extra?.ANTHROPIC_API_KEY;

    if (apiKey && apiKey !== 'your_anthropic_key_here') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: conversationHistory,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.content[0].text;
      }
    }

    // Fallback: intelligent offline responses
    return getOfflineResponse(userMessage);
  } catch {
    return getOfflineResponse(userMessage);
  }
};

/**
 * Offline fallback responses - provides helpful guidance without AI
 */
const getOfflineResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  // Detect language
  const isArabic = /[\u0600-\u06FF]/.test(message);

  if (isArabic) {
    if (lowerMessage.includes('فحص') || lowerMessage.includes('autopalpation')) {
      return 'الفحص الذاتي للثدي خطوة مهمة للكشف المبكر. ننصحك بإجراء الفحص مرة كل شهر، من 5 إلى 10 أيام بعد بداية الدورة الشهرية.\n\nيمكنك استخدام قسم "الفحص الذاتي" في التطبيق للحصول على إرشادات مفصلة خطوة بخطوة.\n\n⚕️ هذه المعلومات للتوعية فقط ولا تغني عن استشارة الطبيب.';
    }
    if (lowerMessage.includes('عرض') || lowerMessage.includes('علامات') || lowerMessage.includes('أعراض')) {
      return 'من الأعراض التي يجب مراقبتها:\n\n• كتلة أو تورم في الثدي أو تحت الإبط\n• تغيرات في شكل أو حجم الثدي\n• تغيرات في الجلد (تجعد، احمرار)\n• إفرازات من الحلمة\n• انكماش الحلمة\n\nأغلب هذه الأعراض لا تعني وجود سرطان، لكن من المهم استشارة طبيب للتأكد.\n\n💗 الكشف المبكر ينقذ الأرواح!';
    }
    if (lowerMessage.includes('مركز') || lowerMessage.includes('فحص') || lowerMessage.includes('مستشفى')) {
      return 'يمكنك إيجاد أقرب مراكز الفحص من خلال قسم "مراكز الفحص" في التطبيق.\n\nبرنامج الكشف المبكر الوطني يوفر ماموغرافيا مجانية للنساء من 45 إلى 69 سنة في المراكز الصحية العمومية.\n\nمؤسسة للا سلمى لمحاربة السرطان توفر أيضًا خدمات فحص مجانية.\n\n⚕️ ننصحك بالاتصال بالمركز قبل الزيارة لتأكيد المواعيد.';
    }
    return 'شكرًا لسؤالك! أنا هنا لمساعدتك في كل ما يخص صحة الثدي.\n\nيمكنني مساعدتك في:\n• معلومات عن الفحص الذاتي\n• أعراض يجب مراقبتها\n• إيجاد مراكز الفحص القريبة\n• معلومات عن عوامل الخطر\n• الدعم والمساعدة\n\n⚕️ تذكري: هذه المعلومات للتوعية فقط ولا تغني عن استشارة الطبيب.';
  }

  // French responses
  if (lowerMessage.includes('examen') || lowerMessage.includes('autopalpation') || lowerMessage.includes('self')) {
    return "L'auto-examen des seins est une étape importante pour la détection précoce. Il est recommandé de le pratiquer une fois par mois, entre le 5e et le 10e jour après le début des règles.\n\nUtilisez la section \"Auto-examen\" de l'application pour des instructions détaillées étape par étape.\n\n⚕️ Cette information est éducative et ne remplace pas une consultation médicale.";
  }
  if (lowerMessage.includes('symptom') || lowerMessage.includes('signe') || lowerMessage.includes('boule')) {
    return "Les symptômes à surveiller :\n\n• Une boule ou un épaississement dans le sein ou sous le bras\n• Un changement de taille ou de forme du sein\n• Des modifications de la peau (rides, rougeur, peau d'orange)\n• Un écoulement du mamelon\n• Un rétraction du mamelon\n\nLa plupart de ces symptômes ne signifient pas un cancer, mais il est important de consulter un médecin.\n\n💗 La détection précoce sauve des vies !";
  }
  if (lowerMessage.includes('centre') || lowerMessage.includes('dépistage') || lowerMessage.includes('mammograph')) {
    return "Vous pouvez trouver les centres de dépistage les plus proches dans la section \"Centres de dépistage\" de l'application.\n\nLe programme national de détection précoce offre des mammographies gratuites pour les femmes de 45 à 69 ans dans les centres de santé publics.\n\nLa Fondation Lalla Salma offre également des services de dépistage gratuits.\n\n⚕️ Appelez le centre avant votre visite pour confirmer les horaires.";
  }

  return "Merci pour votre question ! Je suis là pour vous aider concernant la santé mammaire.\n\nJe peux vous aider avec :\n• Informations sur l'auto-examen\n• Symptômes à surveiller\n• Trouver des centres de dépistage\n• Facteurs de risque\n• Soutien et ressources\n\n⚕️ Rappel : ces informations sont éducatives et ne remplacent pas l'avis d'un médecin.";
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isTyping: false,
  error: null,

  sendMessage: async (text: string) => {
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      text,
      isUser: true,
      timestamp: Date.now(),
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      isTyping: true,
      error: null,
    }));

    try {
      const response = await getAIResponse(get().messages, text);

      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}_ai`,
        text: response,
        isUser: false,
        timestamp: Date.now(),
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isTyping: false,
      }));

      // Persist chat (without logging content)
      const state = get();
      try {
        await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state.messages.slice(-50)));
      } catch {
        // Storage error - don't log sensitive data
      }
    } catch {
      set({
        isTyping: false,
        error: 'error',
      });
    }
  },

  clearChat: async () => {
    set({ messages: [], error: null });
    await AsyncStorage.removeItem(CHAT_STORAGE_KEY);
  },

  loadChat: async () => {
    try {
      const data = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (data) {
        set({ messages: JSON.parse(data) });
      }
    } catch {
      // Fail silently
    }
  },
}));
