import pProps from 'p-props';
import { findUser } from '~/user/prisma';
import { fromPriceToAmount } from '~/utils/converters';
import { createDespoit, withTokens } from '~/utils/wealthsimple';
import {
  getPurchaseableItems,
  getPurchasedItems,
  getPreviouslyPurchasedItems
} from '~/item/prisma';
import { useItem } from '~/item/use-item';
import { extractFromCtx } from '~/utils/auth';
import prisma from '~/prisma';

export default {
  Mutation: {
    useItem: async (_, args, context, info) => {
      const userId = extractFromCtx(context);

      if (!userId) {
        throw new Error('Authorization required');
      }

      const { user, purchasedItem } = await pProps({
        user: prisma.query.user(
          {
            where: {
              id: userId
            }
          },
          `
          {
            id
            pet {
              id
            }
          }
        `
        ),
        purchasedItem: prisma.query.purchasedItem(
          {
            where: {
              id: args.id
            }
          },
          `
          {
            item {
              singleUse
              effects {
                name
                description
                type
                value
              }
            }
          }
        `
        )
      });

      if (!purchasedItem) {
        return {
          error: 'Item not found',
          success: false
        };
      }

      // Maybe return the pet here :O
      await useItem(purchasedItem.item, {
        petId: user.pet.id,
        userId: user.id
      });

      return {
        success: true,
        error: ''
      };
    },

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

      const { id } = await prisma.mutation.createPurchasedItem(
        {
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
            },
            depositId: deposit.id
          }
        },
        `{ id }`
      );

      return {
        purchasedItemId: id,
        success: true,
        error: ''
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
    },

    purchasedItems: async (_, args, context, info) => {
      const userId = extractFromCtx(context);

      if (!userId) {
        throw new Error('Authorization required');
      }

      const items = await getPurchasedItems({ userId });

      return items;
    }
  }
};
