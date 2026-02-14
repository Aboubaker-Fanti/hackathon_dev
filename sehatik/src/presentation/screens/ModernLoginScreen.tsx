/**
 * ModernLoginScreen - Modern authentication screen
 * Features: Email/password login, social login, sign up option
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const ModernLoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = () => {
    console.log('Submit', { email, password, isSignUp });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo/Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>🎗️</Text>
            </View>
            <Text style={styles.appTitle}>Welcome</Text>
            <Text style={styles.appSubtitle}>
              {isSignUp
                ? 'Sign up to countina'
                : 'Sign in to countina'}
            </Text>
          </View>

          {/* Login Form */}
          <View style={styles.formSection}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={colors.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your Password"
                  placeholderTextColor={colors.textLight}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  autoComplete="password"
                />
                <Pressable
                  style={styles.eyeButton}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <Text style={styles.eyeIcon}>
                    {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </Pressable>
              </View>
              {!isSignUp && (
                <Pressable style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>
                    Forgot password?
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Sign In Button */}
            <Button
              title={isSignUp ? 'Sign up' : 'Sign in'}
              onPress={handleSubmit}
              variant="primary"
              size="large"
              fullWidth
              style={styles.submitButton}
            />

            {/* Toggle Sign In/Sign Up */}
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>
                {isSignUp
                  ? 'Don't have an account? '
                  : 'Don't have an account? '}
              </Text>
              <Pressable onPress={() => setIsSignUp(!isSignUp)}>
                <Text style={styles.toggleLink}>
                  {isSignUp ? 'Sign Up' : 'Sign Up'}
                </Text>
              </Pressable>
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Sign in with</Text>
              <View style={styles.divider} />
            </View>

            {/* Social Login */}
            <View style={styles.socialContainer}>
              <Card
                variant="outlined"
                style={styles.socialButton}
                onPress={() => console.log('Google login')}
              >
                <Text style={styles.socialIcon}>G</Text>
              </Card>
              <Card
                variant="outlined"
                style={styles.socialButton}
                onPress={() => console.log('Facebook login')}
              >
                <Text style={styles.socialIcon}>f</Text>
              </Card>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
  },
  
  // Header Section
  headerSection: {
    alignItems: 'center',
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoEmoji: {
    fontSize: 56,
  },
  appTitle: {
    ...typography.header1Semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  appSubtitle: {
    ...typography.body1Regular,
    color: colors.textSecondary,
  },
  
  // Form Section
  formSection: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.title2Medium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.body1Regular,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    color: colors.text,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
  },
  passwordInput: {
    ...typography.body1Regular,
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    color: colors.text,
  },
  eyeButton: {
    padding: spacing.md,
  },
  eyeIcon: {
    fontSize: 20,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
  },
  forgotPasswordText: {
    ...typography.body1Regular,
    color: colors.primary,
  },
  
  // Submit Button
  submitButton: {
    marginTop: spacing.md,
  },
  
  // Toggle Sign In/Sign Up
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  toggleText: {
    ...typography.body1Regular,
    color: colors.textSecondary,
  },
  toggleLink: {
    ...typography.body1Medium,
    color: colors.primary,
  },
  
  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },
  dividerText: {
    ...typography.body1Regular,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
  },
  
  // Social Login
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  socialButton: {
    width: 80,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  
  bottomSpacer: {
    height: spacing.xl,
  },
});
