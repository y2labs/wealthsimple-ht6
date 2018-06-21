import pProps from 'p-props';
import pRetry from 'p-retry';
import prisma from '~/prisma';
import { findUser } from '~/user/prisma';
import { fromPriceToAmount } from '~/utils/converters';
import { createDespoit, withTokens } from '~/utils/wealthsimple';
import { useItem } from '~/item/use-item';
import { extractFromCtx } from '~/utils/auth';
import {
  getPurchaseableItems,
  getPurchasedItems,
  createPassiveItemSyncFromEffects,
  updatePurchaseableItemAsPurchased,
  getPurchaseableItem,
  getPurchasedItem
} from '~/item/prisma';
import { getPetFromUserId } from '~/pet/prisma';

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
            createdAt
            usedAt
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

      if (!purchasedItem || purchasedItem.usedAt) {
        return {
          error: 'Item not found or has been used already',
          success: false
        };
      }

      await pProps({
        useItem: useItem(purchasedItem.item, {
          petId: user.pet.id,
          userId: user.id
        }),

        markPurchasedItemAsUsed: prisma.mutation.updatePurchasedItem({
          where: { id: args.id },
          data: { usedAt: new Date() }
        }),

        createPetInteraction: prisma.mutation.updatePet({
          where: {
            id: user.pet.id
          },
          data: {
            interactions: {
              create: [
                {
                  type: 'USE_ITEM'
                }
              ]
            }
          }
        })
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

      const { purchaseableItems, user } = await pProps({
        purchaseableItems: prisma.query.purchaseableItems(
          {
            where: {
              id: args.id,
              purchasedAt: null,
              availableForUser: {
                id: userId
              }
            }
          },
          `{
            id
            price
            item {
              id
              singleUse
              effects {
                type
                value
              }
            }
          }`
        ),

        user: findUser({ id: userId })
      });

      const [purchaseableItem] = purchaseableItems;

      if (!purchaseableItem) {
        return {
          error: 'Item not found',
          success: false
        };
      }

      const bankAccountId = args.bankAccountId || user.primaryBankAccountId;
      const accountId = args.accountId || user.primaryAccountId;

      // Not set up a primary bank account id yet!
      if (!bankAccountId) {
        return {
          success: false,
          error: 'You must set up a primary bank account first.'
        };
      }

      // Not set up a primary account id yet!
      if (!accountId) {
        return {
          success: false,
          error: 'You must set up a primary account first'
        };
      }

      try {
        const deposit = await pRetry(
          async () => {
            const createDepositResponse = await withTokens(
              { userId },
              ({ accessToken }) => {
                return createDespoit({
                  depositAmount: fromPriceToAmount(purchaseableItem.price),
                  bankAccountId,
                  accountId,
                  personId: user.personId,
                  accessToken
                });
              }
            );

            console.log(
              'Creating response - maybe success or fail',
              JSON.stringify(createDepositResponse, null, 2)
            );

            // Random unprocessible entity error
            if (createDepositResponse.code === 422) {
              throw new Error(createDepositResponse.status);
            }

            return createDepositResponse;
          },
          { retries: 3 }
        );

        const purchasedItem = await prisma.mutation.createPurchasedItem(
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
          `{
            id
            depositId
            createdAt
            usedAt
            item {
              id
              name
              description
              singleUse
              image {
                uri
              }
              effects {
                name
                description
                type
                value
              }
            }
          }`
        );

        await pProps({
          createPassiveItemSync: createPassiveItemSyncFromEffects({
            effects: purchaseableItem.item.effects,
            singleUse: purchaseableItem.item.singleUse,
            purchasedItemId: purchasedItem.id
          }),

          updatePurchaseableItemAsPurchased: updatePurchaseableItemAsPurchased({
            id: args.id
          })
        });

        return {
          purchasedItem,
          success: true,
          error: ''
        };
      } catch (err) {
        console.log(err);

        return {
          success: false
        };
      }
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
    },

    purchaseableItem: async (_, args, context, info) => {
      const userId = extractFromCtx(context);

      if (!userId) {
        throw new Error('Authorization required');
      }

      const item = await getPurchaseableItem({
        id: args.id,
        userId
      });

      return item;
    },

    purchasedItem: async (_, args, context, info) => {
      const userId = extractFromCtx(context);

      if (!userId) {
        throw new Error('Authorization required');
      }

      const item = await getPurchasedItem({ id: args.id }, info);

      return item;
    }
  }
};
