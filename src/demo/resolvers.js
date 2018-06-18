import moment from 'moment';
import { createItem } from '~/item/create-item';
import { createPurchaseableItem } from '~/item/prisma';
import { extractFromCtx } from '~/utils/auth';

export default {
  Mutation: {
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
          effects: [
            {
              name: 'Cheesiest Pizza',
              description:
                "Earning passive dollars managed while your pet's content is above 765 every 18 hours",
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

      return {
        purchaseableItemId: purchaseableItem.id,
        success: true
      };
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
    }
  }
};
