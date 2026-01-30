import { gql } from '@apollo/client';

export const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      projectId
      profileId
      title
      description
      status
      locationCity
      locationState
      projectDate
      createdAt
      skills {
        skillId
        name
      }
    }
  }
`;

export const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject($projectId: ID!, $input: UpdateProjectInput!) {
    updateProject(projectId: $projectId, input: $input) {
      projectId
      title
      description
      status
    }
  }
`;

export const DELETE_PROJECT_MUTATION = gql`
  mutation DeleteProject($projectId: ID!) {
    deleteProject(projectId: $projectId)
  }
`;

export const PUBLISH_PROJECT_MUTATION = gql`
  mutation PublishProject($projectId: ID!) {
    publishProject(projectId: $projectId) {
      projectId
      status
      publishedAt
    }
  }
`;
