import moment from 'moment';
import pProps from 'p-props';
import pRetry from 'p-retry';
import prisma from '~/prisma';
import { PERFORM_SYNC_INTERVAL, INTERACTIONS_VALUE } from '~/loop/constants';
import { withTokens, getDailyValues } from '~/utils/wealthsimple';
import { getOneDayGrowth } from '~/accounts/get-one-day-growth';

const getInteractionsMultipler = ({ interactions }) => {
  const MAX_INTERACTIONS_VALUE = 400;
  const MULTIPLIER_VALUE = 5;

  const lastDayInteractions = interactions.filter(({ createdAt }) => {
    return moment(createdAt).isAfter(moment().subtract(1, 'd'));
  });

  const interactionsValue = lastDayInteractions.reduce(
    (totalValue, { type }) => {
      const interactionValue = INTERACTIONS_VALUE[type];

      return totalValue + interactionValue;
    },
    0
  );

  return (interactionsValue / MAX_INTERACTIONS_VALUE) * MULTIPLIER_VALUE;
};

const getPetAttributesMultiplier = ({ energy, hunger, content }) => {
  const REQUIRED_VALUE_FOR_MULTIPLER = 700;

  const validAttributesCount = [energy, hunger, content].filter(
    attr => attr >= REQUIRED_VALUE_FOR_MULTIPLER
  ).length;

  return validAttributesCount;
};

const getAccountGrowthMultiplier = async ({ userId, primaryAccountId }) => {
  const MULTIPLIER_VALUE = 3;

  const dailyValuesPreviousTwoDays = await withTokens(
    { userId },
    ({ accessToken }) => {
      return getDailyValues({
        accessToken,
        accountId: primaryAccountId,
        startDate: moment()
          .subtract(1, 'd')
          .format('YYYY-MM-DD')
      });
    }
  );

  const oneDayGrowth = getOneDayGrowth({
    currentDay: dailyValuesPreviousTwoDays[0],
    prevDay: dailyValuesPreviousTwoDays[1]
  });

  return oneDayGrowth * MULTIPLIER_VALUE;
};

// Take growth over a day and apply to pet.
const handler = async () => {
  try {
    const usersToSync = await prisma.query.users(
      {
        where: {
          OR: [
            {
              petGrowthEventLoopedAt: null
            },
            {
              petGrowthEventLoopedAt_lte: moment()
                .subtract(1, 'd')
                .toDate()
            }
          ]
        }
      },
      `
      {
        id
        primaryAccountId
        pet {
          id
          interactions {
            type
            createdAt
          }
          size
          hunger
          energy
          content
        }
      }
    `
    );

    await Promise.all(
      usersToSync.map(async user => {
        // Only valid if we have a primary account set up.
        if (!user.primaryAccountId) {
          return;
        }

        const growthMultipliers = {
          dayAccountGrowth: await getAccountGrowthMultiplier({
            userId: user.id,
            primaryAccountId: user.primaryAccountId
          }),

          interactions: 1,
          petAttributes: 1
        };

        if (user.pet) {
          growthMultipliers.interactions = getInteractionsMultipler({
            interactions: user.pet.interactions
          });

          growthMultipliers.petAttributes = getPetAttributesMultiplier({
            energy: user.pet.energy,
            content: user.pet.content,
            hunger: user.pet.hunger
          });
        }

        console.log(
          `pet ${user.pet.id} multipliers: interactions=${
            growthMultipliers.interactions
          } peAttributes=${growthMultipliers.petAttributes} dayAccountGrowth=${
            growthMultipliers.dayAccountGrowth
          }`
        );

        const finalGrowth = Object.values(growthMultipliers).reduce(
          (growth, multiplier) => growth + multiplier,
          0
        );

        console.log(`${user.pet.id} growth - ${finalGrowth}%`);

        const nextSize = user.pet.size * (1 + finalGrowth / 100);

        const run = async () => {
          await pProps({
            updatePet: prisma.mutation.updatePet({
              where: {
                id: user.pet.id
              },
              data: {
                size: nextSize
              }
            }),

            updateUser: prisma.mutation.updateUser({
              where: {
                id: user.id
              },
              data: {
                petGrowthEventLoopedAt: new Date()
              }
            })
          });
        };

        await pRetry(run);
      })
    );
  } catch (err) {
    console.log(err);
  }
};

export default {
  handler,
  interval: PERFORM_SYNC_INTERVAL
};
