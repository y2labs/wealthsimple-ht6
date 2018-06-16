import prisma from '~/prisma';
import moment from 'moment';

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
        availableForUser: {
          id: userId
        },
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

export const createPurchaseableItem = async ({
  item,
  expiresAt,
  price,
  availableForUser
}) => {
  const purchaseableItem = await prisma.mutation.createPurchaseableItem(
    {
      data: {
        availableForUser: {
          connect: {
            id: availableForUser
          }
        },
        expiresAt,
        price,
        item: {
          create: {
            ...item,
            effects: {
              create: item.effects
            }
          }
        }
      }
    },
    `
  {
    id
    price
    expiresAt
    item {
      id
    }
  }
`
  );

  return purchaseableItem;
};

export const createPassiveItemSyncFromEffects = async ({
  effects,
  singleUse,
  purchasedItemId
}) => {
  if (singleUse) {
    return;
  }

  await Promise.all(
    effects.map(async ({ value }) => {
      const { interval } = value;

      await prisma.mutation.createPassiveItemSync({
        data: {
          nextSyncAt: moment().add(moment.duration(interval, 'ms')),
          interval,
          item: {
            connect: {
              id: purchasedItemId
            }
          }
        }
      });
    })
  );
};

export const updatePurchaseableItemAsPurchased = async ({ id }) => {
  await prisma.mutation.updatePurchaseableItem({
    where: {
      id
    },
    data: {
      purchasedAt: new Date()
    }
  });
};
