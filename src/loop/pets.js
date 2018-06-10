const moment = require('moment');
const lodash = require('lodash');
const prisma = require('../prisma');
const { getStatus } = require('../pet/utils');

module.exports = async () => {
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
        hunger: lodash.random(pet.hunger - 10, pet.hunger),
        content: lodash.random(pet.hunger - 10, pet.content),
        energy: lodash.random(pet.hunger - 10, pet.energy)
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
