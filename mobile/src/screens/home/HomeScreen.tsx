import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@apollo/client';
import { MY_PROFILE_QUERY } from '../../graphql/queries/profile';
import { MY_PROJECTS_QUERY } from '../../graphql/queries/project';
import { Button } from '../../components/ui';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

export function HomeScreen({ navigation }: any) {
  const { data: profileData } = useQuery(MY_PROFILE_QUERY);
  const { data: projectsData } = useQuery(MY_PROJECTS_QUERY, { variables: { limit: 5 } });

  const profile = profileData?.myProfile;
  const projects = projectsData?.myProjects || [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.greeting}>
        Welcome{profile ? `, ${profile.fullName.split(' ')[0]}` : ''}!
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Profile Completion</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${profile?.profileCompletion || 0}%` }]} />
        </View>
        <Text style={styles.progressText}>{profile?.profileCompletion || 0}% complete</Text>
        {(profile?.profileCompletion || 0) < 100 && (
          <Button
            title="Complete Profile"
            variant="outline"
            onPress={() => navigation.navigate('ProfileTab', { screen: 'ProfileSetup' })}
            style={{ marginTop: spacing.sm }}
          />
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Portfolio</Text>
        <Text style={styles.projectCount}>{projects.length} project{projects.length !== 1 ? 's' : ''}</Text>
        <Button
          title="Add Project"
          onPress={() => navigation.navigate('PortfolioTab', { screen: 'CreateProject' })}
          style={{ marginTop: spacing.sm }}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Stats</Text>
        <View style={styles.quickStats}>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>
              {projects.reduce((sum: number, p: any) => sum + p.viewCount, 0)}
            </Text>
            <Text style={styles.quickStatLabel}>Total Views</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>
              {projects.reduce((sum: number, p: any) => sum + p.likeCount, 0)}
            </Text>
            <Text style={styles.quickStatLabel}>Total Likes</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>
              {projects.filter((p: any) => p.status === 'published').length}
            </Text>
            <Text style={styles.quickStatLabel}>Published</Text>
          </View>
        </View>
      </View>
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
  greeting: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  projectCount: {
    ...typography.body,
    color: colors.textSecondary,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickStat: {
    alignItems: 'center',
  },
  quickStatValue: {
    ...typography.h3,
    color: colors.primary,
  },
  quickStatLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
