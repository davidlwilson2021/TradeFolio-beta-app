import React from 'react';
import { Text, StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Input } from '../../components/ui';
import { CREATE_PROJECT_MUTATION } from '../../graphql/mutations/project';
import { GET_TRADE_CATEGORIES_QUERY } from '../../graphql/queries/skills';
import { MY_PROJECTS_QUERY } from '../../graphql/queries/project';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface ProjectForm {
  title: string;
  description: string;
  locationCity: string;
  locationState: string;
  projectDate: string;
}

export function CreateProjectScreen({ navigation }: any) {
  const { control, handleSubmit, formState: { errors } } = useForm<ProjectForm>();
  const [createProject, { loading }] = useMutation(CREATE_PROJECT_MUTATION, {
    refetchQueries: [{ query: MY_PROJECTS_QUERY, variables: { limit: 50 } }],
  });
  const { data: catData } = useQuery(GET_TRADE_CATEGORIES_QUERY);
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);

  const allSkills = (catData?.getTradeCategories || []).flatMap(
    (cat: any) => cat.skills || []
  );

  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev =>
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const onSubmit = async (data: ProjectForm) => {
    try {
      const result = await createProject({
        variables: {
          input: {
            title: data.title,
            description: data.description || undefined,
            locationCity: data.locationCity || undefined,
            locationState: data.locationState || undefined,
            projectDate: data.projectDate || undefined,
            skillIds: selectedSkills.length > 0 ? selectedSkills : undefined,
          },
        },
      });
      navigation.navigate('ProjectDetail', {
        projectId: result.data.createProject.projectId,
      });
    } catch (err: any) {
      console.error('Create project error:', err);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>New Project</Text>

      <Controller
        control={control}
        name="title"
        rules={{ required: 'Title is required' }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Project Title"
            placeholder="e.g. Kitchen Rewire - 200 Amp Panel"
            onChangeText={onChange}
            value={value}
            error={errors.title?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Description"
            placeholder="Describe the work you did..."
            multiline
            numberOfLines={4}
            style={{ minHeight: 100, textAlignVertical: 'top' }}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="locationCity"
        render={({ field: { onChange, value } }) => (
          <Input label="City" placeholder="Project city" onChangeText={onChange} value={value} />
        )}
      />

      <Controller
        control={control}
        name="locationState"
        render={({ field: { onChange, value } }) => (
          <Input label="State" placeholder="Project state" onChangeText={onChange} value={value} />
        )}
      />

      <Controller
        control={control}
        name="projectDate"
        render={({ field: { onChange, value } }) => (
          <Input label="Project Date" placeholder="YYYY-MM-DD" onChangeText={onChange} value={value} />
        )}
      />

      {allSkills.length > 0 && (
        <>
          <Text style={styles.sectionLabel}>Tag Skills</Text>
          <View style={styles.skillGrid}>
            {allSkills.map((skill: any) => (
              <TouchableOpacity
                key={skill.skillId}
                style={[styles.skillChip, selectedSkills.includes(skill.skillId) && styles.skillSelected]}
                onPress={() => toggleSkill(skill.skillId)}
              >
                <Text style={[styles.skillText, selectedSkills.includes(skill.skillId) && styles.skillTextSelected]}>
                  {skill.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <Button title="Create Project" onPress={handleSubmit(onSubmit)} loading={loading} style={{ marginTop: spacing.lg }} />
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
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  skillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  skillChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  skillText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  skillTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
});
