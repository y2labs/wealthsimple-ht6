import prisma from '~/prisma';
import moment from 'moment';

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
      usedAt
      item {
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
    }
  `
  );

  return purchasedItems;
};

export const getPurchaseableItems = async ({ userId }) => {
  const purchaseableItems = await prisma.query.purchaseableItems(
    {
      where: {
        expiresAt_gt: new Date(),
        availableForUser: {
          id: userId
        },
        purchasedAt: null
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
    }
    `
  );

  return purchaseableItems;
};

export const createPurchaseableItem = async ({
  item,
  expiresAt,
  price,
  availableForUser
}) => {
  const { image, ...toCreateItem } = item;

  const createItemInput = {
    create: {
      ...toCreateItem,
      effects: {
        create: toCreateItem.effects
      }
    }
  };

  if (image) {
    createItemInput.create.image = {
      create: {
        uri: image
      }
    };
  }

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
        item: createItemInput
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
    effects.map(async ({ value, type }) => {
      const { interval } = value;

      if (type === 'NOOP') {
        return;
      }

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

export const getPurchasedItem = async ({ id }, info) => {
  const item = await prisma.query.purchasedItem(
    {
      where: {
        id
      }
    },
    info
  );

  return item;
};

export const getPurchaseableItem = async ({ id, userId }) => {
  const item = await prisma.query.purchaseableItem(
    {
      where: {
        id
      }
    },
    `
    {
      
      id
      price
      expiresAt
      item {
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
      availableForUser {
        id
      }
    }
  `
  );

  if (!item || item.availableForUser.id !== userId) {
    return null;
  }

  return item;
};
