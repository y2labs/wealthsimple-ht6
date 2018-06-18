import { extractFromCtx } from '~/utils/auth';
import prisma from '~/prisma';
import { setInterval } from 'core-js';
import sendWebPushNotification from '~/web-push/send-web-push-notifiication';

export default {
  Mutation: {
    subscribeWebPush: async (_, args, context, info) => {
      const userId = extractFromCtx(context);

      if (!userId) {
        throw new Error('Authorization required');
      }

      await prisma.mutation.updateUser({
        where: {
          id: userId
        },
        data: {
          webPushSubscription: args.webPushSubscription
        }
      });

      await sendWebPushNotification(
        args.webPushSubscription,
        {
          title: 'A notification from Lancelot',
          body: 'Yay, notifications are enabled! 🚀'
        },
        {
          TTL: 300
        }
      );
    }
  }
};
