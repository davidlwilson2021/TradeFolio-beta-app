import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Input } from '../../components/ui';
import { UPDATE_PROFILE_MUTATION } from '../../graphql/mutations/profile';
import { GET_TRADE_CATEGORIES_QUERY } from '../../graphql/queries/skills';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface ProfileForm {
  tradeCategory: string;
  specialty: string;
  yearsExperience: string;
  locationCity: string;
  locationState: string;
  phone: string;
}

export function ProfileSetupScreen({ navigation }: any) {
  const { control, handleSubmit, setValue, watch } = useForm<ProfileForm>();
  const [updateProfile, { loading }] = useMutation(UPDATE_PROFILE_MUTATION);
  const { data: catData } = useQuery(GET_TRADE_CATEGORIES_QUERY);
  const selectedCategory = watch('tradeCategory');

  const onSubmit = async (data: ProfileForm) => {
    try {
      await updateProfile({
        variables: {
          input: {
            tradeCategory: data.tradeCategory,
            specialty: data.specialty,
            yearsExperience: data.yearsExperience ? parseInt(data.yearsExperience) : 0,
            locationCity: data.locationCity,
            locationState: data.locationState,
            phone: data.phone,
          },
        },
      });
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (err: any) {
      console.error('Profile setup error:', err);
    }
  };

  const categories = catData?.getTradeCategories || [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Set Up Your Profile</Text>
      <Text style={styles.subtitle}>Tell us about your trade</Text>

      <Text style={styles.sectionLabel}>Select Your Trade</Text>
      <View style={styles.categoryGrid}>
        {categories.map((cat: any) => (
          <TouchableOpacity
            key={cat.categoryId}
            style={[styles.categoryItem, selectedCategory === cat.slug && styles.categorySelected]}
            onPress={() => setValue('tradeCategory', cat.slug)}
          >
            <Text style={[styles.categoryText, selectedCategory === cat.slug && styles.categoryTextSelected]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Controller
        control={control}
        name="specialty"
        render={({ field: { onChange, value } }) => (
          <Input label="Specialty" placeholder="e.g. Residential Wiring" onChangeText={onChange} value={value} />
        )}
      />

      <Controller
        control={control}
        name="yearsExperience"
        render={({ field: { onChange, value } }) => (
          <Input label="Years of Experience" placeholder="0" keyboardType="numeric" onChangeText={onChange} value={value} />
        )}
      />

      <Controller
        control={control}
        name="locationCity"
        render={({ field: { onChange, value } }) => (
          <Input label="City" placeholder="Your city" onChangeText={onChange} value={value} />
        )}
      />

      <Controller
        control={control}
        name="locationState"
        render={({ field: { onChange, value } }) => (
          <Input label="State" placeholder="Your state" onChangeText={onChange} value={value} />
        )}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <Input label="Phone (optional)" placeholder="555-123-4567" keyboardType="phone-pad" onChangeText={onChange} value={value} />
        )}
      />

      <Button title="Save & Continue" onPress={handleSubmit(onSubmit)} loading={loading} style={{ marginTop: spacing.md }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  categoryItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categorySelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  categoryTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
});
