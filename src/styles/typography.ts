import { Platform } from 'react-native';

export type SystemFontWeight =
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'black'
  | 'light'
  | 'condensed';

export const getSystemFont = (weight: SystemFontWeight = 'regular') => 'DM Sans';

export const systemFonts = {
  regular: 'DM Sans',
  medium: 'DM Sans',
  semibold: 'DM Sans',
  bold: 'DM Sans',
  black: 'DM Sans',
  light: 'DM Sans',
  condensed: 'DM Sans',
};

export const typography = {
  fonts: systemFonts,
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};
