import moment from 'moment';
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
    ' { id }'
  );

  return previouslyPurchasedItems;
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
          id_not_in: previouslyPurchasedItems
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
