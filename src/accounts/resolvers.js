import { extractFromCtx } from '~/utils/auth';
import { updateUserPrimaryAccount } from '~/user/prisma';
import { withTokens, getAccount } from '~/utils/wealthsimple';

export default {
  Mutation: {
    updatePrimaryAccount: async (_, args, context, info) => {
      const userId = extractFromCtx(context);

      if (!userId) {
        throw new Error('Not Authorized');
      }

      const account = await withTokens({ userId }, ({ accessToken }) => {
        return getAccount({ accessToken, id: args.accountId });
      });

      if (!account) {
        throw new Error(`Account ${args.accountId} not found.`);
      }

      await updateUserPrimaryAccount({
        userId,
        accountId: account.id
      });

      return {
        success: true,
        error: ''
      };
    }
  }
};
