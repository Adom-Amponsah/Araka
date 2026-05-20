import { Platform } from 'react-native';

export type SystemFontWeight =
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'black'
  | 'light'
  | 'condensed';

export const getSystemFont = (weight: SystemFontWeight = 'regular') =>
  Platform.select({
    ios: 'System',
    android: (() => {
      switch (weight) {
        case 'light':
          return 'sans-serif-light';
        case 'medium':
        case 'semibold':
          return 'sans-serif-medium';
        case 'bold':
        case 'black':
          return 'sans-serif-black';
        case 'condensed':
          return 'sans-serif-condensed';
        default:
          return 'sans-serif';
      }
    })(),
    default: 'sans-serif',
  }) ?? 'sans-serif';

export const systemFonts = {
  regular: getSystemFont('regular'),
  medium: getSystemFont('medium'),
  semibold: getSystemFont('semibold'),
  bold: getSystemFont('bold'),
  black: getSystemFont('black'),
  light: getSystemFont('light'),
  condensed: getSystemFont('condensed'),
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
