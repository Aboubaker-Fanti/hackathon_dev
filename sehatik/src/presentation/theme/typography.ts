/**
 * Sehatik Typography - Based on Poppins Font Family
 * Supports Latin (French) and Arabic script (Arabic/Darija)
 * Designed for readability across age groups
 * Following design guide specifications
 */

import { Platform, TextStyle } from 'react-native';

const getArabicFontFamily = () => {
  if (Platform.OS === 'ios') return 'Geeza Pro';
  return 'sans-serif'; // Android handles Arabic natively
};

const getLatinFontFamily = (weight: 'regular' | 'medium' | 'semiBold' | 'bold' = 'regular') => {
  // Note: For production, load Poppins via expo-font
  // This is a fallback for system fonts
  const fontMap = {
    regular: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    medium: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    semiBold: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    bold: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  };
  return fontMap[weight];
};

export const fontFamilies = {
  latin: {
    regular: getLatinFontFamily('regular'),
    medium: getLatinFontFamily('medium'),
    semiBold: getLatinFontFamily('semiBold'),
    bold: getLatinFontFamily('bold'),
  },
  arabic: getArabicFontFamily(),
  // For when Poppins is loaded
  poppins: 'Poppins',
};

// Font sizes based on design guide (Poppins specifications)
export const fontSizes = {
  // Sub_body
  subBody: 12,           // 12 Px
  
  // Body
  body1: 16,             // 16 Px
  
  // Title
  title2: 18,            // 18 Px
  title1: 20,            // 20 Px
  
  // Sub_header
  subHeader: 22,         // 22 Px
  
  // Header
  header1: 24,           // 24 Px (H1 - Semibold & Medium)
  
  // Legacy support
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  display: 36,
} as const;

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
};

export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

// Typography system based on design guide
export const typography = {
  // Headers (24px)
  header1Semibold: {
    fontSize: fontSizes.header1,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.header1 * lineHeights.tight,
  } as TextStyle,
  
  header1Medium: {
    fontSize: fontSizes.header1,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.header1 * lineHeights.tight,
  } as TextStyle,
  
  // Sub Headers (22px)
  subHeaderMedium: {
    fontSize: fontSizes.subHeader,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.subHeader * lineHeights.tight,
  } as TextStyle,
  
  subHeaderRegular: {
    fontSize: fontSizes.subHeader,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.subHeader * lineHeights.normal,
  } as TextStyle,
  
  // Titles (20px & 18px)
  title1Medium: {
    fontSize: fontSizes.title1,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.title1 * lineHeights.normal,
  } as TextStyle,
  
  title1Regular: {
    fontSize: fontSizes.title1,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.title1 * lineHeights.normal,
  } as TextStyle,
  
  title2Medium: {
    fontSize: fontSizes.title2,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.title2 * lineHeights.normal,
  } as TextStyle,
  
  title2Regular: {
    fontSize: fontSizes.title2,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.title2 * lineHeights.normal,
  } as TextStyle,
  
  // Body (16px)
  body1Medium: {
    fontSize: fontSizes.body1,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.body1 * lineHeights.normal,
  } as TextStyle,
  
  body1Regular: {
    fontSize: fontSizes.body1,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.body1 * lineHeights.normal,
  } as TextStyle,
  
  // Sub Body (12px)
  subBodyMedium: {
    fontSize: fontSizes.subBody,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.subBody * lineHeights.normal,
  } as TextStyle,
  
  subBodyRegular: {
    fontSize: fontSizes.subBody,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.subBody * lineHeights.normal,
  } as TextStyle,
  
  // Legacy support (for backward compatibility)
  h1: {
    fontSize: fontSizes.header1,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.header1 * lineHeights.tight,
  } as TextStyle,
  
  h2: {
    fontSize: fontSizes.subHeader,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.subHeader * lineHeights.tight,
  } as TextStyle,
  
  h3: {
    fontSize: fontSizes.title1,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.title1 * lineHeights.normal,
  } as TextStyle,
  
  body: {
    fontSize: fontSizes.body1,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.body1 * lineHeights.normal,
  } as TextStyle,
  
  bodyLarge: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.lg * lineHeights.normal,
  } as TextStyle,
  
  caption: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.sm * lineHeights.normal,
  } as TextStyle,
  
  small: {
    fontSize: fontSizes.subBody,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.subBody * lineHeights.normal,
  } as TextStyle,
  
  button: {
    fontSize: fontSizes.body1,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.body1 * lineHeights.normal,
  } as TextStyle,
} as const;
