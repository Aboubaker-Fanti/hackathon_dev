/**
 * Auth Screen - Phone + OTP Authentication
 * Privacy-first: phone number used for auth only
 * Includes skip option for guest access
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../application/store/authStore';
import { useLanguageStore } from '../../../application/store/languageStore';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, MIN_TOUCH_TARGET } from '../../theme/spacing';
import { fontSizes, fontWeights } from '../../theme/typography';

interface Props {
  onAuthenticated: () => void;
}

export const AuthScreen: React.FC<Props> = ({ onAuthenticated }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();
  const { sendOTP, verifyOTP, skipAuth, otpSent, isLoading, otpVerifying } = useAuthStore();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const otpInputRef = useRef<TextInput>(null);

  const handleSendOTP = async () => {
    setError('');
    if (phone.length < 10) {
      setError(t('auth.error_send'));
      return;
    }
    const success = await sendOTP(phone);
    if (success) {
      otpInputRef.current?.focus();
    } else {
      setError(t('auth.error_send'));
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    const success = await verifyOTP(otp);
    if (success) {
      onAuthenticated();
    } else {
      setError(t('auth.error_invalid'));
    }
  };

  const handleSkip = async () => {
    await skipAuth();
    onAuthenticated();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.icon}>🔐</Text>
          <Text style={[styles.title, isRTL && styles.textRTL]}>
            {otpSent ? t('auth.otp_title') : t('auth.phone_title')}
          </Text>
          <Text style={[styles.subtitle, isRTL && styles.textRTL]}>
            {otpSent ? t('auth.otp_subtitle') : t('auth.phone_subtitle')}
          </Text>
        </View>

        {/* Input */}
        <View style={styles.inputSection}>
          {!otpSent ? (
            <>
              <TextInput
                style={[styles.input, isRTL && styles.inputRTL]}
                placeholder={t('auth.phone_placeholder')}
                placeholderTextColor={colors.textLight}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoFocus
                maxLength={15}
                textAlign={isRTL ? 'right' : 'left'}
              />
              <TouchableOpacity
                style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                onPress={handleSendOTP}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.textOnPrimary} />
                ) : (
                  <Text style={styles.primaryButtonText}>{t('auth.send_otp')}</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                ref={otpInputRef}
                style={[styles.input, styles.otpInput]}
                placeholder={t('auth.otp_placeholder')}
                placeholderTextColor={colors.textLight}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                textAlign="center"
                autoFocus
              />
              <TouchableOpacity
                style={[styles.primaryButton, otpVerifying && styles.buttonDisabled]}
                onPress={handleVerifyOTP}
                disabled={otpVerifying}
              >
                {otpVerifying ? (
                  <ActivityIndicator color={colors.textOnPrimary} />
                ) : (
                  <Text style={styles.primaryButtonText}>{t('auth.verify')}</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.resendButton}
                onPress={() => sendOTP(phone)}
              >
                <Text style={styles.resendText}>{t('auth.resend')}</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Error */}
          {error ? (
            <Text style={[styles.error, isRTL && styles.textRTL]}>{error}</Text>
          ) : null}
        </View>

        {/* Skip option */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={[styles.skipText, isRTL && styles.textRTL]}>
            {t('auth.skip')}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  icon: {
    fontSize: 56,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: fontSizes.md * 1.5,
  },
  textRTL: {
    writingDirection: 'rtl',
  },
  inputSection: {
    gap: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fontSizes.lg,
    color: colors.text,
    minHeight: 56,
  },
  inputRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  otpInput: {
    fontSize: fontSizes.xxxl,
    letterSpacing: 12,
    fontWeight: fontWeights.bold,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: colors.textOnPrimary,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
  resendText: {
    fontSize: fontSizes.md,
    color: colors.accent,
    fontWeight: fontWeights.medium,
  },
  error: {
    fontSize: fontSizes.sm,
    color: colors.error,
    textAlign: 'center',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginTop: spacing.xl,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
  skipText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
