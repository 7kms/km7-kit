import { resolve } from 'path';
import { defineConfig } from 'umi';
const { name: pkgName } = require(resolve(__dirname, '../package.json'));

// ref: https://umijs.org/config/
export default defineConfig({
  publicPath: '/public/src',
  manifest: {
    fileName: resolve(process.cwd(), './config/manifest.json'),
  },
  hash: true,
  chainWebpack(config) {
    config.optimization.runtimeChunk('single');
    config.optimization.splitChunks({
      cacheGroups: {
        vendors: {
          name: 'vendors',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|react-redux|redux|redux-saga|umi|dva|dva-core|dva-loading|(\@babel)|core-js|moment)[\\/]/,
        },
        icons: {
          name: 'icons',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](@ant-design)[\\/]/,
        },
        commons: {
          name: 'commons',
          chunks: 'async',
          minChunks: 2,
          minSize: 0,
        },
      },
    });
  },
  uglifyJSOptions(opts) {
    opts.uglifyOptions.compress.drop_console = true;
    return opts;
  },
});