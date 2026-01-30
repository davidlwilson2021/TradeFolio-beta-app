import { gql } from '@apollo/client';

export const GET_TRADE_CATEGORIES_QUERY = gql`
  query GetTradeCategories {
    getTradeCategories {
      categoryId
      name
      slug
      displayOrder
      skills {
        skillId
        name
        slug
      }
    }
  }
`;

export const GET_SKILLS_BY_CATEGORY_QUERY = gql`
  query GetSkillsByCategory($category: String!) {
    getSkillsByCategory(category: $category) {
      skillId
      name
      slug
      description
      aliases
    }
  }
`;
