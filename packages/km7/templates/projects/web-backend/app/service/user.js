const Service = require('egg').Service;
const axios = require('axios');

class userService extends Service {
  constructor(ctx) {
    super(ctx);
  }

  /**
   * @desc 根据用户的cookie信息获取用户信息,用户检测用户是否登录
   * */
  async getProfile() {
    let user = await axios({
      method: 'post',
      url: `${this.app.config.api.sso}/api/user/profile`,
      headers: {
        Cookie: this.ctx.req.headers.cookie || '',
      },
    });
    return user.data || null;
  }
}

module.exports = userService;
