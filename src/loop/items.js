import moment from 'moment';
import prisma from '~/prisma';
import { createItem } from '~/item/create-item';
import { createPurchaseableItem } from '~/item/prisma';
import { PERFORM_SYNC_INTERVAL } from '~/loop/constants';

const handler = async () => {
  console.log('Starting items sync');

  const users = await prisma.query.users(
    {
      where: {
        OR: [
          {
            itemEventLoopedAt_lte: moment()
              .subtract(10, 'minute')
              .toDate()
          },
          {
            itemEventLoopedAt: null
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

  if (users.length === 0) {
    console.log(`No users can be synced at this time`);

    return;
  }

  console.log(`Preparing to sync ${users.length} users`);

  await Promise.all(
    users.map(async ({ id: userId, pet }) => {
      const itemData = createItem(pet);

      if (itemData) {
        const { item, expiresAt, price } = itemData;

        const assignedPurchasebleItem = await createPurchaseableItem({
          availableForUser: userId,
          expiresAt,
          price,
          item
        });

        // TODO: Notify user if a GOOD item is on the market.

        await prisma.mutation.updateUser({
          where: {
            id: userId
          },
          data: {
            itemEventLoopedAt: new Date()
          }
        });
      }
    })
  );
};

export default {
  handler,
  interval: PERFORM_SYNC_INTERVAL
};
