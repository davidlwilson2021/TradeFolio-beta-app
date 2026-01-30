/**
 * TradeFolio "Iron & Amber" Color Palette
 *
 * Light theme by default with dark theme overrides.
 * Inspired by DeWalt, Caterpillar, Milwaukee Tool.
 */

const palette = {
  safetyGold: '#FFB800',
  safetyGoldLight: '#FFCA40',
  safetyGoldDark: '#E0A200',
  offBlack: '#1A1C1E',
  steelBlueGrey: '#37474F',
  steelBlueGreyLight: '#455A64',
  forestGreen: '#2E7D32',
  concreteGrey: '#F5F5F5',
  white: '#FFFFFF',
  black: '#000000',
  errorRed: '#C62828',
  infoBlue: '#1565C0',
  subtleBorder: '#B0BEC5',
  mutedText: '#546E7A',
  lightSurface: '#ECEFF1',
  darkSurface: '#263238',
};

export const colors = {
  // Backgrounds
  background: palette.concreteGrey,
  surface: palette.white,
  surfaceLight: palette.lightSurface,
  card: palette.white,
  heroBackground: palette.offBlack,

  // Primary – Safety Gold
  primary: palette.safetyGold,
  primaryLight: palette.safetyGoldLight,
  primaryDark: palette.safetyGoldDark,

  // Accent – Steel Blue-Grey
  accent: palette.steelBlueGrey,
  accentLight: palette.steelBlueGreyLight,

  // Text
  text: palette.offBlack,
  textSecondary: palette.mutedText,
  textMuted: palette.steelBlueGreyLight,
  textOnDark: palette.white,
  textOnPrimary: palette.offBlack,

  // Status
  success: palette.forestGreen,
  warning: palette.safetyGold,
  error: palette.errorRed,
  info: palette.infoBlue,

  // Borders – structural, not shadow-based
  border: palette.steelBlueGrey,
  borderLight: palette.subtleBorder,

  // Status backgrounds (for badges, alerts)
  successBackground: 'rgba(46, 125, 50, 0.15)',
  warningBackground: 'rgba(255, 184, 0, 0.15)',
  errorBackground: 'rgba(198, 40, 40, 0.1)',

  // Others
  white: palette.white,
  black: palette.black,
  transparent: 'transparent',
  overlay: 'rgba(0,0,0,0.5)',
};

export const darkColors: typeof colors = {
  // Backgrounds
  background: '#121212',
  surface: palette.offBlack,
  surfaceLight: palette.darkSurface,
  card: palette.offBlack,
  heroBackground: palette.offBlack,

  // Primary – Safety Gold (same in both themes)
  primary: palette.safetyGold,
  primaryLight: palette.safetyGoldLight,
  primaryDark: palette.safetyGoldDark,

  // Accent
  accent: palette.steelBlueGrey,
  accentLight: palette.steelBlueGreyLight,

  // Text
  text: palette.white,
  textSecondary: palette.subtleBorder,
  textMuted: palette.steelBlueGreyLight,
  textOnDark: palette.white,
  textOnPrimary: palette.offBlack,

  // Status
  success: palette.forestGreen,
  warning: palette.safetyGold,
  error: palette.errorRed,
  info: palette.infoBlue,

  // Borders
  border: palette.steelBlueGrey,
  borderLight: palette.steelBlueGreyLight,

  // Status backgrounds (for badges, alerts)
  successBackground: 'rgba(46, 125, 50, 0.2)',
  warningBackground: 'rgba(255, 184, 0, 0.2)',
  errorBackground: 'rgba(198, 40, 40, 0.15)',

  // Others
  white: palette.white,
  black: palette.black,
  transparent: 'transparent',
  overlay: 'rgba(0,0,0,0.5)',
};
