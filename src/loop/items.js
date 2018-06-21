import moment from 'moment';
import pProps from 'p-props';
import pRetry from 'p-retry';
import prisma from '~/prisma';
import { createItem } from '~/item/create-item';
import { createPurchaseableItem } from '~/item/prisma';
import { PERFORM_SYNC_INTERVAL } from '~/loop/constants';
import sendWebPushNotification from '~/web-push/send-web-push-notifiication';
import { getUserWebPushSubcription } from '~/user/prisma';

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
      const createdItem = createItem(pet);

      if (!createdItem) {
        return;
      }

      const { temporality, rarity, ...itemData } = createdItem;

      if (itemData) {
        const { item, expiresAt, price } = itemData;

        const assignedPurchasebleItem = await pRetry(
          async () => {
            await createPurchaseableItem({
              availableForUser: userId,
              expiresAt,
              price,
              item
            });
          },
          { retries: 3 }
        );

        // Notify user if a GOOD item is on the market.
        const sendUserNotification = async () => {
          if (temporality === 'passive' && rarity === 'rare') {
            const webPushSubscription = await getUserWebPushSubcription({
              userId
            });

            await sendWebPushNotification(webPushSubscription, {
              title: 'A new item has been released on the marketplace!',
              body: 'Check it out and purchase before it expires!',
              data: {
                href: `/dashboard/market/${assignedPurchasebleItem.id}`
              }
            });
          }
        };

        await pProps({
          sendUserNotification,
          updateUser: prisma.mutation.updateUser({
            where: {
              id: userId
            },
            data: {
              itemEventLoopedAt: new Date()
            }
          })
        });
      }
    })
  );
};

export default {
  handler,
  interval: PERFORM_SYNC_INTERVAL
};
