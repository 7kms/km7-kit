/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo - { baseDir, root, env, ... }
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  return {
    logger: {
      dir: `/var/nodejs/logs/${appInfo.name}-${process.env.EGG_SERVER_ENV}`,
      level: 'DEBUG',
    },
    // 对于静态资源，prod环境下开启gzip，能减少60%的大小
    static: {
      gzip: true,
    },
    api: {

    },
    mongoose: {
      client: {
        url: 'mongodb://127.0.0.1:27017/{{name}}',
        options: { useNewUrlParser: true },
      },
    },
  };
};
