import moment from 'moment';
import { get } from 'lodash';
import prisma from '~/prisma';
import { PERFORM_SYNC_INTERVAL } from '~/loop/constants';
import { issueFreeDollarsManaged } from '~/future/dollars-managed';
import { fromPriceToAmount } from '~/utils/converters';

const handler = async () => {
  const itemsToSync = await prisma.query.passiveItemSyncs(
    {
      where: {
        nextSyncAt_lte: new Date()
      }
    },
    `
    {
      id
      interval
      item {
        id
      }
    }
  `
  );

  await Promise.all(
    itemsToSync.map(
      async ({
        item: { id },
        interval: passiveItemSyncInterval,
        id: passiveItemSyncId
      }) => {
        const itemPetUserInfo = await prisma.query.purchasedItem(
          {
            where: {
              id
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

        const petSize = get(itemPetUserInfo, 'owner.pet.size', 1);

        await Promise.all(
          itemPetUserInfo.item.effects.map(async effect => {
            const { amount, value, stat } = effect.value;

            const valueWithPetSizeMultiplier = Math.round(petSize * value);

            // Good!
            if (itemPetUserInfo.owner.pet[stat] > amount) {
              console.log(
                `Issuing ${fromPriceToAmount(
                  valueWithPetSizeMultiplier
                )} free dollars managed with a pet size multiplier of ${petSize}`
              );

              await issueFreeDollarsManaged();

              await prisma.mutation.updateUser({
                where: {
                  id: itemPetUserInfo.owner.id
                },
                data: {
                  lifetimeDollarsManagedEarned: valueWithPetSizeMultiplier
                }
              });
            }

            // Bad!
          })
        );

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
    )
  );
};

export default {
  handler,
  interval: PERFORM_SYNC_INTERVAL
};
