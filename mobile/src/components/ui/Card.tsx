import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'hero';
  style?: ViewStyle;
}

export function Card({ children, variant = 'default', style }: CardProps) {
  return (
    <View style={[
      styles.card,
      variant === 'hero' && styles.hero,
      style,
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hero: {
    backgroundColor: colors.heroBackground,
    borderColor: colors.accent,
  },
});
