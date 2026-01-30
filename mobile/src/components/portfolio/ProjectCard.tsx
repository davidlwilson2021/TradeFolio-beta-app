import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, MIN_TOUCH_TARGET, borderRadius } from '../../theme/spacing';

interface ProjectCardProps {
  project: {
    projectId: string;
    title: string;
    description?: string;
    status: string;
    locationCity?: string;
    locationState?: string;
    skills?: Array<{ skillId: string; name: string }>;
    viewCount: number;
    likeCount: number;
  };
  onPress: () => void;
}

export function ProjectCard({ project, onPress }: ProjectCardProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.7}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.placeholderText}>No Photo</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{project.title}</Text>
        {project.description ? (
          <Text style={styles.description} numberOfLines={2}>{project.description}</Text>
        ) : null}
        {project.locationCity ? (
          <Text style={styles.location}>
            {project.locationCity}{project.locationState ? `, ${project.locationState}` : ''}
          </Text>
        ) : null}
        <View style={styles.footer}>
          <View style={styles.skills}>
            {project.skills?.slice(0, 2).map(skill => (
              <View key={skill.skillId} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill.name}</Text>
              </View>
            ))}
          </View>
          <View style={styles.stats}>
            <Text style={styles.statText}>{project.viewCount} views</Text>
            <Text style={styles.statText}>{project.likeCount} likes</Text>
          </View>
        </View>
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, project.status === 'published' ? styles.statusPublished : styles.statusDraft]}>
            <Text style={styles.statusText}>{project.status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    height: 160,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  location: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  skillBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  skillText: {
    ...typography.caption,
    color: colors.primary,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  statusRow: {
    marginTop: spacing.sm,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  statusPublished: {
    backgroundColor: colors.successBackground,
  },
  statusDraft: {
    backgroundColor: colors.warningBackground,
  },
  statusText: {
    ...typography.caption,
    color: colors.text,
    textTransform: 'capitalize',
  },
});
