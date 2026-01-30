import { gql } from '@apollo/client';

export const MY_PROJECTS_QUERY = gql`
  query MyProjects($limit: Int, $offset: Int) {
    myProjects(limit: $limit, offset: $offset) {
      projectId
      profileId
      title
      description
      status
      locationCity
      locationState
      projectDate
      viewCount
      likeCount
      createdAt
      publishedAt
      skills {
        skillId
        name
      }
      media {
        mediaId
        mediaType
        originalUrl
        thumbnailUrl
      }
    }
  }
`;

export const GET_PROJECT_QUERY = gql`
  query GetProject($projectId: ID!) {
    getProject(projectId: $projectId) {
      projectId
      profileId
      title
      description
      sourceType
      status
      locationCity
      locationState
      projectDate
      viewCount
      likeCount
      createdAt
      updatedAt
      publishedAt
      skills {
        skillId
        name
        slug
      }
      media {
        mediaId
        mediaType
        originalUrl
        thumbnailUrl
        blurHash
        isBeforeAfter
        beforeAfterType
        displayOrder
      }
    }
  }
`;
