const OfflinePlugin = require('offline-plugin');
const swPrecachePlugin = require('sw-precache-webpack-plugin');

module.exports = config => {
  // Filter out for CRA offline plugin
  config.plugins.filter(plugin => !(plugin instanceof swPrecachePlugin));

  config.plugins.push(
    new OfflinePlugin({
      appShell: '/index.html',
      caches: process.env.NODE_ENV === 'development' ? {} : 'all',
      externals: ['index.html', 'favicon.ico', 'manifest.json', 'sw-push.js'],
      autoUpdate: true,
      ServiceWorker: {
        entry: './public/sw-push.js',
        events: true,
        prefetchRequest: {
          mode: 'cors',
          credentials: 'include'
        }
      },
      AppCache: false
    })
  );

  return config;
};
