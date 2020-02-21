/** @type Egg.EggPlugin */
module.exports = {
  // 指定渲染模板引擎为nunjucks , you also use multiple view engine
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  // egg-view-assets 提供了通用的静态资源管理和本地开发方案
  assets: {
    enable: true,
    package: 'egg-view-assets',
  },

  // 路由扩展 https://github.com/eggjs/egg-router-plus
  routerPlus: {
    enable: true,
    package: 'egg-router-plus',
  },

  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },

  cors: {
    enable: process.env.NODE_ENV === 'development' ? true : false,
    package: 'egg-cors',
  },
};
