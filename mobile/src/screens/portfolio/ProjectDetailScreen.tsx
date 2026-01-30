import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PROJECT_QUERY } from '../../graphql/queries/project';
import { PUBLISH_PROJECT_MUTATION, DELETE_PROJECT_MUTATION } from '../../graphql/mutations/project';
import { MY_PROJECTS_QUERY } from '../../graphql/queries/project';
import { Button } from '../../components/ui';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

export function ProjectDetailScreen({ route, navigation }: any) {
  const { projectId } = route.params;
  const { data, loading } = useQuery(GET_PROJECT_QUERY, { variables: { projectId } });
  const [publishProject, { loading: publishing }] = useMutation(PUBLISH_PROJECT_MUTATION, {
    refetchQueries: [{ query: MY_PROJECTS_QUERY, variables: { limit: 50 } }],
  });
  const [deleteProject, { loading: deleting }] = useMutation(DELETE_PROJECT_MUTATION, {
    refetchQueries: [{ query: MY_PROJECTS_QUERY, variables: { limit: 50 } }],
  });

  const project = data?.getProject;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Project not found</Text>
      </View>
    );
  }

  const handlePublish = async () => {
    await publishProject({ variables: { projectId } });
  };

  const handleDelete = async () => {
    await deleteProject({ variables: { projectId } });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.placeholderText}>Photos coming soon</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{project.title}</Text>
          <View style={[styles.statusBadge, project.status === 'published' ? styles.published : styles.draft]}>
            <Text style={styles.statusText}>{project.status}</Text>
          </View>
        </View>

        {project.description ? (
          <Text style={styles.description}>{project.description}</Text>
        ) : null}

        {project.locationCity ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>
              {project.locationCity}{project.locationState ? `, ${project.locationState}` : ''}
            </Text>
          </View>
        ) : null}

        {project.projectDate ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{new Date(project.projectDate).toLocaleDateString()}</Text>
          </View>
        ) : null}

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{project.viewCount}</Text>
            <Text style={styles.statLabel}>Views</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{project.likeCount}</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
        </View>

        {project.skills?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillRow}>
              {project.skills.map((skill: any) => (
                <View key={skill.skillId} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{skill.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.actions}>
          {project.status === 'draft' && (
            <Button title="Publish" onPress={handlePublish} loading={publishing} />
          )}
          <Button
            title="Delete Project"
            variant="secondary"
            onPress={handleDelete}
            loading={deleting}
            style={{ marginTop: spacing.sm }}
          />
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
    paddingBottom: spacing.xxl,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    height: 220,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...typography.body,
    color: colors.textMuted,
  },
  content: {
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  published: {
    backgroundColor: colors.successBackground,
  },
  draft: {
    backgroundColor: colors.warningBackground,
  },
  statusText: {
    ...typography.caption,
    color: colors.text,
    textTransform: 'capitalize',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.h3,
    color: colors.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  skillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  skillBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  skillText: {
    ...typography.bodySmall,
    color: colors.primary,
  },
  actions: {
    marginTop: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
