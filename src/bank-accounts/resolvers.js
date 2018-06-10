import { updateUserPrimaryBankAccount } from '~/user/prisma';
import { extractFromCtx } from '~/utils/auth';
import { getBankAccount, withTokens } from '~/utils/wealthsimple';

export default {
  Mutation: {
    updatePrimaryBankAccount: async (_, args, context, info) => {
      const userId = extractFromCtx(context);

      if (!userId) {
        throw new Error('Unauthorized');
      }

      const bankAccount = await withTokens(
        { userId },
        async ({ accessToken }) => {
          return getBankAccount({ accessToken, id: args.accountId });
        }
      );

      if (!bankAccount) {
        return {
          success: false,
          error: `Bank account with id ${args.accountId} not found`
        };
      }

      await updateUserPrimaryBankAccount({
        userId,
        accountId: bankAccount.id,
        accountName: bankAccount.account_name,
        accountNumber: bankAccount.account_number
      });

      return {
        error: '',
        success: true
      };
    }
  }
};
