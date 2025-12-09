const Program = require("../models/program.model");

module.exports = {
  async create(data) {
    return await Program.create(data);
  },

  async getAll() {
    return await Program.find();
  },

  async getById(id) {
    return await Program.findById(id);
  },

  async update(id, data) {
    return await Program.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id) {
    return await Program.findByIdAndDelete(id);
  }
};
