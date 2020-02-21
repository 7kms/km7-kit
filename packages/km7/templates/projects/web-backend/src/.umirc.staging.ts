import { IConfig } from 'umi-types';
import { resolve } from 'path';
const { name: pkgName } = require(resolve('package.json'));

// ref: https://umijs.org/config/
const config: IConfig = {
  publicPath: '/public/src',
  manifest: {
    fileName: resolve(process.cwd(), './config/manifest.json'),
  },
  hash: true,
  plugins: [
    [
      'umi-plugin-react',
      {
        dva: {
          immer: false,
          hmr: true,
        },
        antd: true,
        dynamicImport: { webpackChunkName: true },
        title: '{{name}}',
        dll: false,
        routes: {
          exclude: [
            /model(s?)\.(j|t)sx?$/,
            /service(s?)\.(j|t)sx?$/,
            /models\//,
            /components\//,
            /services\//,
            /utils\//,
            /chart\/Container\.js$/,
          ],
        },
      },
    ],
  ],
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
};

export default config;
