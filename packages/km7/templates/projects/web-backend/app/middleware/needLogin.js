/**
 * 中间件：用户必须登录
 * */
module.exports = () => {
  return async (ctx, next) => {
    ctx.logger.info('api request data: %j', ctx.request.body);
    //    console.log(ctx.session.user)
    if (ctx.session.user && ctx.session.user.active) {
      ctx._uid = String(ctx.session.user._id);
      ctx.session.user = Object.assign({}, ctx.session.user);
      await next();
    } else {
      ctx.respondData(401, 'session expired, please relogin');
    }
  };
};
