'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const needLogin = app.middleware.needLogin();
  const needLog = app.middleware.needLog();

  const privateRouter = router.namespace('/api', needLogin, needLog);

  //upload
  privateRouter.post('/upload', controller.home.upload);

  // 处理index页面
  router.get('*', controller.home.index);
};
