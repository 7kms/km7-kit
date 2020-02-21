const Service = require('egg').Service;
const { ObjectId } = require('../utils/index');

class Entity extends Service {
  // 获取当前model
  getCurrentModel() {
    return this.ctx.model[this.modelName];
  }

  // insert文档
  async create(obj) {
    let Model = this.getCurrentModel();
    let instance = new Model(obj);
    const res = await instance.save();
    return await this.findOne({ _id: res._id });
  }

  // 删除文档
  async remove(id) {
    return await this.getCurrentModel().remove({ _id: id });
  }
  async update(query = {}, obj = {}) {
    return await this.getCurrentModel().updateOne(query, obj);
  }

  // 获取文档详情
  async detail(id, project) {
    project = project || this.project;
    if (typeof id !== 'object') {
      id = ObjectId(id);
    }
    return await this.getCurrentModel()
      .findById(id, project)
      .populate(this.populate);
  }

  // 获取文档列表
  async list(queryObj) {
    const { query = {}, sort = { _id: -1 }, page = 0, count = 20 } = queryObj;
    const total = await this.getCurrentModel().count(query);
    const list = await this.getCurrentModel()
      .find(query, this.project, {
        skip: Number(page) * Number(count),
        sort,
        limit: Number(count),
      })
      .populate(this.populate);
    return { total, list };
  }

  async findAll(queryObj) {
    const { query = {}, sort = {} } = queryObj;
    const total = await this.getCurrentModel().count(query);
    const list = await this.getCurrentModel()
      .find(query, this.project, {
        sort,
      })
      .populate(this.populate);
    return { total, list };
  }
  async findOne(query = {}) {
    return await this.getCurrentModel()
      .findOne(query, this.project)
      .populate(this.populate);
  }
  async count(query = {}) {
    return await this.getCurrentModel().count(query);
  }
}

module.exports = Entity;
