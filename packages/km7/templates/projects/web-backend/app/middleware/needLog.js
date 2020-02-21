/**
 * 中间件：添加请求日志记录
 * */
module.exports = () => {
  return async (ctx, next) => {
    let user = ctx.session.user || {};
    try {
      ctx.logger.info(
        `***request body***: ${JSON.stringify(
          ctx.request.body,
        )} ***request query***:  ${JSON.stringify(ctx.request.query)} ***user_id***: ${
          user._id
        } ***user_account***: ${user.email} ***ua***: ${ctx.get('user-agent') || ''} \n`,
      );
    } catch (e) {
      ctx.logger.error(
        `***request body***: ${JSON.stringify(
          ctx.request.body,
        )} ***request query***:  ${JSON.stringify(ctx.request.query)} ***user_id***: ${
          user._id
        } ***user_account***: ${user.email} ***ua***: ${ctx.get('user-agent') || ''} \n`,
      );
      ctx.logger.error('middleware(needLog.js): egg log error', e);
    }

    await next();
  };
};
