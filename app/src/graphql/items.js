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
        image {
          uri
        }
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
        image {
          uri
        }
      }
    }
  }
`;
