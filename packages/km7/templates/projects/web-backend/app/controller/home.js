const Controller = require('egg').Controller;
const fs = require('fs');

class HomeController extends Controller {
  async index() {
    await this.ctx.render('index.html');
  }
  async upload(ctx) {
    let tmpFile = ctx.request.files[0];
    console.log(ctx.request.files);
    try {
      const result = await this.ctx.service.upload.save(tmpFile.filepath);
      ctx.respondData(200, result);
    } catch (e) {
      this.app.logger.error('error--HomeController:upload', e);
      ctx.respondData(500, e);
    }
    fs.unlink(tmpFile.filepath, function() {});
  }
}

module.exports = HomeController;
