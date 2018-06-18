import { extractFromCtx } from '~/utils/auth';
import prisma from '~/prisma';
import sendWebPushNotification from '~/web-push/send-web-push-notifiication';

export default {
  Mutation: {
    subscribeToWebPush: async (_, args, context, info) => {
      const userId = extractFromCtx(context);

      if (!userId) {
        throw new Error('Authorization required');
      }

      await prisma.mutation.updateUser({
        where: {
          id: userId
        },
        data: {
          webPushSubscription: {
            create: {
              endpoint: args.webPushSubscription.endpoint,
              keys: {
                create: {
                  ...args.webPushSubscription.keys
                }
              }
            }
          }
        }
      });

      try {
        const res = await sendWebPushNotification(
          args.webPushSubscription,
          {
            title: 'A notification from Lancelot',
            body: 'Yay, notifications are enabled! 🚀'
          },
          {
            TTL: 300
          }
        );

        return {
          success: true
        };
      } catch (err) {
        console.log(err);

        return { success: false };
      }
    }
  }
};
