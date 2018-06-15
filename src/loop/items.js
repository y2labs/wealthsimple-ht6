import moment from 'moment';
import prisma from '~/prisma';
import { createItem } from '~/item/create-item';
import { createPurchaseableItem } from '~/item/prisma';

const notifyUserAsync = async () => Promise.resolve('SEND');

const handler = async () => {
  const users = await prisma.query.users(
    {
      where: {
        OR: [
          {
            eventLoopedAt_lte: moment()
              .subtract(1, 'minute')
              .toDate()
          },
          {
            eventLoopedAt: null
          }
        ],
        AND: [
          {
            pet: {
              createdAt_not: null
            }
          }
        ]
      }
    },
    `
    {
      id
      pet {
        interactions {
          createdAt
        }
      }
    }
  `
  );

  await Promise.all(
    users.map(async ({ id: userId, pet }) => {
      const itemData = createItem(pet);

      if (itemData) {
        const { item, expiresAt, price } = itemData;

        // const createdPurchasebleItem = await createPurchaseableItem({
        //   item,
        //   expiresAt,
        //   price,
        //   availableForUser: userId
        // });

        // await notifyUserAsync();
      }
    })
  );
};

export default {
  handler,
  interval: 10000
};
