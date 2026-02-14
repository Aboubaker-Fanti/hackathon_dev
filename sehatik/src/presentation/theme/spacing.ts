/**
 * Sehatik Spacing & Layout Constants
 * Consistent spacing for a clean, accessible design
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
} as const;

export const hitSlop = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
};

/**
 * Minimum touch target size (44x44pt) per accessibility guidelines
 */
export const MIN_TOUCH_TARGET = 44;

export const layout = {
  screenPaddingHorizontal: spacing.md,
  screenPaddingVertical: spacing.lg,
  cardPadding: spacing.md,
  sectionGap: spacing.lg,
  itemGap: spacing.md,
} as const;
