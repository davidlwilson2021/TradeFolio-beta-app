import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, MIN_TOUCH_TARGET, borderRadius } from '../../theme/spacing';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'primary', loading, disabled, style }: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
        isDisabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.textOnPrimary : colors.white}
        />
      ) : (
        <Text style={[
          styles.text,
          variant === 'primary' && styles.primaryText,
          variant === 'outline' && styles.outlineText,
          variant === 'ghost' && styles.ghostText,
          isDisabled && styles.disabledText,
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.accent,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: colors.white,
    ...typography.button,
  },
  primaryText: {
    color: colors.textOnPrimary,
  },
  outlineText: {
    color: colors.accent,
  },
  ghostText: {
    color: colors.accent,
  },
  disabledText: {
    color: colors.textMuted,
  },
});
