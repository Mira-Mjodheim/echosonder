```javascript
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.config.js');

const clientPath = path.join(__dirname, 'client');
const buildPath = path.join(__dirname, 'build');

const devConfig = {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    contentBase: buildPath,
    historyApiFallback: true,
    hot: true,
    port: 3000,
    publicPath: '/',
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        pathRewrite: { '^/api': '' },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'eslint-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
};

module.exports = merge(commonConfig, devConfig);
```