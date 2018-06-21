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
  const { pet } = await prisma.mutation.updateUser(
    {
      where: {
        id: ownerId
      },
      data: {
        pet: {
          create: {
            eventLoopedAt: new Date(),
            name,
            color
          }
        }
      }
    },
    `{
      pet {
        id
        createdAt
        name
        color
        content
        energy
        hunger
        size
      }
    }`
  );

  return pet;
};

export const createPetInteractions = async ({ interactions, petId }) => {
  await prisma.mutation.updatePet({
    where: {
      id: petId
    },
    data: {
      interactions: {
        create: Array.isArray(interactions) ? interactions : [interactions]
      }
    }
  });
};
