import { Platform } from 'react-native';

const palette = {
  primary: '#1B4D35',
  primaryLight: '#2D6A4F',
  accent: '#C9A55A',
  background: '#F4F3EF',
  card: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#9B9B9B',
  border: '#E2E0DB',
  success: '#1B4D35',
  error: '#C0392B',
  warning: '#C9A55A',
  weekend: '#F0F0F0',
};

export const Colors = {
  ...palette, // Keep flat version for direct access
  light: {
    text: palette.text,
    background: palette.background,
    tint: palette.primary,
    icon: palette.muted,
    tabIconDefault: palette.muted,
    tabIconSelected: palette.primary,
    // Add other keys required by standard components if any
    card: palette.card,
    border: palette.border,
    primary: palette.primary,
    accent: palette.accent,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
    card: '#1C1C1E',
    border: '#333',
    primary: palette.primary,
    accent: palette.accent,
  },
};

export const Typography = {
  fontFamily: Platform.select({
    ios: 'PlusJakartaSans-Bold',
    android: 'PlusJakartaSans-Bold',
    default: 'System',
  }),
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extraBold: '800',
  },
};

export const Fonts = {
  rounded: Typography.fontFamily,
  mono: 'System',
};
