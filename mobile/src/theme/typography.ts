/**
 * TradeFolio "Iron & Amber" Typography
 *
 * Headings: Barlow Condensed (Bold/ExtraBold) – industrial, heavy-duty feel
 * Body: Inter (Regular) – clean, high-legibility
 *
 * H1/H2 use uppercase with tight letter spacing.
 * Button text uses uppercase for emphasis.
 */

export const fontFamily = {
  heading: 'BarlowCondensed-Bold',
  headingHeavy: 'BarlowCondensed-ExtraBold',
  headingSemiBold: 'BarlowCondensed-SemiBold',
  body: 'Inter-Regular',
  bodyMedium: 'Inter-Medium',
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '800' as const,
    fontFamily: fontFamily.headingHeavy,
    textTransform: 'uppercase' as const,
    letterSpacing: -0.64, // -0.02em * 32
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    fontFamily: fontFamily.heading,
    textTransform: 'uppercase' as const,
    letterSpacing: -0.48, // -0.02em * 24
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    fontFamily: fontFamily.headingSemiBold,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    fontFamily: fontFamily.headingSemiBold,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    fontFamily: fontFamily.body,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    fontFamily: fontFamily.body,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    fontFamily: fontFamily.body,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    fontFamily: fontFamily.headingSemiBold,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.64, // 0.04em * 16
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    fontFamily: fontFamily.bodyMedium,
  },
};
