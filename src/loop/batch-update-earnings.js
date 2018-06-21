import pSeries from 'p-series';
import pRetry from 'p-retry';
import { get } from 'lodash';
import moment from 'moment';
import prisma from '~/prisma';
import { fromPriceToAmount } from '~/utils/converters';
import { issueFreeDollarsManaged } from '~/future/dollars-managed';

const getPurchasedItemInfo = async ({ purchasedItemId }) => {
  const purchasedItemInfo = await prisma.query.purchasedItem(
    {
      where: {
        id: purchasedItemId
      }
    },
    `
        {
          id
          owner {
            lifetimeDollarsManagedEarned
            id
            pet {
              hunger
              energy
              content
              size
            }
          }
          item {
            effects {
              value
            }
          }
        }
      `
  );

  return purchasedItemInfo;
};

const applyPassiveItemEffects = async (
  {
    itemEffects,
    ownerId,
    ownerCurrentLifetimeDollarsManagedEarned,
    petSize,
    pet,
    passiveItemSyncInterval,
    passiveItemSyncId
  },
  // Ignores minimum stat requirement.
  // Send notifications on constraints fail.
  {
    ignoreConstraints = false,
    sendNotifications = true,
    updateNextSyncAt = true
  } = {}
) => {
  await pSeries(
    itemEffects.map(effect => {
      return async () => {
        const { amount, value, stat } = effect.value;
        const valueWithPetSizeMultiplier = Math.round(petSize * value);

        console.log(
          `Issuing free dollars managed to owner=${ownerId} pet=${
            pet.id
          } amount=${fromPriceToAmount(
            valueWithPetSizeMultiplier
          )} stat=${stat} constraint=${amount}`
        );

        if ((!ignoreConstraints && pet[stat] > amount) || ignoreConstraints) {
          console.log(
            `Issuing ${fromPriceToAmount(
              valueWithPetSizeMultiplier
            )} free dollars managed with a pet size multiplier of ${petSize}`
          );

          const run = async () => {
            await issueFreeDollarsManaged();

            await prisma.mutation.updateUser({
              where: {
                id: ownerId
              },
              data: {
                lifetimeDollarsManagedEarned:
                  valueWithPetSizeMultiplier +
                  ownerCurrentLifetimeDollarsManagedEarned
              }
            });
          };

          await pRetry(run);

          return;
        }

        if (pet[stat] <= amount) {
          console.log(
            `Pet did not meet stat requirement owner=${ownerId} pet=${
              pet.id
            } amount=${fromPriceToAmount(
              valueWithPetSizeMultiplier
            )} stat=${stat} constraint=${amount}`
          );
        }

        if (sendNotifications) {
          // DO SEND NOTIFICATIONS HERE.
        }
      };
    })
  );

  if (updateNextSyncAt) {
    console.log(
      `Updating PassiveItemSync to sync at ${moment()
        .add(passiveItemSyncInterval, 'ms')
        .toDate()}`
    );

    await prisma.mutation.updatePassiveItemSync({
      where: { id: passiveItemSyncId },
      data: {
        nextSyncAt: moment().add(passiveItemSyncInterval, 'ms')
      }
    });
  }
};

export const batchUpdateEarnings = async ({ itemsToSync }, options) => {
  const batchedUpdates = itemsToSync.map(
    ({
      item: { id: purchasedItemId },
      interval: passiveItemSyncInterval,
      id: passiveItemSyncId
    }) => {
      // p-series requires an array of functions that return promises.
      return async () => {
        const purchasedItemInfo = await getPurchasedItemInfo({
          purchasedItemId
        });

        const petSize = get(purchasedItemInfo, 'owner.pet.size', 1);

        await applyPassiveItemEffects(
          {
            ownerCurrentLifetimeDollarsManagedEarned:
              purchasedItemInfo.owner.lifetimeDollarsManagedEarned,
            itemEffects: purchasedItemInfo.item.effects,
            ownerId: purchasedItemInfo.owner.id,
            pet: purchasedItemInfo.owner.pet,
            petSize,
            passiveItemSyncInterval,
            passiveItemSyncId
          },
          options
        );
      };
    }
  );

  await pSeries(batchedUpdates);
};
