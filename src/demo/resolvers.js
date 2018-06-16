import { createItem } from '~/item/create-item';
import { createPurchaseableItem } from '~/item/prisma';
import { extractFromCtx } from '~/utils/auth';

export default {
  Mutation: {
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
