/* eslint valid-jsdoc: "off" */
/**
 * config.default.js 为默认的配置文件，所有环境都会加载这个配置文件
 * 一般也会作为开发环境的默认配置文件
 * */

const fs = require('fs');
const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo - { baseDir, root, env, ... }
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  config.APPID = '{{name}}';
  config.APPSECRET = '{{name}}-secret';

  config.proxy = true;

  // use for cookie sign key, should change to your own and keep security

  config.keys = appInfo.name + '_{{timestamp}}_5858';

  config.projectName = appInfo.name;

  // 配置渲染模板
  config.view = {
    mapping: {
      '.html': 'nunjucks',
    },
  };
  // 配置站点图标
  config.siteFile = {
      '/favicon.ico': fs.readFileSync(path.join(appInfo.baseDir, 'app/public/favicon.png')),
  };

  config.assets = {
    devServer: {
      debug: false,
      command: 'umi dev',
      port: Number('{{umiPort}}'),
      env: {
        APP_ROOT: process.cwd() + '/src',
        BROWSER: 'none',
        ESLINT: 'none',
        PORT: Number('{{umiPort}}'),
        SOCKET_SERVER: 'http://127.0.0.1:{{umiPort}}',
        PUBLIC_PATH: 'http://127.0.0.1:{{umiPort}}',
      },
    },
  };

  config.security = {
    csrf: false,
    xframe: false,
    domainWhiteList: ['localhost'],
  };

  config.cors = {
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  config.logger = {
    consoleLevel: 'DEBUG',
  };

  config.customLogger = {
    scheduleLogger: {
      consoleLevel: 'INFO',
    },
  };

  // https://eggjs.org/zh-cn/basics/controller.html#%E8%8E%B7%E5%8F%96%E4%B8%8A%E4%BC%A0%E7%9A%84%E6%96%87%E4%BB%B6
  config.multipart = {
    mode: 'file',
    fileSize: '20mb',
    fileExtensions: ['.csv', '.svga', '.mpeg', '.aac', '.wav', '.ogg'],
  };

  // https://github.com/eggjs/egg-mongoose#readme
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1:27017/{{name}}',
      options: { useNewUrlParser: true },
    },
  };

  config.static = {
    dir: [
      {
        prefix: '/public',
        dir: path.join(appInfo.baseDir, 'app/public'),
      },
      {
        prefix: '/upload',
        dir: path.join(appInfo.baseDir, 'upload'),
      },
    ],
  };

  const userConfig = {
    api: {},
  };
  return { ...config, ...userConfig };
};
