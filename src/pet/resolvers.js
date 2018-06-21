import {
  getPetFromUserId,
  createPet,
  createPetInteractions
} from '~/pet/prisma';
import { extractFromCtx } from '~/utils/auth';

export default {
  Mutation: {
    interactWithPet: async (_, args, context, info) => {
      const userId = extractFromCtx(context);

      if (!userId) {
        throw new Error('Authorization required');
      }

      const pet = await getPetFromUserId({ userId });

      if (!pet) {
        return { success: false, error: 'User does not yet own a pet' };
      }

      await createPetInteractions({
        interactions: args.interactions,
        petId: pet.id
      });

      return {
        success: true
      };
    },

    createPet: async (_, args, context, info) => {
      const userId = extractFromCtx(context);

      if (!userId) {
        throw new Error('Authorization required');
      }

      const existingPet = await getPetFromUserId({ userId });

      if (existingPet) {
        throw new Error(`Pet id ${existingPet.id} exists`);
      }

      const pet = await createPet({
        name: args.name,
        color: args.color,
        ownerId: userId
      });

      return {
        success: true,
        error: '',
        pet
      };
    }
  }
};
