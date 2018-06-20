import { findUser } from '~/user/prisma';
import { extractFromCtx } from '~/utils/auth';
import { withTokens, getAccounts, getBankAccounts } from '~/utils/wealthsimple';

export default {
  Query: {
    viewer: () => ({})
  },

  Viewer: {
    me: async (_, args, context, info) => {
      const userId = extractFromCtx(context);

      const user = await findUser({ id: userId }, info);

      return user;
    },

    accounts: async (parent, args, context, info) => {
      const userId = extractFromCtx(context);

      if (!userId) {
        throw new Error('Authorization Required');
      }

      const accounts = await withTokens({ userId }, ({ accessToken }) => {
        return getAccounts({ accessToken, personId: parent.personId });
      });

      return accounts.map(({ id }) => ({
        id
      }));
    },

    bankAccounts: async (parent, args, context) => {
      const userId = extractFromCtx(context);

      if (!userId) {
        throw new Error('Authorization Required');
      }

      const bankAccounts = await withTokens({ userId }, getBankAccounts);

      return bankAccounts.map(({ id, account_name, account_number }) => ({
        id,
        accountNumber: account_number,
        accountName: account_name
      }));
    }
  }
};
