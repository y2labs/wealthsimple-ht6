import webPush from 'web-push';

try {
  webPush.setVapidDetails(
    'mailto:paulxuca@gmail.com',
    process.env.VALID_PUBLIC_KEY,
    process.env.VALID_PRIVATE_KEY
  );
  console.log('Web push enabled!');
} catch (err) {}

const sendWebPushNotification = (webPushSubscription, payload, options) => {
  if (!webPushSubscription || !payload) {
    return;
  }

  const serializedPayload =
    typeof payload === 'string'
      ? payload
      : JSON.stringify({ ...payload, raw: true });

  return webPush.sendNotification(webPushSubscription, serializedPayload, {
    TTL: 86400,
    ...options
  });
};

export default sendWebPushNotification;
