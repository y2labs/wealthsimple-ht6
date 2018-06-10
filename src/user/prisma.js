import _ from 'lodash';
import prisma from '~/prisma';

export const getUserTokens = async ({ userId }) => {
  const user = await findUser({ id: userId });

  if (!user) {
    return null;
  }

  return _.pick(user, ['accessToken', 'refreshToken', 'accessTokenExpiresAt']);
};

export const updateUserTokens = async ({
  userId,
  refreshToken,
  accessToken,
  accessTokenExpiresAt
}) => {
  const res = await prisma.mutation.updateUser({
    where: {
      id: userId
    },
    data: {
      accessTokenExpiresAt,
      accessToken,
      refreshToken
    }
  });

  return res;
};

export const createUser = async ({
  accessToken,
  refreshToken,
  accessTokenExpiresAt,
  userId,
  personId,
  email,
  phoneNumber,
  name
}) => {
  const user = await prisma.mutation.upsertUser({
    where: { userId },
    create: {
      userId,
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      personId,
      email,
      phoneNumber,
      name
    },
    update: {
      accessTokenExpiresAt,
      accessToken,
      refreshToken
    }
  });

  return user;
};

export const updateUserPrimaryBankAccount = async ({
  userId,
  accountNumber,
  accountName,
  accountId
}) => {
  const res = await prisma.mutation.updateUser({
    where: {
      id: userId
    },
    data: {
      primaryBankAccountNumber: accountNumber,
      primaryBankAccountName: accountName,
      primaryBankAccountId: accountId
    }
  });

  return res;
};

export const findUser = async ({ userId, id, personId }) => {
  const where = _.omitBy(
    {
      personId,
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
