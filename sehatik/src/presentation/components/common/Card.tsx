/**
 * Card Component - Modern card with elevation and customization
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';

export type CardVariant = 'elevated' | 'outlined' | 'filled';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: ViewStyle;
  onPress?: () => void;
  noPadding?: boolean;
  borderColor?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  style,
  onPress,
  noPadding = false,
  borderColor,
}) => {
  const cardStyle = [
    styles.base,
    !noPadding && styles.padding,
    variant === 'elevated' && styles.elevated,
    variant === 'outlined' && styles.outlined,
    variant === 'filled' && styles.filled,
    borderColor && { borderColor },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          ...cardStyle,
          pressed && styles.pressed,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
  },
  padding: {
    padding: spacing.md,
  },
  elevated: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  filled: {
    backgroundColor: colors.primarySoft,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
