function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const createWebPushManager = () => {
  let webPushManager = null;

  const getManager = () => {
    return new Promise(resolve => {
      if (webPushManager) {
        resolve(webPushManager);

        return;
      }

      setTimeout(() => {
        resolve(getManager());
      }, 500);
    });
  };

  return {
    setManager(manager) {
      webPushManager = manager;
    },

    async subscribe() {
      const registration = await navigator.serviceWorker.ready.then();

      const existingSubscription = await registration.pushManager.getSubscription();

      if (existingSubscription) {
        return existingSubscription;
      }

      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(
          process.env.REACT_APP_VAPID_PUBLIC_KEY
        )
      });

      return newSubscription;
    }
  };
};

export default createWebPushManager();
