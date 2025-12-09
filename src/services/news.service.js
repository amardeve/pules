const News = require('../models/news.model');

async function createNews(data) {
  return News.create(data);
}

async function getNews({ q, category, page = 1, limit = 20, sort = '-createdAt' } = {}) {
  const filter = {};
  if (q) {
    // use text search
    filter.$text = { $search: q };
  }
  if (category) {
    filter.categories = category;
  }

  const p = Math.max(1, Number(page) || 1);
  const l = Math.max(1, Math.min(100, Number(limit) || 20));
  const skip = (p - 1) * l;

  const query = News.find(filter).sort(sort).skip(skip).limit(l);

  if (q) {
    query.select({ score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });
  }

  const [items, total] = await Promise.all([
    query.lean().exec(),
    News.countDocuments(filter).exec()
  ]);

  return { items, total, page: p, limit: l };
}

async function getNewsById(id) {
  return News.findById(id).lean().exec();
}

async function updateNews(id, data) {
  return News.findByIdAndUpdate(id, data, { new: true }).lean().exec();
}

async function deleteNews(id) {
  return News.findByIdAndDelete(id).lean().exec();
}

module.exports = {
  createNews,
  getNews,
  getNewsById,
  updateNews,
  deleteNews
};
