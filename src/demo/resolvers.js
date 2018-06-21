import moment from 'moment';
import pProps from 'p-props';
import { get } from 'lodash';
import { createItem } from '~/item/create-item';
import { createPurchaseableItem } from '~/item/prisma';
import { extractFromCtx } from '~/utils/auth';
import prisma from '~/prisma';
import sendWebPushNotification from '~/web-push/send-web-push-notifiication';
import { getUserWebPushSubcription } from '~/user/prisma';
import { getUserItemsToSync } from '~/demo/prisma';
import { batchUpdateEarnings } from '~/loop/batch-update-earnings';

export default {
  Mutation: {
    DEMOtriggerHungerWarning: async (_, args, context, info) => {
      const userId = extractFromCtx(context);

      if (!userId) {
        throw new Error('Demo error - no user in context');
      }

      const {
        pet: { id }
      } = await prisma.query.user(
        {
          where: {
            id: userId
          }
        },
        `{ pet { id }}`
      );

      const {
        webPushSubscription,
        user: {
          pet: { name: petName }
        }
      } = await pProps({
        updatePet: prisma.mutation.updatePet({
          where: {
            id
          },
          data: {
            hunger: 300
          }
        }),

        webPushSubscription: getUserWebPushSubcription({ userId }),
        user: prisma.query.user(
          {
            where: {
              id: userId
            }
          },
          `
            {
              pet {
                name
              }
            }
          `
        )
      });

      await sendWebPushNotification(webPushSubscription, {
        title: `It's ${petName}'s Dinnertime!`,
        body: 'Time to feed your pet, they are super hungry!',
        icon: 'https://i.imgur.com/QwxS4HH.png',
        data: {
          href: '/dashboard#marketplace'
        }
      });

      return {
        success: true
      };
    },

    DEMOcreatePassiveItemPizza: async (_, args, context, info) => {
      const userId = extractFromCtx(context);

      if (!userId) {
        throw new Error('Demo error - no user in context');
      }

      const purchaseableItem = await createPurchaseableItem({
        availableForUser: userId,
        expiresAt: moment().add(1, 'hour'),
        price: 500,
        item: {
          image:
            'https://s1.piq.land/2014/11/23/MraNnPdcfWTL5lb2tHOCVEC0_400x400.png',
          name: 'Cheesy Pizza',
          description: 'The worlds most cheesy pizza.',
          singleUse: true,
          effects: [
            {
              name: 'Delicious Pizza!',
              description: 'Eat to recover hunger.',
              type: 'HUNGER_INCREASE',
              value: { value: 300 }
            }
          ]
        }
      });

      return {
        purchaseableItemId: purchaseableItem.id,
        success: true
      };
    },

    DEMOcreatePassiveItemHT6: async (_, args, context, info) => {
      const userId = extractFromCtx(context);

      if (!userId) {
        throw new Error('Demo error - no user in context');
      }

      const {
        pet: { name: petName }
      } = await prisma.query.user(
        {
          where: {
            id: userId
          }
        },
        `
        {
          pet {
            name
          }
        }
      `
      );

      const purchaseableItem = await createPurchaseableItem({
        availableForUser: userId,
        expiresAt: moment().add(1, 'hour'),
        price: 600,
        item: {
          image: 'https://i.imgur.com/Go4O8uE.png',
          name: 'CN Tower Toy',
          description: `Special item for Hack the 6ix!. Available only for a limited amount of time and quantity, cop a special Hack The 6ix CN Tower Toy for ${petName}!`,
          effects: [
            {
              name: 'Best hackathon ever!',
              description:
                "Earning $0.48 passive dollars managed while your pet's content is above 765 every 18 hours",
              type: 'PASSIVE_EARN_MANAGED_DOLLARS',
              value: {
                value: 47,
                interval: 64800000,
                amount: 765,
                stat: 'content'
              }
            }
          ]
        }
      });

      try {
        const webPushSubscription = await getUserWebPushSubcription({ userId });

        await sendWebPushNotification(webPushSubscription, {
          title: `HT6 Collectors' Item Available`,
          body: 'Let this limited-edition toy earn you $$ while you hack away!',
          icon: 'https://i.imgur.com/nABpCu8.png',
          data: {
            href: `/dashboard/market/${purchaseableItem.id}`
          }
        });

        return {
          purchaseableItemId: purchaseableItem.id,
          success: true
        };
      } catch (err) {
        console.log(err);

        return { success: false };
      }
    },

    DEMOcreatePassiveItem: async (_, args, context, info) => {
      const userId = extractFromCtx(context);

      if (!userId) {
        throw new Error('Demo error - no user in context');
      }

      const itemData = createItem({
        overrideRarity: 'rare',
        overrideTemporality: 'passive'
      });

      if (!itemData) {
        return { success: true };
      }

      const { item, expiresAt, price } = itemData;

      const purchaseableItem = await createPurchaseableItem({
        availableForUser: userId,
        expiresAt,
        price,
        item
      });

      return {
        purchaseableItemId: purchaseableItem.id,
        success: true
      };
    },

    DEMOTriggerPetEarnSync: async (_, args, context) => {
      const userId = extractFromCtx(context);

      if (!userId) {
        throw new Error('Demo error - no user in context');
      }

      console.log('Starting manual passive item sync');

      const itemsToSync = await getUserItemsToSync({ userId });

      if (itemsToSync.length === 0) {
        console.log('No passive items can be manually synced, skipping');

        return { success: true };
      }

      console.log(`Syncing ${itemsToSync.length} passive items manually`);

      await batchUpdateEarnings(
        { itemsToSync },
        {
          ignoreConstraints: true,
          sendNotifications: false,
          updateNextSyncAt: false
        }
      );

      return { success: true };
    }
  }
};
