# Sehatik - صحتك

**Your Breast Health Companion** | **رفيقك الصحي**

A culturally-tailored mobile breast health companion app for Moroccan women, built to reduce late-stage breast cancer diagnoses through early detection awareness, AI-assisted self-examination guidance, education, and screening navigation.

> **Medical Disclaimer**: This app is for educational purposes only and does NOT replace professional medical advice. Always consult a healthcare professional for medical concerns.

---

## Features

- **Self-Examination Guide** - Step-by-step breast self-exam with visual guidance
- **AI Health Assistant** - Confidential Q&A chatbot (Anthropic Claude powered)
- **Education Hub** - Culturally sensitive health education in 3 languages
- **Screening Center Locator** - Find nearby screening facilities across Morocco
- **Smart Reminders** - Monthly exam and yearly screening reminders

## Languages Supported

| Language | Code | Direction |
|----------|------|-----------|
| Francais | `fr` | LTR |
| Arabic (MSA) | `ar` | RTL |
| Darija (Moroccan Arabic) | `darija` | RTL |

---

## Tech Stack

- **Framework**: React Native (Expo SDK 54)
- **Language**: TypeScript (strict mode)
- **Navigation**: React Navigation 7 (Bottom Tabs)
- **State Management**: Zustand
- **Internationalization**: i18next + react-i18next
- **UI Components**: React Native Paper
- **Storage**: AsyncStorage + expo-secure-store (encrypted)
- **Architecture**: Clean Architecture (Presentation / Application / Domain / Infrastructure)

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- Expo CLI (`npx expo`)
- iOS Simulator (macOS) or Android Emulator, or Expo Go on a physical device

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd sehatik

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your API keys
```

### Running the App

```bash
# Start Expo dev server
npm start

# Run on specific platform
npm run android
npm run ios
npm run web
```

### Development Commands

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type-check
npm run type-check
```

---

## Project Structure

```
sehatik/
├── App.tsx                          # App entry point
├── src/
│   ├── presentation/                # UI Layer
│   │   ├── screens/
│   │   │   ├── Home/                # Dashboard
│   │   │   ├── Autopalpation/       # Self-exam guide
│   │   │   ├── Chat/                # AI assistant
│   │   │   ├── Education/           # Learning hub
│   │   │   └── Profile/             # Settings & centers
│   │   ├── components/
│   │   │   ├── common/              # Shared components
│   │   │   └── layout/              # Layout components
│   │   ├── navigation/              # Tab & stack navigators
│   │   └── theme/                   # Colors, typography, spacing
│   ├── application/                 # Application Layer
│   │   ├── hooks/                   # Custom hooks
│   │   └── store/                   # Zustand stores
│   ├── domain/                      # Domain Layer
│   │   ├── models/                  # Type definitions
│   │   └── services/                # Business logic
│   └── infrastructure/              # Infrastructure Layer
│       ├── api/                     # API client
│       ├── storage/                 # Secure & local storage
│       └── i18n/                    # Internationalization
│           └── locales/             # fr.json, ar.json, darija.json
├── assets/                          # Images, fonts, icons
├── .env.example                     # Environment template
├── app.json                         # Expo configuration
├── tsconfig.json                    # TypeScript config + path aliases
├── .eslintrc.json                   # ESLint configuration
└── .prettierrc                      # Prettier configuration
```

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description | Required |
|----------|-------------|----------|
| `API_BASE_URL` | Backend API base URL | Yes |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key (chat) | For chat feature |
| `FIREBASE_API_KEY` | Firebase API key | For auth/notifications |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key | For screening centers |
| `SENTRY_DSN` | Sentry error tracking DSN | For production |

---

## Design Principles

1. **Privacy First** - All health data encrypted, minimal PII, compliant with Morocco Law 09-08
2. **Cultural Sensitivity** - Modest design, female-centric, no graphic imagery
3. **Offline First** - Core features work without internet
4. **Accessibility** - Large touch targets (44pt+), high contrast, simple navigation
5. **Multi-Language** - Every string uses i18n, full RTL support

---

## Contributing

1. All UI text must use i18n keys (no hardcoded strings)
2. Every component must support RTL layout
3. Never log sensitive health data to console
4. Always include medical disclaimers
5. Test with all 3 languages before submitting PRs

---

## License

Proprietary - All rights reserved.

---

**Built with care for Moroccan women's health.**
