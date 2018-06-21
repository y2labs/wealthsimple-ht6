import moment from 'moment';
import pRetry from 'p-retry';
import pProps from 'p-props';
import { getNextPetAttributes } from '~/pet/pet-attributes';
import prisma from '~/prisma';
import { PERFORM_SYNC_INTERVAL, PET_UNHEALTHY_VALUE } from '~/loop/constants';
import { getUserWebPushSubcription } from '~/user/prisma';
import sendWebPushNotification from '~/web-push/send-web-push-notifiication';

const handler = async () => {
  const pets = await prisma.query.pets(
    {
      where: {
        eventLoopedAt_lte: moment()
          .subtract(1, 'm')
          .toDate()
      }
    },
    `
    {
      id
      content
      energy
      hunger
      name
      owner { id }
      interactions {
        createdAt
        type
      }
    }
  `
  );

  await Promise.all(
    pets.map(async pet => {
      const run = async () => {
        const { eventLoopedAt, ...updatedAttributes } = getNextPetAttributes(
          pet
        );

        console.log(
          `Updating pet ${pet.id} with attributes enegy=${
            updatedAttributes.energy
          } content=${updatedAttributes.content} hunger=${
            updatedAttributes.hunger
          }`
        );

        const sendUserNotification = async () => {
          // Get a list of attributes that are "unhealthy"
          const unhealthyAttributes = Object.values(updatedAttributes).filter(
            attributeValue => {
              return attributeValue < PET_UNHEALTHY_VALUE;
            }
          );

          if (unhealthyAttributes.length !== 0) {
            const webPushSubscription = await getUserWebPushSubcription({
              userId: pet.owner.id
            });

            await sendWebPushNotification(webPushSubscription, {
              title: 'Uh oh! your pet is in bad shape.',
              body: `Come back and play with ${pet.name}`,
              icon: 'https://i.imgur.com/QwxS4HH.png'
            });
          }
        };

        await pProps({
          updatePet: prisma.mutation.updatePet({
            data: {
              ...updatedAttributes,
              eventLoopedAt
            },
            where: { id: pet.id }
          }),

          sendUserNotification
        });
      };

      await pRetry(run);
    })
  );
};

export default {
  handler,
  interval: PERFORM_SYNC_INTERVAL
};
