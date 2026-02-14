/**
 * Button Component - Modern button with variants and states
 */

import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography, fontWeights } from '../../theme/typography';
// import { LinearGradient } from 'expo-linear-gradient'; // Uncomment when installed

export type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'text' | 'gradient';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}) => {
  const isDisabled = disabled || loading;

  const buttonContent = (
    <>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outlined' || variant === 'text' ? colors.primary : colors.textOnPrimary}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text
            style={[
              styles.text,
              size === 'small' && styles.textSmall,
              size === 'large' && styles.textLarge,
              variant === 'primary' && styles.textPrimary,
              variant === 'secondary' && styles.textSecondary,
              variant === 'outlined' && styles.textOutlined,
              variant === 'text' && styles.textOnly,
              variant === 'gradient' && styles.textGradient,
              isDisabled && styles.textDisabled,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </>
  );

  const commonStyles = [
    styles.base,
    size === 'small' && styles.small,
    size === 'medium' && styles.medium,
    size === 'large' && styles.large,
    fullWidth && styles.fullWidth,
    style,
  ];

  if (variant === 'gradient' && !isDisabled) {
    // Note: Install expo-linear-gradient for gradient support
    // For now, fallback to primary color
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [
          ...commonStyles,
          styles.primary,
          pressed && styles.pressed,
        ]}
      >
        {buttonContent}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        ...commonStyles,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'outlined' && styles.outlined,
        variant === 'text' && styles.textButton,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {buttonContent}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  small: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  medium: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  large: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
  },
  fullWidth: {
    width: '100%',
  },
  
  // Variants
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  textButton: {
    backgroundColor: 'transparent',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  
  // States
  disabled: {
    backgroundColor: colors.disabled,
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  
  // Text styles
  text: {
    ...typography.button,
    textAlign: 'center',
  },
  textSmall: {
    fontSize: 14,
  },
  textLarge: {
    fontSize: 18,
  },
  textPrimary: {
    color: colors.textOnPrimary,
    fontWeight: fontWeights.semiBold,
  },
  textSecondary: {
    color: colors.textOnPrimary,
    fontWeight: fontWeights.semiBold,
  },
  textOutlined: {
    color: colors.primary,
    fontWeight: fontWeights.semiBold,
  },
  textOnly: {
    color: colors.primary,
    fontWeight: fontWeights.medium,
  },
  textGradient: {
    color: colors.textOnPrimary,
    fontWeight: fontWeights.semiBold,
  },
  textDisabled: {
    color: colors.textDisabled,
  },
});
