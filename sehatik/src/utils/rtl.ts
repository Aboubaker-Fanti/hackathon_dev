/**
 * RTL (Right-to-Left) Utilities
 * Helper functions for Arabic/Darija layout support
 */

import { I18nManager, ViewStyle, TextStyle } from 'react-native';

/**
 * Returns the correct flex direction based on RTL state
 */
export const getFlexDirection = (isRTL: boolean): ViewStyle['flexDirection'] => {
  return isRTL ? 'row-reverse' : 'row';
};

/**
 * Returns the correct text alignment based on RTL state
 */
export const getTextAlign = (isRTL: boolean): TextStyle['textAlign'] => {
  return isRTL ? 'right' : 'left';
};

/**
 * Returns the correct writing direction
 */
export const getWritingDirection = (isRTL: boolean): TextStyle['writingDirection'] => {
  return isRTL ? 'rtl' : 'ltr';
};

/**
 * Flip horizontal margins/paddings for RTL
 */
export const flipHorizontal = (
  isRTL: boolean,
  startValue: number,
  endValue: number,
): { marginLeft: number; marginRight: number } => {
  if (isRTL) {
    return { marginLeft: endValue, marginRight: startValue };
  }
  return { marginLeft: startValue, marginRight: endValue };
};

/**
 * Get RTL-aware style overrides
 */
export const rtlStyles = (isRTL: boolean) => ({
  text: {
    textAlign: getTextAlign(isRTL),
    writingDirection: getWritingDirection(isRTL),
  } as TextStyle,
  row: {
    flexDirection: getFlexDirection(isRTL),
  } as ViewStyle,
});
