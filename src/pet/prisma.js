import prisma from '~/prisma';

export const getPetFromUserId = async ({ userId }) => {
  const pet = await prisma.query.pets({
    first: 1,
    where: {
      owner: {
        id: userId
      }
    }
  });

  return pet.length === 1 && pet[0];
};

export const createPet = async ({ name, color, ownerId }) => {
  const pet = await prisma.mutation.createPet({
    data: {
      eventLoopedAt: new Date(),
      name,
      color,
      owner: {
        connect: {
          id: ownerId
        }
      }
    }
  });

  return pet;
};
