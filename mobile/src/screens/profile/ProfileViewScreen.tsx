import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useQuery } from '@apollo/client';
import { MY_PROFILE_QUERY } from '../../graphql/queries/profile';
import { Button } from '../../components/ui';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

export function ProfileViewScreen({ navigation, onSignOut }: any) {
  const { data, loading } = useQuery(MY_PROFILE_QUERY);
  const profile = data?.myProfile;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Profile not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile.fullName?.charAt(0)?.toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.name}>{profile.fullName}</Text>
        <Text style={styles.email}>{profile.email}</Text>
        {profile.tradeCategory && (
          <Text style={styles.trade}>
            {profile.tradeCategory} {profile.specialty ? `- ${profile.specialty}` : ''}
          </Text>
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.yearsExperience || 0}</Text>
          <Text style={styles.statLabel}>Years Exp.</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.profileCompletion}%</Text>
          <Text style={styles.statLabel}>Complete</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.subscriptionTier}</Text>
          <Text style={styles.statLabel}>Tier</Text>
        </View>
      </View>

      {profile.locationCity && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Location</Text>
          <Text style={styles.infoValue}>
            {profile.locationCity}{profile.locationState ? `, ${profile.locationState}` : ''}
          </Text>
        </View>
      )}

      {profile.phone && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{profile.phone}</Text>
        </View>
      )}

      <Button
        title="Edit Profile"
        variant="outline"
        onPress={() => navigation.navigate('ProfileSetup')}
        style={{ marginTop: spacing.lg }}
      />

      <Button
        title="Sign Out"
        variant="secondary"
        onPress={onSignOut}
        style={{ marginTop: spacing.md }}
      />
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
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    ...typography.h1,
    color: colors.white,
  },
  name: {
    ...typography.h2,
    color: colors.text,
  },
  email: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  trade: {
    ...typography.bodySmall,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.h3,
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textTransform: 'capitalize',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  infoValue: {
    ...typography.bodySmall,
    color: colors.text,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
