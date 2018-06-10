const _ = require('lodash');
const prisma = require('../prisma');

module.exports.createUser = async ({
  accessToken,
  refreshToken,
  accessTokenExpiresAt,
  userId
}) => {
  const user = await prisma.mutation.upsertUser({
    where: { userId },
    create: {
      userId,
      accessToken,
      refreshToken,
      accessTokenExpiresAt
    },
    update: {
      accessTokenExpiresAt,
      accessToken,
      refreshToken
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
    _.isNil
  );

  if (!where.userId && !where.id) {
    return null;
  }

  const user = await prisma.query.user({ where });

  return user;
};
