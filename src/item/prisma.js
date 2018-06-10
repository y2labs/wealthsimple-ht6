import moment from 'moment';
import prisma from '~/prisma';

export const getPurchaseableItem = async ({ id }, info) => {
  const item = await prisma.query.purchaseableItem({ where: { id } }, info);

  return item;
};

export const getPurchaseableItems = async ({ userId }, info) => {
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
