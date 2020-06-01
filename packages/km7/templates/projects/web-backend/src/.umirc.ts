import { resolve } from 'path';
import { defineConfig } from 'umi';
import webpack from 'webpack';
const { name: pkgName } = require(resolve(__dirname, '../package.json'));

// ref: https://umijs.org/config/

export default defineConfig({
  define: {
    'process.env.UMI_ENV': process.env.UMI_ENV,
  },
  // base: pkgName,
  mountElementId: pkgName,
  antd: {
    dark: false,
    compact: false,
  },
  dva: {
    immer: false,
    hmr: true,
  },
  ignoreMomentLocale: true,
  // webpack 相关的配置
  outputPath: '../app/public/src'
})
