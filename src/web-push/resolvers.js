import { isEqual } from 'lodash';
import prisma from '~/prisma';
import { extractFromCtx } from '~/utils/auth';
import sendWebPushNotification from '~/web-push/send-web-push-notifiication';

export default {
  Mutation: {
    subscribeToWebPush: async (_, args, context, info) => {
      const userId = extractFromCtx(context);

      if (!userId) {
        throw new Error('Authorization required');
      }

      const currentUserSubscription = await prisma.query.user(
        {
          where: {
            id: userId
          }
        },
        `
        {
          webPushSubscription {
              keys {
                p256dh
                auth
              }
              endpoint
            }
        }
      `
      );

      if (
        currentUserSubscription &&
        !isEqual(
          currentUserSubscription.webPushSubscription,
          args.webPushSubscription
        )
      ) {
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
        } catch (err) {
          console.log(err);

          return { success: false };
        }
      }

      return {
        success: true
      };
    }
  }
};
