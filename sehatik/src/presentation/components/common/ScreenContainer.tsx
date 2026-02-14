/**
 * ScreenContainer - Base layout wrapper for all screens
 * Handles safe area, RTL direction, and consistent padding
 */

import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguageStore } from '../../../application/store/languageStore';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/spacing';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  noPadding?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = true,
  style,
  noPadding = false,
}) => {
  const { isRTL } = useLanguageStore();

  const content = scrollable ? (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        !noPadding && styles.padding,
        style,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, !noPadding && styles.padding, style]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { direction: isRTL ? 'rtl' : 'ltr' }]}
      edges={['top', 'left', 'right']}
    >
      {content}
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
  },
  scrollContent: {
    flexGrow: 1,
  },
  padding: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: layout.screenPaddingVertical,
  },
});
