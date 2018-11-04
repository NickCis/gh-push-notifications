const path = require('path');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

module.exports = {
  modify: (config, { target, dev }) => {
    if (target === 'web') {
      config.plugins.push(
        new ServiceWorkerWebpackPlugin({
          entry: path.join(__dirname, 'src/client/firebase-messaging-sw.js'),
          filename: 'firebase-messaging-sw.js',
          includes: [],
        })
      );

      if (dev) {
        config.entry.client = config.entry.client.map(entry => {
          if (entry.match(/webpackHotDevClient\.js$/)) {
            return path.resolve('./src/webpackHotDevClient.js');
          }

          return entry;
        });
        config.output.publicPath = '/dev-proxy/';

      }
    }

    return config;
  },
};
