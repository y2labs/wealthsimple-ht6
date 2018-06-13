import { signJwt, extractFromCtx } from '~/utils/auth';
import { getBankAccounts, withTokens, getAccounts } from '~/utils/wealthsimple';

export default {
  User: {
    token: (parent, args, context, info) =>
      signJwt({
        userId: parent.id
      }),

    primaryBankAccount: parent => {
      if (parent.primaryBankAccountName && parent.primaryBankAccountId) {
        return {
          id: parent.primaryBankAccountId,
          name: parent.primaryBankAccountName
        };
      }

      return null;
    },

    primaryAccount: parent => {
      if (parent.primaryAccountId) {
        return {
          id: parent.primaryAccountId
        };
      }

      return null;
    },

    accounts: async (parent, args, context, info) => {
      const accounts = await withTokens(
        { userId: parent.id },
        ({ accessToken }) => {
          return getAccounts({ accessToken, personId: parent.personId });
        }
      );

      return accounts.map(({ id }) => ({
        id
      }));
    },

    bankAccounts: async (parent, args, context, info) => {
      const bankAccounts = await withTokens(
        { userId: parent.id },
        getBankAccounts
      );

      return bankAccounts.map(({ id, account_name, account_number }) => ({
        id,
        accountNumber: account_number,
        accountName: account_name
      }));
    }
  }
};
