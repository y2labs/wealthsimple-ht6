import pProps from 'p-props';
import { findUser } from '~/user/prisma';
import { fromPriceToAmount } from '~/utils/converters';
import { createDespoit, withTokens } from '~/utils/wealthsimple';
import { getPurchaseableItems } from '~/item/prisma';
import { extractFromCtx } from '~/utils/auth';
import prisma from '~/prisma';

export default {
  Mutation: {
    purchaseItem: async (_, args, context, info) => {
      const userId = extractFromCtx(context);

      if (!userId) {
        throw new Error('Authorization required');
      }

      const { purchaseableItem, user } = await pProps({
        purchaseableItem: prisma.query.purchaseableItem(
          { where: { id: args.id } },
          `{ id price item { id }}`
        ),
        user: findUser({ id: userId })
      });

      if (!purchaseableItem) {
        return {
          error: 'Item not found',
          success: false
        };
      }

      // Not set up a primary bank account id yet!
      if (!user.primaryBankAccountId) {
        return {
          success: false,
          error: 'You must set up a primary bank account first.'
        };
      }

      // Not set up a primary account id yet!
      if (!user.primaryAccountId) {
        return {
          success: false,
          error: 'You must set up a primary account first'
        };
      }

      const deposit = await withTokens({ userId }, ({ accessToken }) => {
        return createDespoit({
          depositAmount: fromPriceToAmount(purchaseableItem.price),
          bankAccountId: user.primaryBankAccountId,
          accountId: user.primaryAccountId,
          personId: user.personId,
          accessToken
        });
      });

      const purchasedItem = await prisma.mutation.createPurchasedItem({
        data: {
          item: {
            connect: {
              id: purchaseableItem.item.id
            }
          },
          owner: {
            connect: {
              id: userId
            }
          }
        }
      });

      return {
        error: '',
        success: true,
        item: purchasedItem
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
