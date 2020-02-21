const Base = require('./base');

class AdminService extends Base {
  constructor(ctx) {
    super(ctx);
    this.project = '-hashed_password -salt';
    this.populate = '';
    this.modelName = 'Admin';
    this.Model = this.ctx.model.Admin;
  }

  // 创建用户
  async create(obj) {
    return await super.create(obj);
  }

  async getUserById(id, project) {
    project = project || { name: 1, account: 1, brief: 1 };
    return await this.Model.findById(id, project).populate(this.populate);
  }

  async detail(id) {
    // return await super.detail(id,populate)
    return await this.Model.findById(id, this.project).populate(this.populate);
  }

  // 设置用户信息
  async update(query, obj) {
    return await this.Model.updateOne(query, obj);
  }

  // get all user list
  async list(payload) {
    return await super.list(payload);
  }

  async getProfile() {
    return this.ctx.session.user;
  }

  async login({ email, password }) {
    let user = await this.Model.findOne({ email });
    const respond = async obj => {
      const finalUser = await super.detail(obj._id);
      this.ctx.session.user = finalUser;
      return {
        ok: true,
        data: finalUser,
      };
    };
    if (!user || !user.active) {
      let number = await this.count();
      if (!number) {
        let user = await this.create({ email, password, isMaster: true, name: 'master' });
        return await respond(user);
      }
      return {
        ok: false,
        msg: '用户不存在',
        data: null,
      };
    } else if (!user.authenticate(password)) {
      return {
        ok: false,
        msg: 'acount or password is  incorrect',
        data: null,
      };
    } else {
      return await respond(user);
    }
  }

  async updatePwd(id, password) {
    let user = await this.detail(id);
    if (user) {
      user.password = password;
      return await user.save();
    }
  }

  async getActiveUser() {
    return await super.findAll({ query: { active: true } });
  }

  async logout() {
    this.ctx.session = null;
    return {
      ok: true,
    };
  }
}

module.exports = AdminService;
