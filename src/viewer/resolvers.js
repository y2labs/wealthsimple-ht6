const prisma = require('../prisma');
const { findUser } = require('../user/prisma');
const { extractFromCtx } = require('../utils/auth');

module.exports = {
  Query: {
    viewer: () => ({})
  },

  Viewer: {
    me: async (parent, args, context, info) => {
      const userId = extractFromCtx(context);

      const user = await findUser({ id: userId });

      return user;
    }
  }
};
