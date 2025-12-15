export default class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(options = {}) {
    return await this.model.findAll(options);
  }

  async findById(id, options = {}) {
    return await this.model.findByPk(id, options);
  }

  async findOne(options = {}) {
    return await this.model.findOne(options);
  }

  async create(data) {
    return await this.model.create(data);
  }

  async update(id, data) {
    const record = await this.findById(id);
    if (!record) {
      throw new Error('Record not found');
    }
    return await record.update(data);
  }

  async delete(id) {
    const record = await this.findById(id);
    if (!record) {
      throw new Error('Record not found');
    }
    return await record.destroy();
  }

  async count(options = {}) {
    return await this.model.count(options);
  }
}