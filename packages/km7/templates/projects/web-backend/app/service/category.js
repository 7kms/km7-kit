const Base = require('./base');
const { ObjectId } = require('../utils/index');

class Service extends Base {
  constructor(ctx) {
    super(ctx);
    this.project = '';
    this.populate = '';
    this.modelName = 'Category';
    this.Model = this.ctx.model.Category;
  }
  async remove(id) {
    const count = await this.service.tag.count({ categoryId: ObjectId(id) });
    if (count > 0) {
      return {
        ok: false,
        msg: `删除失败, 该categoy下还有${count}个tag`,
      };
    } else {
      return await this.getCurrentModel().remove({ _id: id });
    }
  }
}

module.exports = Service;
