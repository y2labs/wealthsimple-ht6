import gql from 'graphql-tag';

export const itemInfoFragment = gql`
  fragment itemInfoFragment on Item {
    id
    name
    description
    singleUse
    image {
      uri
    }
    effects {
      name
      description
      type
      value
    }
  }
`;

export const getCurrentUserPurchasedItemsQuery = gql`
  query getCurrentUserPurchasedItemsQuery {
    purchasedItems {
      id
      createdAt
      usedAt
      item {
        ...itemInfoFragment
      }
    }
  }

  ${itemInfoFragment}
`;

export const getCurrentUserPurchaseableItemsQuery = gql`
  query getCurrentUserPurchaseableItemsQuery {
    purchaseableItems {
      id
      expiresAt
      price
      item {
        ...itemInfoFragment
      }
    }
  }

  ${itemInfoFragment}
`;

export const purchaseItemMutation = gql`
  mutation purchaseItem($id: ID!) {
    purchaseItem(id: $id) {
      success
      error
      purchasedItemId
    }
  }
`;

export const getPurchaseableItemByIdQuery = gql`
  query getPurchaseableItemByIdQuery($id: ID!) {
    purchaseableItem(id: $id) {
      id
      expiresAt
      price
      item {
        ...itemInfoFragment
      }
    }
  }

  ${itemInfoFragment}
`;
