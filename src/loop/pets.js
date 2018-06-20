import moment from 'moment';
import pRetry from 'p-retry';
import { getNextPetAttributes } from '~/pet/pet-attributes';
import prisma from '~/prisma';
import { PERFORM_SYNC_INTERVAL } from '~/loop/constants';

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
        const updatedAttributes = getNextPetAttributes(pet);

        console.log(
          `Updating pet ${pet.id} with attributes enegy=${
            updatedAttributes.energy
          } content=${updatedAttributes.content} hunger=${
            updatedAttributes.hunger
          }`
        );

        await prisma.mutation.updatePet({
          data: updatedAttributes,
          where: { id: pet.id }
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
