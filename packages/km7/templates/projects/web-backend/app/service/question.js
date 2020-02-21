const Base = require('./base');

class Service extends Base {
  constructor(ctx) {
    super(ctx);
    this.project = '';
    this.populate = [
      { path: 'category', select: 'name icon' },
      { path: 'tags', select: 'name icon' },
      { path: 'admin', select: 'email' },
    ];
    this.modelName = 'Question';
    this.Model = this.ctx.model.Question;
  }
  create(obj = {}) {
    obj.admin = this.ctx._uid;
    return super.create(obj);
  }
}

module.exports = Service;
