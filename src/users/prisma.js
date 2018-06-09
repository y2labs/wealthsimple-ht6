const prisma = require('../prisma');

module.exports.createUser = async ({
  accessToken,
  refreshToken,
  expiresAt,
  userId
}) => {
  const user = await prisma.query.user({
    where: {
      id: userId
    }
  });

  if (user) {
    return user;
  }

  const newUser = await prisma.mutation.createUser({
    data: {
      id: user,
      accessToken,
      refreshToken,
      expiresAt
    }
  });

  return newUser;
};
