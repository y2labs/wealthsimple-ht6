import { getPetFromUserId, createPet } from '~/pet/prisma';
import { extractFromCtx } from '~/utils/auth';

export default {
  Mutation: {
    createPet: async (_, args, context, info) => {
      const userId = extractFromCtx(context);

      if (!userId) {
        throw new Error('Not Authorized');
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
        success: false,
        error: '',
        pet
      };
    }
  }
};
