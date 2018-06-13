import moment from 'moment';
import { getNextPetAttributes } from '~/pet/pet-attributes';
import prisma from '~/prisma';

const handler = async () => {
  const pets = await prisma.query.pets({
    where: {
      eventLoopedAt_lte: moment()
        .subtract(1, 'm')
        .toDate()
    }
  });

  await Promise.all(
    pets.map(async pet => {
      const updatedAttributes = getNextPetAttributes(pet);

      // TODO: Send notification when attribute drops below some point.
      await prisma.mutation.updatePet({
        data: updatedAttributes,
        where: {
          id: pet.id
        }
      });
    })
  );
};

export default {
  handler,
  interval: 10000
};
