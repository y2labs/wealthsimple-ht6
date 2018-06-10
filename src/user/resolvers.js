const { findUser } = require('./prisma');

module.exports = {
  Query: {
    user: (_, args, context, info) => findUser(args)
  }
};
