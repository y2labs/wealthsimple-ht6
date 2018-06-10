import moment from 'moment';
import _ from 'lodash';
import prisma from '~/prisma';
import { getStatus } from '~/pet/utils';

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
      // TODO: Factor in items purchased to decrease.
      const updatedAttributes = {
        eventLoopedAt: moment().toDate(),
        statuses: pet.statuses,
        hunger: _.random(pet.hunger - 10, pet.hunger),
        content: _.random(pet.hunger - 10, pet.content),
        energy: _.random(pet.hunger - 10, pet.energy)
      };

      // Get the updated status of the pet.
      updatedAttributes.statuses = getStatus(updatedAttributes);

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

export default handler;
