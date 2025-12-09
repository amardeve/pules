const Project = require('../models/project.model');

async function createProject(data) {
  return Project.create(data);
}

async function getProjects({ q, category, page = 1, limit = 20, sort = '-createdAt' } = {}) {
  const filter = {};
  if (q) {
    // prefer text index then fallback to regex
    filter.$text = { $search: q };
  }
  if (category) {
    filter.categories = category;
  }

  const p = Math.max(1, Number(page) || 1);
  const l = Math.max(1, Math.min(100, Number(limit) || 20));
  const skip = (p - 1) * l;

  const query = Project.find(filter).sort(sort).skip(skip).limit(l);
  // if using text search, add score sort if q present
  if (q) {
    query.select({ score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });
  }

  const [items, total] = await Promise.all([
    query.lean().exec(),
    Project.countDocuments(filter).exec()
  ]);

  return { items, total, page: p, limit: l };
}

async function getProjectById(id) {
  return Project.findById(id).lean().exec();
}

async function updateProject(id, data) {
  return Project.findByIdAndUpdate(id, data, { new: true }).lean().exec();
}

async function deleteProject(id) {
  return Project.findByIdAndDelete(id).lean().exec();
}

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
};
