const { findUser } = require('./prisma');
const { signJwt } = require('../utils/auth');

module.exports = {
  User: {
    token: (parent, args, context, info) =>
      signJwt({
        userId: parent.id
      })
  }
};
