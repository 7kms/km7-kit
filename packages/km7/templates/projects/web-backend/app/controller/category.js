const Controller = require('egg').Controller;

class CategoryController extends Controller {
  constructor(props) {
    super(props);
    this.service = this.ctx.service.category;
  }
  async list(ctx) {
    try {
      const res = await this.service.list(ctx.request.query);
      ctx.respondData(200, res);
    } catch (e) {
      this.app.logger.error(`error--CategoryController : list`, e);
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
  async detail(ctx) {
    try {
      const res = await this.service.detail(ctx.params.id);
      ctx.respondData(200, res);
    } catch (e) {
      this.app.logger.error(`error--CategoryController : detail`, e);
      ctx.respondData(500, e);
    }
  }
  async remove(ctx) {
    try {
      const res = await this.service.remove(ctx.params.id);
      ctx.respondData(200, res);
    } catch (e) {
      this.app.logger.error(`error--CategoryController : remove`, e);
      ctx.respondData(500, e);
    }
  }
  async update(ctx) {
    try {
      const res = await this.service.update({ _id: ctx.params.id }, ctx.request.body);
      ctx.respondData(200, res);
    } catch (e) {
      this.app.logger.error(`error--CategoryController : detail`, e);
      ctx.respondData(500, e);
    }
  }
}

module.exports = CategoryController;
