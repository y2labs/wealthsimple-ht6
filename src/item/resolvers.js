import { extractFromCtx } from '~/utils/auth';
import { getPurchaseableItem } from '~/item/prisma';

export default {
  Mutation: {
    purchaseItem: async (_, args, context, info) => {
      const userId = extractFromCtx(context);

      if (!userId) {
        throw new Error('Authorization required');
      }

      const purchaseableItem = await getPurchaseableItem({ id: args.id });
    }
  }
};
