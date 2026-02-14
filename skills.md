# Developer Skills Guide: Breast Health Companion App (Morocco)

## Overview
This document outlines the technical skills, architectural patterns, and implementation guidelines for building a culturally-tailored breast health companion app for Moroccan women. The app aims to reduce diagnostic delay through AI-assisted self-examination guidance, education, and navigation support.

---

## Table of Contents
1. [Core Technical Stack](#core-technical-stack)
2. [Architecture & Design Patterns](#architecture--design-patterns)
3. [AI/ML Implementation](#aiml-implementation)
4. [Cultural & Localization Considerations](#cultural--localization-considerations)
5. [Privacy & Security](#privacy--security)
6. [UX/UI Best Practices](#uxui-best-practices)
7. [Healthcare Compliance](#healthcare-compliance)
8. [Testing & Quality Assurance](#testing--quality-assurance)
9. [Performance & Offline Support](#performance--offline-support)
10. [Deployment & Monitoring](#deployment--monitoring)

---

## Core Technical Stack

### Frontend (Mobile App)
**Recommended: React Native or Flutter**

**Why?**
- Cross-platform support (iOS + Android) with single codebase
- Rich ecosystem for healthcare apps
- Strong support for RTL (Right-to-Left) languages (Arabic)
- Good 3D rendering capabilities

**Key Libraries:**
- **3D Visualization**: Three.js (React Native) or Flutter's 3D packages
- **Notifications**: `react-native-push-notification` or `flutter_local_notifications`
- **Localization**: `i18next` (React Native) or `flutter_localizations`
- **State Management**: Redux/MobX (React Native) or Riverpod/Bloc (Flutter)
- **Maps Integration**: Google Maps API or Mapbox for screening center locations
- **Analytics**: Firebase Analytics or Mixpanel
- **Crash Reporting**: Sentry or Firebase Crashlytics

### Backend
**Recommended: Node.js (Express/NestJS) or Python (FastAPI/Django)**

**Key Components:**
- RESTful API or GraphQL for data exchange
- JWT-based authentication
- PostgreSQL or MongoDB for data persistence
- Redis for caching and session management
- Message queue (RabbitMQ/Redis) for notification scheduling

### AI/ML Infrastructure
**Recommended Stack:**
- **NLP Models**: OpenAI API, Anthropic Claude API, or local models (Llama 2/3)
- **Symptom Assessment**: Custom decision tree or rule-based system + LLM
- **Training Framework**: TensorFlow/PyTorch (if building custom models)
- **Deployment**: TensorFlow Lite or ONNX Runtime for on-device inference
- **Vector Database**: Pinecone or Weaviate for RAG-based knowledge retrieval

### Infrastructure
- **Cloud Provider**: AWS, Google Cloud, or Azure
- **CDN**: CloudFlare or AWS CloudFront
- **CI/CD**: GitHub Actions, GitLab CI, or Jenkins
- **Container Orchestration**: Docker + Kubernetes (for scalability)

---

## Architecture & Design Patterns

### 1. Microservices Architecture (Recommended for Scale)

```
┌─────────────────┐
│   Mobile App    │
└────────┬────────┘
         │
    ┌────▼─────┐
    │ API Gateway │
    └────┬─────┘
         │
    ┌────┴──────────────────────────────┐
    │                                    │
┌───▼────┐  ┌──────────┐  ┌──────────┐ ┌─────────┐
│ Auth   │  │ AI Chat  │  │ Screening│ │ Notif   │
│ Service│  │ Service  │  │ Service  │ │ Service │
└────────┘  └──────────┘  └──────────┘ └─────────┘
                │
         ┌──────▼──────┐
         │ Knowledge   │
         │ Base (RAG)  │
         └─────────────┘
```

### 2. Clean Architecture Layers
```
┌──────────────────────────────────┐
│  Presentation Layer (UI/Views)   │
├──────────────────────────────────┤
│  Application Layer (Use Cases)   │
├──────────────────────────────────┤
│  Domain Layer (Business Logic)   │
├──────────────────────────────────┤
│  Infrastructure Layer (Data/API) │
└──────────────────────────────────┘
```

### 3. Key Design Patterns
- **Repository Pattern**: Abstract data access logic
- **Factory Pattern**: Create different types of notifications/reminders
- **Strategy Pattern**: Different symptom assessment algorithms
- **Observer Pattern**: Real-time updates for screening center availability
- **Command Pattern**: Queue-based notification system

---

## AI/ML Implementation

### 1. Guided AI-Assisted Autopalpation

**Architecture:**
```
User Input → Structured Questionnaire → Decision Tree → LLM Enhancement → Output
```

**Implementation Approach:**

**Step 1: Structured Data Collection**
```javascript
const autopalpationFlow = {
  sections: [
    {
      id: 'visual_inspection',
      questions: [
        { id: 'skin_changes', type: 'boolean', text_fr: '...', text_ar: '...' },
        { id: 'nipple_discharge', type: 'boolean', text_fr: '...', text_ar: '...' },
        { id: 'asymmetry', type: 'boolean', text_fr: '...', text_ar: '...' }
      ]
    },
    {
      id: 'palpation',
      questions: [
        { id: 'lump_detected', type: 'boolean', text_fr: '...', text_ar: '...' },
        { id: 'lump_location', type: 'quadrant_selector', dependsOn: 'lump_detected' },
        { id: 'lump_characteristics', type: 'multi_select', options: ['hard', 'mobile', 'painful'] }
      ]
    }
  ]
};
```

**Step 2: 3D Guidance Integration**
```javascript
// Example: Three.js 3D Model
import * as THREE from 'three';

class BreastModelGuide {
  constructor(container) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.loadBreastModel();
  }
  
  highlightArea(quadrant) {
    // Highlight specific breast quadrant for palpation
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xff6b9d, 
      opacity: 0.7, 
      transparent: true 
    });
    this.applyMaterialToQuadrant(quadrant, material);
  }
  
  animatePalpationTechnique(technique) {
    // Show circular or vertical strip palpation pattern
  }
}
```

**Step 3: Symptom Assessment Logic**
```python
# Backend: Risk Stratification Algorithm
def assess_symptoms(responses):
    risk_score = 0
    red_flags = []
    
    # Rule-based initial screening
    if responses.get('lump_detected') and responses.get('lump_hard'):
        risk_score += 3
        red_flags.append('hard_lump')
    
    if responses.get('nipple_discharge') and responses.get('bloody_discharge'):
        risk_score += 3
        red_flags.append('bloody_discharge')
    
    if responses.get('skin_changes') == 'peau_orange':
        risk_score += 3
        red_flags.append('peau_orange')
    
    # Determine recommendation
    if risk_score >= 3 or len(red_flags) > 0:
        recommendation = 'urgent_consultation'
    elif risk_score >= 1:
        recommendation = 'schedule_checkup'
    else:
        recommendation = 'continue_monitoring'
    
    # Enhance with LLM for personalized messaging
    enhanced_message = generate_culturally_sensitive_message(
        recommendation, 
        red_flags, 
        user_profile
    )
    
    return {
        'risk_level': recommendation,
        'message': enhanced_message,
        'next_steps': get_next_steps(recommendation)
    }
```

**Step 4: LLM Integration for Chat Support**
```python
# Using Anthropic Claude API
import anthropic

def get_ai_response(user_message, conversation_history, user_context):
    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
    
    system_prompt = """You are a compassionate breast health assistant for Moroccan women.
    
CRITICAL GUIDELINES:
- Always encourage professional medical consultation for concerning symptoms
- Never provide definitive diagnoses
- Be culturally sensitive to modesty and privacy concerns
- Reduce fear while emphasizing early detection importance
- Use clear, accessible language (avoid complex medical jargon)
- Reference Islamic values of health preservation when appropriate
- Acknowledge barriers (cost, stigma) and provide practical solutions

User Context: {user_context}

Always end responses with encouragement and clear next steps."""
    
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=system_prompt.format(user_context=user_context),
        messages=conversation_history + [
            {"role": "user", "content": user_message}
        ]
    )
    
    return message.content[0].text
```

### 2. Knowledge Base (RAG System)

**Architecture:**
```
Medical Content → Chunking → Embedding → Vector DB → LLM Retrieval
```

**Implementation:**
```python
from langchain.vectorstores import Pinecone
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Index medical knowledge
def build_knowledge_base():
    documents = [
        # Breast cancer info in French, Arabic, Darija
        {"content": "...", "language": "fr", "category": "symptoms"},
        {"content": "...", "language": "ar", "category": "treatment"},
        {"content": "...", "language": "darija", "category": "screening"}
    ]
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    
    chunks = text_splitter.split_documents(documents)
    embeddings = OpenAIEmbeddings()
    vectorstore = Pinecone.from_documents(chunks, embeddings, index_name="breast-health-kb")
    
    return vectorstore

# Retrieve relevant info
def answer_question(question, language='fr'):
    vectorstore = get_vectorstore()
    relevant_docs = vectorstore.similarity_search(question, k=3, filter={"language": language})
    
    context = "\n".join([doc.page_content for doc in relevant_docs])
    
    # Pass to LLM with context
    response = get_ai_response(question, context)
    return response
```

---

## Cultural & Localization Considerations

### 1. Multi-Language Support (Critical)

**Required Languages:**
- **French** (primary medical/official language)
- **Moroccan Arabic (Darija)** (spoken by majority)
- **Modern Standard Arabic** (religious/formal contexts)

**Implementation:**
```javascript
// i18n configuration
const resources = {
  fr: {
    translation: {
      "autopalpation.title": "Auto-examen des seins",
      "screening.nearest": "Centres de dépistage à proximité",
      // ...
    }
  },
  ar: {
    translation: {
      "autopalpation.title": "الفحص الذاتي للثدي",
      "screening.nearest": "أقرب مراكز الفحص",
      // ...
    }
  },
  darija: {
    translation: {
      "autopalpation.title": "الفحص ديال الثدي بوحدك",
      "screening.nearest": "أقرب مراكز الفحص ليك",
      // ...
    }
  }
};

// RTL Support
const isRTL = (lang) => ['ar', 'darija'].includes(lang);

<View style={{ direction: isRTL(currentLang) ? 'rtl' : 'ltr' }}>
  {/* Content */}
</View>
```

### 2. Cultural Sensitivity in UI/UX

**Best Practices:**
- Use modest, non-sexualized imagery
- Avoid graphic medical images without warning
- Provide option to use app in private mode (hide content on lock screen)
- Use female voices for audio guidance
- Incorporate Islamic health preservation messaging where appropriate
- Acknowledge family involvement patterns (option to share info with trusted family member)

**Example: Modesty-First Design**
```javascript
const ImageDisplaySettings = {
  defaultBlurLevel: 'medium', // Blur anatomical diagrams by default
  showWarningBefore3DModel: true,
  allowPrivacyMode: true, // Hide app content from recent apps screen
  femaleCentricColors: ['#FF6B9D', '#9B59B6', '#3498DB'] // Avoid aggressive reds
};
```

### 3. Addressing Barriers in Content

**Fear Reduction Messaging:**
```javascript
const messagingFramework = {
  fear_of_surgery: {
    acknowledge: "نفهم أن الخوف من العملية طبيعي", // "We understand fear of surgery is natural"
    educate: "التشخيص المبكر يمكن تجنب العمليات الكبيرة", // "Early diagnosis can avoid major surgeries"
    empower: "الاختيار ديالك، و احنا هنا نعاونوك" // "It's your choice, we're here to help"
  },
  stigma: {
    normalize: "واحد من كل 8 نساء تصاب بسرطان الثدي", // "1 in 8 women get breast cancer"
    privacy: "المعلومات ديالك سرية 100%" // "Your information is 100% confidential"
  }
};
```

---

## Privacy & Security

### 1. Data Protection (CRITICAL)

**Regulatory Compliance:**
- **Morocco**: Law 09-08 on personal data protection
- **GDPR**: If targeting Moroccans in EU
- **HIPAA-equivalent**: Medical data handling best practices

**Implementation Checklist:**
- [ ] End-to-end encryption for sensitive health data
- [ ] No PII stored on device without encryption
- [ ] User data anonymization for analytics
- [ ] Clear consent flows (GDPR-style)
- [ ] Data retention policies (auto-delete after X months)
- [ ] Right to delete account and all data

**Code Example:**
```javascript
// Encrypt sensitive data before storage
import CryptoJS from 'crypto-js';

class SecureStorage {
  static async saveSymptomReport(report, userId) {
    const encryptionKey = await getDeviceKey(userId);
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(report), 
      encryptionKey
    ).toString();
    
    await AsyncStorage.setItem(`symptom_${Date.now()}`, encrypted);
  }
  
  static async getReports(userId) {
    const keys = await AsyncStorage.getAllKeys();
    const symptomKeys = keys.filter(k => k.startsWith('symptom_'));
    const encryptionKey = await getDeviceKey(userId);
    
    const reports = await Promise.all(
      symptomKeys.map(async (key) => {
        const encrypted = await AsyncStorage.getItem(key);
        const decrypted = CryptoJS.AES.decrypt(encrypted, encryptionKey).toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted);
      })
    );
    
    return reports;
  }
}
```

### 2. Authentication & Authorization

**Recommended Approach:**
- Phone number + OTP (most accessible in Morocco)
- Optional: Biometric (Face ID/Touch ID)
- No mandatory social login (privacy concerns)

```javascript
// Phone-based authentication
import auth from '@react-native-firebase/auth';

async function signInWithPhoneNumber(phoneNumber) {
  const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
  // Store confirmation for OTP verification
  return confirmation;
}

async function confirmCode(confirmation, code) {
  try {
    const userCredential = await confirmation.confirm(code);
    return userCredential.user;
  } catch (error) {
    console.error('Invalid OTP');
  }
}
```

---

## UX/UI Best Practices

### 1. Accessibility (High Priority)

**Moroccan Context:**
- Many users may have lower digital literacy
- Variable internet connectivity
- Diverse age groups (25-65+)

**Design Principles:**
- Large, clear buttons (minimum 44x44pt)
- High contrast text (WCAG AA minimum)
- Simple navigation (maximum 3 levels deep)
- Voice guidance option for illiterate users
- Offline-first design

### 2. Notification Strategy

**Smart Reminder System:**
```javascript
const notificationScheduler = {
  monthlyReminder: {
    frequency: 'monthly',
    preferredTime: '20:00', // Evening, private time
    message: {
      fr: "Rappel mensuel : prenez 10 minutes pour votre auto-examen 💗",
      ar: "تذكير شهري: خصص 10 دقائق للفحص الذاتي 💗"
    },
    notBefore: 5, // Don't send before 5th day of cycle
    notAfter: 10  // Optimal time for examination
  },
  
  screeningReminder: {
    frequency: 'yearly',
    ageThreshold: 40,
    message: {
      fr: "Rappel annuel : planifiez votre mammographie de dépistage",
      ar: "تذكير سنوي: حدد موعد فحص الماموغرافيا"
    }
  }
};

// Adaptive scheduling based on user behavior
function adjustNotificationTiming(userId) {
  const engagementData = getUserEngagement(userId);
  
  if (engagementData.mostActiveHour) {
    return engagementData.mostActiveHour;
  }
  
  return '20:00'; // Default safe time
}
```

### 3. Progressive Disclosure

**Information Architecture:**
```
Level 1: Quick Actions (Home Screen)
├─ Start Autopalpation
├─ Ask a Question
└─ Find Screening Center

Level 2: Education (One tap away)
├─ What to Look For
├─ Understanding Risk Factors
└─ Treatment Options Overview

Level 3: Deep Content (For engaged users)
├─ Detailed Medical Info
├─ Support Resources
└─ Success Stories
```

---

## Healthcare Compliance

### 1. Medical Device Classification

**Regulatory Consideration:**
- This app is **NOT a medical device** (no diagnosis)
- It's a **wellness/educational app** with symptom awareness features
- Must include clear disclaimers

**Required Disclaimers:**
```javascript
const legalDisclaimers = {
  onboarding: {
    fr: "Cette application ne remplace pas un avis médical professionnel. Consultez toujours un médecin pour toute préoccupation.",
    ar: "هذا التطبيق لا يحل محل الرأي الطبي المتخصص. استشر دائمًا طبيبًا لأي مخاوف."
  },
  
  beforeAssessment: {
    fr: "Cet outil aide à la sensibilisation, mais seul un professionnel de santé peut poser un diagnostic.",
    ar: "هذه الأداة تساعد على التوعية، لكن فقط أخصائي صحي يمكنه وضع التشخيص."
  }
};
```

### 2. Clinical Content Validation

**Quality Assurance Process:**
1. All medical content reviewed by licensed oncologists
2. References to peer-reviewed sources (WHO, NCI, local Moroccan guidelines)
3. Regular updates (quarterly review cycle)
4. Fact-checking against current Morocco Ministry of Health guidelines

**Content Management:**
```javascript
const contentValidation = {
  status: 'approved',
  reviewedBy: 'Dr. [Name], Oncologist',
  reviewDate: '2024-01-15',
  nextReview: '2024-04-15',
  references: [
    'WHO Breast Cancer Guidelines 2023',
    'Morocco National Cancer Registry',
    'Ministry of Health Screening Protocol'
  ]
};
```

---

## Testing & Quality Assurance

### 1. Testing Strategy

**Unit Tests:**
```javascript
// Example: Symptom assessment logic
describe('Symptom Assessment', () => {
  test('High risk symptoms trigger urgent consultation', () => {
    const symptoms = {
      lump_detected: true,
      lump_hard: true,
      lump_fixed: true,
      nipple_retraction: true
    };
    
    const result = assessSymptoms(symptoms);
    expect(result.risk_level).toBe('urgent_consultation');
    expect(result.next_steps).toContain('Contact a specialist within 48 hours');
  });
  
  test('Low risk symptoms suggest monitoring', () => {
    const symptoms = {
      breast_tenderness: true,
      cyclic_pain: true
    };
    
    const result = assessSymptoms(symptoms);
    expect(result.risk_level).toBe('continue_monitoring');
  });
});
```

**Integration Tests:**
- API endpoint testing (symptom submission, screening center queries)
- Database integration
- Third-party API integration (maps, notifications)

**E2E Tests (Critical User Flows):**
```javascript
// Using Detox (React Native) or Flutter Driver
describe('Autopalpation Flow', () => {
  it('should complete full autopalpation with 3D guidance', async () => {
    await element(by.id('start-autopalpation')).tap();
    await element(by.id('3d-model')).swipe('left');
    await element(by.id('question-1-yes')).tap();
    // ... complete flow
    await expect(element(by.id('results-screen'))).toBeVisible();
  });
});
```

### 2. Cultural Testing

**Localization QA:**
- Native Arabic speakers test RTL layouts
- Darija speakers verify colloquial translations
- Medical terminology accuracy in all languages
- Cultural appropriateness review by Moroccan women

**Usability Testing:**
- Test with target demographic (Moroccan women 25-65)
- Include users with varying digital literacy
- Test in urban and rural settings (network conditions)

---

## Performance & Offline Support

### 1. Offline-First Architecture

**Strategy:**
```javascript
// Service Worker / Background Sync
const offlineCapabilities = {
  cachedContent: [
    'educational_articles',
    'autopalpation_guide',
    '3d_models',
    'screening_center_database'
  ],
  
  syncWhenOnline: [
    'chat_history',
    'symptom_reports',
    'user_preferences'
  ]
};

// Example: Offline-first data layer
class OfflineFirstStore {
  async saveSymptomReport(report) {
    // Save locally first
    await localDB.symptomReports.add(report);
    
    // Attempt sync if online
    if (navigator.onLine) {
      try {
        await api.syncReport(report);
        report.synced = true;
      } catch (error) {
        // Will retry when connection restored
        report.synced = false;
      }
    }
  }
  
  async syncPendingReports() {
    const unsynced = await localDB.symptomReports
      .where('synced').equals(false)
      .toArray();
    
    for (const report of unsynced) {
      await api.syncReport(report);
      report.synced = true;
      await localDB.symptomReports.update(report.id, report);
    }
  }
}
```

### 2. Performance Optimization

**Target Metrics:**
- App launch time: < 2 seconds
- 3D model load time: < 1 second
- API response time: < 500ms (p95)
- Offline functionality: 100% core features

**Optimization Techniques:**
```javascript
// Lazy loading 3D models
const Breast3DModel = React.lazy(() => import('./components/Breast3DModel'));

// Image optimization
<Image 
  source={{ uri: 'https://...' }}
  resizeMode="cover"
  style={{ width: 300, height: 300 }}
  // Use cached network images
  cache="force-cache"
/>

// Code splitting
const EducationModule = lazy(() => import('./modules/Education'));
const ChatModule = lazy(() => import('./modules/Chat'));
```

---

## Deployment & Monitoring

### 1. CI/CD Pipeline

```yaml
# Example: GitHub Actions
name: Build and Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Run E2E tests
        run: npm run test:e2e
  
  build-android:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build APK
        run: cd android && ./gradlew assembleRelease
      - name: Upload to Play Store (Internal Testing)
        uses: r0adkll/upload-google-play@v1
  
  build-ios:
    needs: test
    runs-on: macos-latest
    steps:
      - name: Build IPA
        run: cd ios && xcodebuild -workspace ...
      - name: Upload to TestFlight
        run: xcrun altool --upload-app ...
```

### 2. Monitoring & Analytics

**Key Metrics to Track:**
```javascript
const analyticsEvents = {
  // Engagement
  'autopalpation_started': { category: 'engagement' },
  'autopalpation_completed': { category: 'engagement' },
  'chat_message_sent': { category: 'engagement' },
  'screening_center_viewed': { category: 'engagement' },
  
  // Health outcomes
  'consultation_recommended': { category: 'outcome', risk_level: 'high|medium|low' },
  'screening_center_contacted': { category: 'outcome' },
  
  // Technical
  'app_crash': { category: 'error' },
  'api_error': { category: 'error', endpoint: '...' },
  'offline_mode_activated': { category: 'technical' }
};

// Privacy-preserving analytics
function trackEvent(eventName, properties = {}) {
  // Anonymize user data
  const anonymizedProperties = {
    ...properties,
    userId: hashUserId(currentUser.id), // One-way hash
    timestamp: Date.now(),
    language: currentLanguage,
    region: getCurrentRegion() // City-level, not GPS
  };
  
  analytics.track(eventName, anonymizedProperties);
}
```

**Error Tracking:**
```javascript
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "...",
  beforeSend(event, hint) {
    // Remove PII before sending
    if (event.user) {
      delete event.user.email;
      delete event.user.phone;
    }
    return event;
  }
});
```

### 3. A/B Testing Framework

**Experimentation:**
```javascript
const experiments = {
  notification_timing: {
    variants: ['morning', 'evening', 'adaptive'],
    metric: 'autopalpation_completion_rate',
    hypothesis: 'Evening notifications yield higher completion rates'
  },
  
  onboarding_flow: {
    variants: ['standard', 'fear_reduction_focused'],
    metric: 'day_7_retention',
    hypothesis: 'Fear reduction messaging improves retention'
  }
};

// Implementation
function getExperimentVariant(experimentName, userId) {
  const hash = hashCode(userId + experimentName);
  const variants = experiments[experimentName].variants;
  return variants[hash % variants.length];
}
```

---

## Development Roadmap Phases

### Phase 1: MVP (3-4 months)
- [ ] User authentication (phone + OTP)
- [ ] Basic autopalpation questionnaire
- [ ] Monthly reminders
- [ ] Static educational content (French + Arabic)
- [ ] Screening center directory (static list)
- [ ] Basic analytics

### Phase 2: AI Integration (2-3 months)
- [ ] 3D breast model with guided palpation
- [ ] AI chatbot for Q&A
- [ ] Dynamic risk assessment
- [ ] Personalized recommendations
- [ ] Darija language support

### Phase 3: Advanced Features (2-3 months)
- [ ] RAG-based knowledge system
- [ ] Real-time screening center availability
- [ ] Community support features (moderated)
- [ ] Integration with national screening campaigns
- [ ] Telemedicine referral system

### Phase 4: Scale & Optimize (Ongoing)
- [ ] Performance optimization
- [ ] Advanced offline capabilities
- [ ] Integration with EMR systems
- [ ] Research partnerships for data insights
- [ ] Expansion to other MENA countries

---

## Key Success Metrics

### Technical KPIs
- App crash rate: < 0.1%
- API uptime: > 99.9%
- Average response time: < 500ms
- Offline functionality coverage: > 95%

### User Engagement KPIs
- Monthly active users (MAU)
- Autopalpation completion rate
- Chat engagement rate
- Screening center lookup rate

### Health Impact KPIs (Long-term)
- % of users who scheduled screening after app recommendation
- Average time from symptom detection to consultation (reduce from baseline)
- User-reported early-stage diagnoses
- User satisfaction score (NPS)

---

## Critical Dos and Don'ts

### ✅ DO
- Prioritize user privacy above all else
- Use culturally appropriate language and imagery
- Test with real Moroccan users throughout development
- Provide clear disclaimers about app limitations
- Make offline functionality a priority
- Implement strong encryption for health data
- Regularly update medical content with professional review
- Support multiple languages (French, Arabic, Darija)
- Design for low digital literacy

### ❌ DON'T
- Don't provide definitive diagnoses
- Don't use graphic medical imagery without warnings
- Don't store unencrypted health data
- Don't require social media login
- Don't make internet connection mandatory for core features
- Don't use AI to replace medical professionals
- Don't ignore cultural sensitivities around modesty
- Don't collect unnecessary personal data
- Don't launch without proper medical content validation

---

## Resources & References

### Medical Guidelines
- WHO Breast Cancer Early Detection Guide
- Morocco Ministry of Health Screening Protocols
- National Comprehensive Cancer Network (NCCN) Guidelines

### Technical Documentation
- React Native: https://reactnative.dev/
- Flutter: https://flutter.dev/
- Anthropic Claude API: https://docs.anthropic.com/
- Firebase: https://firebase.google.com/docs
- Three.js: https://threejs.org/docs/

### Moroccan Context
- Morocco Cancer Registry: http://www.contrelecancer.ma/
- LNCC (Ligue Nationale Contre le Cancer)
- Association Lalla Salma (cancer prevention organization)

### Privacy & Compliance
- Morocco Data Protection Law 09-08
- GDPR Compliance Guide: https://gdpr.eu/
- OWASP Mobile Security: https://owasp.org/www-project-mobile-top-10/

---

## Contact & Support

For technical questions or collaboration:
- Medical Advisory Board: [to be established]
- Technical Lead: [to be assigned]
- Cultural Consultants: [Moroccan women's health advocates]

---

**Document Version**: 1.0  
**Last Updated**: February 2026  
**Next Review**: May 2026

---

## Appendix: Sample Code Repository Structure

```
breast-health-app/
├── mobile/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Autopalpation/
│   │   │   │   ├── 3DModel.jsx
│   │   │   │   ├── Questionnaire.jsx
│   │   │   │   └── RiskAssessment.jsx
│   │   │   ├── Chat/
│   │   │   ├── Education/
│   │   │   └── Screening/
│   │   ├── screens/
│   │   ├── navigation/
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   ├── notifications.js
│   │   │   └── storage.js
│   │   ├── locales/
│   │   │   ├── fr.json
│   │   │   ├── ar.json
│   │   │   └── darija.json
│   │   └── utils/
│   └── tests/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/
│   │   │   ├── ai-chat.service.js
│   │   │   ├── symptom-assessment.service.js
│   │   │   └── notification.service.js
│   │   └── middleware/
│   └── tests/
├── ai-services/
│   ├── rag-knowledge-base/
│   ├── symptom-classifier/
│   └── chat-orchestrator/
├── infrastructure/
│   ├── kubernetes/
│   ├── terraform/
│   └── docker/
└── docs/
    ├── SKILLS.md (this file)
    ├── API.md
    ├── DEPLOYMENT.md
    └── MEDICAL_CONTENT_REVIEW.md
```

---

**End of Document**