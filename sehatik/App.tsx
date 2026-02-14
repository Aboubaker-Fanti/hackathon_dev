/**
 * Sehatik (صحتك) - Breast Health Companion App for Moroccan Women
 *
 * Mission: Reduce late-stage breast cancer diagnoses through
 * AI-assisted self-examination, education, and screening navigation.
 *
 * DISCLAIMER: This app is educational only and does NOT replace
 * professional medical advice.
 */

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';

// Initialize i18n before anything else
import './src/infrastructure/i18n';

import { TabNavigator } from './src/presentation/navigation';
import { WelcomeScreen } from './src/presentation/screens/Onboarding/WelcomeScreen';
import { AuthScreen } from './src/presentation/screens/Onboarding/AuthScreen';
import { useLanguageStore } from './src/application/store/languageStore';
import { useAuthStore } from './src/application/store/authStore';
import { colors } from './src/presentation/theme/colors';
import { fontSizes, fontWeights } from './src/presentation/theme/typography';
import { spacing } from './src/presentation/theme/spacing';

/**
 * Splash/Loading screen while the app initializes
 */
const LoadingScreen: React.FC = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.loadingAppName}>صحتك</Text>
    <Text style={styles.loadingSubtitle}>Sehatik</Text>
    <ActivityIndicator size="large" color={colors.primary} style={styles.loadingSpinner} />
  </View>
);

export default function App() {
  const { isLoaded: langLoaded, loadSavedLanguage } = useLanguageStore();
  const {
    isAuthenticated,
    isOnboardingComplete,
    isLoading: authLoading,
    loadAuthState,
  } = useAuthStore();

  const [appReady, setAppReady] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        await Promise.all([loadSavedLanguage(), loadAuthState()]);
      } catch {
        // App works with defaults
      } finally {
        setAppReady(true);
      }
    };
    initApp();
  }, []);

  if (!appReady || !langLoaded || authLoading) {
    return <LoadingScreen />;
  }

  // Onboarding flow (first launch)
  if (!isOnboardingComplete) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <WelcomeScreen
          onComplete={() => {
            if (!isAuthenticated) {
              setShowAuth(true);
            }
          }}
        />
      </SafeAreaProvider>
    );
  }

  // Auth screen (after onboarding, before main app)
  if (!isAuthenticated || showAuth) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AuthScreen onAuthenticated={() => setShowAuth(false)} />
      </SafeAreaProvider>
    );
  }

  // Main app
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <TabNavigator />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingAppName: {
    fontSize: 48,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  loadingSubtitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  loadingSpinner: {
    marginTop: spacing.lg,
  },
});
