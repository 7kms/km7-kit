import { IConfig } from 'umi-types';
import { resolve } from 'path';
const { name: pkgName } = require(resolve('package.json'));

// ref: https://umijs.org/config/
const config: IConfig = {
  define: {
    'process.env.UMI_ENV': process.env.UMI_ENV,
  },
  // base: pkgName,
  mountElementId: pkgName,
  plugins: [
    [
      'umi-plugin-react',
      {
        dva: {
          immer: false,
          hmr: true,
        },
        antd: true,
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
  ignoreMomentLocale: true,
  // webpack 相关的配置
  outputPath: '../app/public/src',
  publicPath: 'http://127.0.0.1:{{}}/',
  theme: {
    'card-actions-background': '#f5f8fa',
  },
};

export default config;
