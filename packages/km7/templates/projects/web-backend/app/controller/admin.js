const Controller = require('egg').Controller;

class AdminController extends Controller {
  constructor(props) {
    super(props);
    this.service = this.ctx.service.admin;
  }
  async list(ctx) {
    try {
      const res = this.service.list(ctx.request.query);
      ctx.respondData(200, res);
    } catch (e) {
      this.app.logger.error(`error--AdminController : list`, e);
      ctx.respondData(500, e);
    }
  }
  async searchList(ctx) {
    try {
      const res = this.service.searchList(ctx.request.query);
      ctx.respondData(200, res);
    } catch (e) {
      this.app.logger.error(`error--AdminController : searchList`, e);
      ctx.respondData(500, e);
    }
  }
  async detail(ctx) {
    try {
      const res = this.service.detail(ctx.params.id);
      ctx.respondData(200, res);
    } catch (e) {
      this.app.logger.error(`error--AdminController : detail`, e);
      ctx.respondData(500, e);
    }
  }
  async remove(ctx) {
    try {
      const res = this.service.update({ _id: ctx.params.id }, { active: false });
      ctx.respondData(200, res);
    } catch (e) {
      this.app.logger.error(`error--AdminController : remove`, e);
      ctx.respondData(500, e);
    }
  }
  async update(ctx) {
    try {
      const { isMaster, ...rest } = ctx.request.body;
      const res = this.service.update({ _id: ctx.params.id }, rest);
      ctx.respondData(200, res);
    } catch (e) {
      this.app.logger.error(`error--AdminController : update`, e);
      ctx.respondData(500, e);
    }
  }
  async insert(ctx) {
    try {
      const res = await this.service.create(ctx.request.body);
      ctx.respondData(200, res);
    } catch (e) {
      this.app.logger.error(`error--CategoryController : insert`, e);
      ctx.respondData(500, e);
    }
  }
  async getProfile(ctx) {
    try {
      const res = await this.service.getProfile();
      ctx.respondData(200, res);
    } catch (e) {
      this.app.logger.error(`error--AdminController : getProfile`, e);
      ctx.respondData(500, e);
    }
  }

  // 重置密码
  async resetPwd(ctx) {
    const opt = ctx.request.body;
    try {
      const res = await this.service.updatePwd(ctx._uid, opt.pwd);
      ctx.respondData(200, res);
    } catch (e) {
      ctx.respondData(500, e);
    }
  }

  async login(ctx) {
    try {
      const res = await this.service.login(ctx.request.body);
      ctx.respondData(200, res);
    } catch (e) {
      this.app.logger.error(`error--AdminController : login`, e);
      ctx.respondData(500, e);
    }
  }

  async logout(ctx) {
    try {
      const res = await this.service.logout();
      ctx.respondData(200, res);
    } catch (e) {
      this.app.logger.error(`error--AdminController : logout`, e);
      ctx.respondData(500, e);
    }
  }
}

module.exports = AdminController;
