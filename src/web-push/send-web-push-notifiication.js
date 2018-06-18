import webPush from 'web-push';

try {
  webPush.setVapidDetails(
    'mailto:paulxuca@gmail.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  console.log('Web push enabled!');
} catch (err) {
  console.log('Web push could not be enabled!');
  console.log(err);
}

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
