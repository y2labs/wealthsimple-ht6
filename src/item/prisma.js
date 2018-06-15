import prisma from '~/prisma';

export const getPreviouslyPurchasedItems = async ({ userId }) => {
  const previouslyPurchasedItems = await prisma.query.purchasedItems(
    {
      where: {
        owner: {
          id: userId
        }
      }
    },
    '{ id }'
  );

  return previouslyPurchasedItems;
};

export const getPurchasedItems = async ({ userId }) => {
  const purchasedItems = await prisma.query.purchasedItems(
    {
      where: {
        owner: {
          id: userId
        }
      }
    },
    `
    {
      id
      depositId
      createdAt
      item {
        id
        name
        description
        singleUse
        effects {
          name
          description
          type
          value
        }
      }
    }
  `
  );

  return purchasedItems;
};

export const getPurchaseableItems = async ({ userId }) => {
  const previouslyPurchasedItems = await getPreviouslyPurchasedItems({
    userId
  });

  const purchaseableItems = await prisma.query.purchaseableItems(
    {
      where: {
        expiresAt_gt: new Date(),
        item: {
          id_not_in: previouslyPurchasedItems.map(({ id }) => id)
        }
      }
    },
    `{
      id
      price
      expiresAt
      item {
        id
        name
        description
        effects {
          name
          description
          type
          value
        }
      }
    }`
  );

  return purchaseableItems;
};

export const createPurchaseableItem = async ({ item, expiresAt }) => {
  const purchaseableItem = await prisma.mutation.createPurchaseableItem({
    data: {
      item,
      expiresAt
    }
  });

  return purchaseableItem;
};
