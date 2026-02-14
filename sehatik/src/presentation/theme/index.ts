/**
 * Sehatik Theme - Central export
 */

export { colors } from './colors';
export { typography, fontSizes, fontWeights, fontFamilies, lineHeights } from './typography';
export { spacing, borderRadius, hitSlop, MIN_TOUCH_TARGET, layout } from './spacing';

export const theme = {
  // Re-export for convenience when importing theme as a whole
  get colors() {
    return require('./colors').colors;
  },
  get typography() {
    return require('./typography').typography;
  },
  get spacing() {
    return require('./spacing').spacing;
  },
  get borderRadius() {
    return require('./spacing').borderRadius;
  },
};
