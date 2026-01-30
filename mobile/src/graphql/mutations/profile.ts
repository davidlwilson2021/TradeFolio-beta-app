import { gql } from '@apollo/client';

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
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
