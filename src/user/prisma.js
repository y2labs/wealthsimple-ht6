const _ = require('lodash');
const prisma = require('../prisma');

module.exports.createUser = async ({
  accessToken,
  refreshToken,
  expiresAt,
  userId
}) => {
  const user = await prisma.mutation.upsertUser({
    where: { userId },
    create: {
      userId,
      accessToken,
      refreshToken,
      expiresAt
    },
    update: {
      accessToken,
      refreshToken,
      expiresAt
    }
  });

  return user;
};

module.exports.findUser = async ({ userId, id }) => {
  const where = _.omitBy(
    {
      userId,
      id
    },
    _.isUndefined
  );

  const user = await prisma.query.user({ where });

  return user;
};
