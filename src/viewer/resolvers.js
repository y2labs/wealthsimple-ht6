import { findUser } from '~/user/prisma';
import { extractFromCtx } from '~/utils/auth';

export default {
  Query: {
    viewer: () => ({})
  },

  Viewer: {
    me: async (_, args, context, info) => {
      const userId = extractFromCtx(context);

      const user = await findUser({ id: userId }, info);

      return user;
    }
  }
};
