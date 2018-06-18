import gql from 'graphql-tag';

export const getCurrentUserPurchasedItemsQuery = gql`
  query getCurrentUserPurchasedItemsQuery {
    purchasedItems {
      id
      createdAt
      usedAt
      item {
        name
        description
        id
      }
    }
  }
`;

export const getCurrentUserPurchaseableItemsQuery = gql`
  query getCurrentUserPurchaseableItemsQuery {
    purchaseableItems {
      id
      expiresAt
      price
      item {
        name
        description
        id
      }
    }
  }
`;
