/**
 * Profile Screen - Complete settings and account management
 * Language, notifications, privacy, screening centers, about
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { LanguageSelector } from '../../components/common/LanguageSelector';
import { useLanguageStore } from '../../../application/store/languageStore';
import { useAuthStore } from '../../../application/store/authStore';
import { useReminderStore } from '../../../application/store/reminderStore';
import { useChatStore } from '../../../application/store/chatStore';
import { SUPPORTED_LANGUAGES } from '../../../infrastructure/i18n';
import { clearAllData } from '../../../infrastructure/storage/secureStorage';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, MIN_TOUCH_TARGET } from '../../theme/spacing';
import { fontSizes, fontWeights } from '../../theme/typography';

interface Props {
  onNavigateToCenters?: () => void;
}

export const ProfileScreen: React.FC<Props> = ({ onNavigateToCenters }) => {
  const { t } = useTranslation();
  const { currentLanguage, isRTL } = useLanguageStore();
  const { logout, phoneNumber } = useAuthStore();
  const { reminders, toggleReminder, loadReminders } = useReminderStore();
  const { clearChat } = useChatStore();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  useEffect(() => {
    loadReminders();
  }, []);

  const currentLangLabel = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage)?.label ?? 'Français';
  const monthlyReminder = reminders.find((r) => r.id === 'monthly_exam');
  const yearlyReminder = reminders.find((r) => r.id === 'yearly_screening');

  const handleDeleteAccount = () => {
    Alert.alert(
      t('profile.deleteAccount'),
      t('profile.deleteConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            await clearChat();
            await logout();
          },
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout'),
      '',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.confirm'), onPress: () => logout() },
      ],
    );
  };

  const renderSettingsRow = (
    icon: string,
    labelKey: string,
    right: React.ReactNode,
    onPress?: () => void,
    danger?: boolean,
  ) => (
    <TouchableOpacity
      style={[styles.row, isRTL && styles.rowRTL]}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'text'}
    >
      <View style={[styles.rowLeft, isRTL && styles.rowLeftRTL]}>
        <Text style={styles.rowIcon}>{icon}</Text>
        <Text style={[styles.rowLabel, danger && styles.rowLabelDanger, isRTL && styles.textRTL]}>
          {t(labelKey)}
        </Text>
      </View>
      {right}
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👩</Text>
        </View>
        <Text style={[styles.title, isRTL && styles.textRTL]}>{t('profile.title')}</Text>
        {phoneNumber && (
          <Text style={styles.phone}>{phoneNumber}</Text>
        )}
      </View>

      {/* Language */}
      <View style={styles.settingsGroup}>
        <Text style={[styles.groupTitle, isRTL && styles.textRTL]}>{t('profile.settings')}</Text>
        <View style={styles.card}>
          {renderSettingsRow('🌐', 'profile.language', (
            <Text style={styles.rowValue}>{currentLangLabel}</Text>
          ), () => setShowLanguageSelector(true))}
          <View style={styles.divider} />
          {renderSettingsRow('🔒', 'profile.privacy', (
            <Text style={styles.rowArrow}>{isRTL ? '‹' : '›'}</Text>
          ))}
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.settingsGroup}>
        <Text style={[styles.groupTitle, isRTL && styles.textRTL]}>{t('notifications.title')}</Text>
        <View style={styles.card}>
          {renderSettingsRow('📅', 'notifications.monthly_exam', (
            <Switch
              value={monthlyReminder?.enabled ?? true}
              onValueChange={() => toggleReminder('monthly_exam')}
              trackColor={{ false: colors.border, true: colors.primary + '60' }}
              thumbColor={monthlyReminder?.enabled ? colors.primary : colors.textLight}
            />
          ))}
          <View style={styles.divider} />
          {renderSettingsRow('🏥', 'notifications.yearly_screening', (
            <Switch
              value={yearlyReminder?.enabled ?? true}
              onValueChange={() => toggleReminder('yearly_screening')}
              trackColor={{ false: colors.border, true: colors.primary + '60' }}
              thumbColor={yearlyReminder?.enabled ? colors.primary : colors.textLight}
            />
          ))}
        </View>
      </View>

      {/* Resources */}
      <View style={styles.settingsGroup}>
        <View style={styles.card}>
          {renderSettingsRow('🏥', 'profile.screeningCenters', (
            <Text style={styles.rowArrow}>{isRTL ? '‹' : '›'}</Text>
          ), onNavigateToCenters)}
          <View style={styles.divider} />
          {renderSettingsRow('ℹ️', 'profile.about', (
            <Text style={styles.rowArrow}>{isRTL ? '‹' : '›'}</Text>
          ))}
          <View style={styles.divider} />
          {renderSettingsRow('❓', 'profile.help', (
            <Text style={styles.rowArrow}>{isRTL ? '‹' : '›'}</Text>
          ))}
        </View>
      </View>

      {/* Account actions */}
      <View style={styles.settingsGroup}>
        <View style={styles.card}>
          {renderSettingsRow('🚪', 'profile.logout', null, handleLogout)}
          <View style={styles.divider} />
          {renderSettingsRow('🗑️', 'profile.deleteAccount', null, handleDeleteAccount, true)}
        </View>
      </View>

      {/* Version */}
      <Text style={styles.version}>{t('profile.version', { version: '1.0.0' })}</Text>

      <LanguageSelector visible={showLanguageSelector} onClose={() => setShowLanguageSelector(false)} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  textRTL: { textAlign: 'right', writingDirection: 'rtl' },
  avatarSection: { alignItems: 'center', marginBottom: spacing.xl },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary + '20',
    justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md,
  },
  avatarText: { fontSize: 40 },
  title: { fontSize: fontSizes.xxl, fontWeight: fontWeights.bold, color: colors.text },
  phone: { fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: spacing.xs },
  settingsGroup: { marginBottom: spacing.lg },
  groupTitle: {
    fontSize: fontSizes.xs, fontWeight: fontWeights.bold, color: colors.textSecondary,
    marginBottom: spacing.sm, paddingHorizontal: spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, overflow: 'hidden',
    elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: spacing.md, paddingHorizontal: spacing.md, minHeight: MIN_TOUCH_TARGET,
  },
  rowRTL: { flexDirection: 'row-reverse' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  rowLeftRTL: { flexDirection: 'row-reverse' },
  rowIcon: { fontSize: 20 },
  rowLabel: { fontSize: fontSizes.md, fontWeight: fontWeights.medium, color: colors.text },
  rowLabelDanger: { color: colors.error },
  rowValue: { fontSize: fontSizes.sm, color: colors.textSecondary },
  rowArrow: { fontSize: fontSizes.xl, color: colors.textLight },
  divider: { height: 1, backgroundColor: colors.divider, marginLeft: 52 },
  version: {
    textAlign: 'center', fontSize: fontSizes.sm, color: colors.textLight,
    marginTop: spacing.md, marginBottom: spacing.xxl,
  },
});
