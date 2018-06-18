/* eslint-env serviceworker */

self.addEventListener('push', event => {
  var notificationData = {};

  try {
    notificationData = event.data.json();
  } catch (e) {
    console.log('event.data.json() failed', e);
    // 🚨 We either got no data or it's malformatted, ABORT ABORT ABORT
    return;
  }

  event.waitUntil(
    self.clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true
      })
      .then(windowClients => {
        for (let i = 0; i < windowClients.length; i++) {
          const windowClient = windowClients[i];
          // The user is looking at Spectrum right now abort showing the notification!
          // (except for if we're on localhost, i.e. in development)
          if (
            windowClient.focused &&
            // eslint-disable-next-line
            !(self.registration.scope.indexOf('http://localhost:300') === 0)
          ) {
            return;
          }
        }

        return self.registration.showNotification(notificationData.title, {
          vibrate: [200],
          icon: '/img/apple-icon-144x144-precomposed.png',
          badge: '/img/badge.png',
          body: notificationData.body,
          title: notificationData.title,
          timestamp: notificationData.timestamp,
          image: notificationData.image,
          tag: notificationData.tag,
          data: notificationData.data
          // If we don't set a tag and set renotify to true this'll throw an error
          // renotify: notificationData.renotify || !!notificationData.tag,
        });
      })
  );
});
