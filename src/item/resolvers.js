import pProps from 'p-props';
import { findUser } from '~/user/prisma';
import { getPurchaseableItem, getPurchaseableItems } from '~/item/prisma';
import { extractFromCtx } from '~/utils/auth';

export default {
  Mutation: {
    purchaseItem: async (_, args, context, info) => {
      const userId = extractFromCtx(context);

      if (!userId) {
        throw new Error('Authorization required');
      }

      const { purchaseItem, user } = await pProps({
        purchaseItem: getPurchaseableItem({ id: args.id }),
        user: findUser({ userId })
      });

      if (!purchaseItem) {
        return {
          item: {},
          success: false,
          error: 'Item not found'
        };
      }

      return {
        error: '',
        success: true,
        item: {}
      };
    }
  },

  Query: {
    purchaseableItems: async (_, args, context, info) => {
      const userId = extractFromCtx(context);

      if (!userId) {
        throw new Error('Authorization required');
      }

      const items = await getPurchaseableItems({ userId });

      return items;
    }
  }
};
