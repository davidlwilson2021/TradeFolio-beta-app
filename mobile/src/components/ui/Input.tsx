import React, { forwardRef } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, MIN_TOUCH_TARGET, borderRadius } from '../../theme/spacing';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = forwardRef<TextInput, InputProps>(({ label, error, style, ...props }, ref) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        ref={ref}
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={colors.textMuted}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    minHeight: MIN_TOUCH_TARGET,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    ...typography.body,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
