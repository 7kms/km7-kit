const Controller = require('egg').Controller;

class QuestionController extends Controller {
  constructor(props) {
    super(props);
    this.service = this.ctx.service.question;
  }
  async list(ctx) {
    try {
      const { page, count, ...rest } = ctx.request.query;
      const res = await this.service.list({ query: rest, page, count });
      ctx.respondData(200, res);
    } catch (e) {
      this.app.logger.error(`error--QuestionController : list`, e);
      ctx.respondData(500, e);
    }
  }
  async searchList(ctx) {
    try {
      const res = await this.service.searchList({ query: ctx.request.query });
      ctx.respondData(200, res);
    } catch (e) {
      this.app.logger.error(`error--QuestionController : searchList`, e);
      ctx.respondData(500, e);
    }
  }
  async detail(ctx) {
    try {
      const res = await this.service.detail(ctx.params.id);
      ctx.respondData(200, res);
    } catch (e) {
      this.app.logger.error(`error--QuestionController : detail`, e);
      ctx.respondData(500, e);
    }
  }
  async insert(ctx) {
    try {
      const res = await this.service.create(ctx.request.body);
      ctx.respondData(200, res);
    } catch (e) {
      this.app.logger.error(`error--QuestionController : insert`, e);
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

module.exports = QuestionController;
