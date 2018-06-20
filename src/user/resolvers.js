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
    }
  }
};
