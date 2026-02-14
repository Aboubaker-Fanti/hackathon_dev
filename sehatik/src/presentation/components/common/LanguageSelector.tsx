/**
 * Language Selector Component
 * Allows switching between French, Arabic, and Darija
 * Updates RTL layout automatically
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '../../../application/store/languageStore';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '../../../infrastructure/i18n';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, MIN_TOUCH_TARGET } from '../../theme/spacing';
import { fontSizes, fontWeights } from '../../theme/typography';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation();
  const { currentLanguage, setLanguage } = useLanguageStore();

  const handleSelectLanguage = async (lang: LanguageCode) => {
    await setLanguage(lang);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container}>
          <Text style={styles.title}>{t('language.title')}</Text>

          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  isSelected && styles.languageOptionSelected,
                ]}
                onPress={() => handleSelectLanguage(lang.code as LanguageCode)}
                accessibilityLabel={lang.label}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <Text
                  style={[
                    styles.languageLabel,
                    isSelected && styles.languageLabelSelected,
                  ]}
                >
                  {lang.label}
                </Text>
                {isSelected && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            accessibilityLabel={t('common.close')}
            accessibilityRole="button"
          >
            <Text style={styles.closeButtonText}>{t('common.close')}</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 340,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    minHeight: MIN_TOUCH_TARGET,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  languageOptionSelected: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  languageLabel: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    color: colors.text,
  },
  languageLabelSelected: {
    color: colors.primary,
    fontWeight: fontWeights.bold,
  },
  checkmark: {
    fontSize: fontSizes.xl,
    color: colors.primary,
    fontWeight: fontWeights.bold,
  },
  closeButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
});
