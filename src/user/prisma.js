import _ from 'lodash';
import prisma from '~/prisma';

export const createUser = async ({
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

export const findUser = async ({ userId, id }) => {
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
