const prisma = require('../prisma');

module.exports.createUser = async ({
  accessToken,
  refreshToken,
  expiresAt,
  userId
}) => {
  const user = await prisma.mutation.upsertUser({
    where: { userId },
    data: {
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
