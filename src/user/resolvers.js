import { signJwt, extractFromCtx } from '~/utils/auth';
import { getBankAccounts, withTokens } from '~/utils/wealthsimple';

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
