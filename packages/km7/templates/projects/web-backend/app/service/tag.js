const Base = require('./base');
const { ObjectId } = require('../utils/index');

class Service extends Base {
  constructor(ctx) {
    super(ctx);
    this.project = '';
    this.populate = [{ path: 'category', select: 'name icon' }];
    this.modelName = 'Tag';
    this.Model = this.ctx.model.Tag;
  }
  async getTagsByCategory(categoryId) {
    return super.findAll({ category: ObjectId(categoryId) });
  }
  // async create(obj={}){
  //   obj.category = ObjectId(obj.category);
  //   return super.create(obj)
  // }
}

module.exports = Service;
