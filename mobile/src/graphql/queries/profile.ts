import { gql } from '@apollo/client';

export const MY_PROFILE_QUERY = gql`
  query MyProfile {
    myProfile {
      profileId
      userId
      fullName
      email
      phone
      avatarUrl
      tradeCategory
      specialty
      yearsExperience
      locationCity
      locationState
      subscriptionTier
      profileCompletion
    }
  }
`;

export const GET_PROFILE_QUERY = gql`
  query GetProfile($userId: ID!) {
    getProfile(userId: $userId) {
      profileId
      userId
      fullName
      email
      tradeCategory
      specialty
      yearsExperience
      locationCity
      locationState
      subscriptionTier
      profileCompletion
    }
  }
`;
