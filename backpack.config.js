const path = require('path');

module.exports = {
  webpack: config => {
    config.module.rules.push({
      test: /\.graphql$/,
      loader: 'graphql-import-loader',
      exclude: /node_modules/
    });

    config.resolve.alias = {
      '~': path.join(__dirname, 'src')
    };

    return config;
  }
};
