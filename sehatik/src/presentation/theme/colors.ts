/**
 * Sehatik Color Palette
 * Soft, reassuring colors designed for cultural sensitivity
 * Female-centric design: pinks, purples, blues
 * Based on design system: Light & Dark mode support
 */

// Light Mode Colors (from design guide)
export const colors = {
  // Primary Pink Palette
  primary: '#EC407A',           // Vibrant pink (from design guide)
  primaryLight: '#F48FB1',      // Light pink
  primaryDark: '#D81B60',       // Deep pink
  primarySoft: '#FCE4EC',       // Very light pink background
  
  // Secondary - Neutral Grays
  secondary: '#212121',         // Black (from design guide)
  secondaryMedium: '#424242',   // Dark gray
  secondaryLight: '#9E9E9E',    // Medium gray
  secondaryXLight: '#E0E0E0',   // Light gray
  
  // Backgrounds
  background: '#F5F5F5',        // Light background
  backgroundPink: '#FFF0F5',    // Soft pink tint background
  surface: '#FFFFFF',           // White cards
  surfaceElevated: '#FAFAFA',   // Elevated surfaces
  
  // Text Colors
  text: '#212121',              // Primary text (from design guide)
  textSecondary: '#757575',     // Secondary text
  textLight: '#BDBDBD',         // Light text
  textOnPrimary: '#FFFFFF',     // White text on pink
  textDisabled: '#9E9E9E',
  
  // Semantic Colors
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
  
  // UI Elements
  border: '#E0E0E0',
  divider: '#EEEEEE',
  disabled: '#BDBDBD',
  overlay: 'rgba(0, 0, 0, 0.4)',
  overlayLight: 'rgba(0, 0, 0, 0.2)',
  shadow: 'rgba(0, 0, 0, 0.08)',
  
  // Accent Colors (for variety)
  accent: '#EC407A',            // Same as primary
  accentBlue: '#42A5F5',
  accentPurple: '#AB47BC',
  
  // Gradients
  gradientPrimary: ['#EC407A', '#F06292'],
  gradientSecondary: ['#F48FB1', '#FCE4EC'],
  gradientDark: ['#424242', '#212121'],
} as const;

// Dark Mode Colors (from design guide)
export const darkColors = {
  // Primary Pink Palette (slightly adjusted for dark mode)
  primary: '#F48FB1',           // Lighter pink for dark mode
  primaryLight: '#FCE4EC',      
  primaryDark: '#EC407A',       
  primarySoft: '#3E2723',       // Dark pink tint
  
  // Secondary - Neutral Grays
  secondary: '#212121',         // Black
  secondaryMedium: '#424242',   // Dark gray
  secondaryLight: '#BDBDBD',    // Light gray (inverted)
  secondaryXLight: '#424242',   // Medium gray
  
  // Backgrounds (dark)
  background: '#121212',        // True black background
  backgroundPink: '#1A1114',    // Dark with pink tint
  surface: '#1E1E1E',           // Dark surface
  surfaceElevated: '#2C2C2C',   // Elevated dark surface
  
  // Text Colors (dark)
  text: '#FFFFFF',              // White text
  textSecondary: '#B0B0B0',     // Light gray text
  textLight: '#808080',         // Medium gray
  textOnPrimary: '#FFFFFF',     // White on pink
  textDisabled: '#666666',
  
  // Semantic Colors (adjusted for dark)
  error: '#EF5350',
  success: '#66BB6A',
  warning: '#FFA726',
  info: '#42A5F5',
  
  // UI Elements (dark)
  border: '#424242',
  divider: '#2C2C2C',
  disabled: '#666666',
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',
  shadow: 'rgba(0, 0, 0, 0.3)',
  
  // Accent Colors
  accent: '#F48FB1',
  accentBlue: '#64B5F6',
  accentPurple: '#BA68C8',
  
  // Gradients
  gradientPrimary: ['#F48FB1', '#EC407A'],
  gradientSecondary: ['#424242', '#212121'],
  gradientDark: ['#1E1E1E', '#121212'],
} as const;

export type ColorKeys = keyof typeof colors;
