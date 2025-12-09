

const newsService = require('../services/news.service');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');

// normalize categories: accepts array or comma-separated string
function normalizeCategories(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(s => String(s).trim()).filter(Boolean);
  return String(raw).split(',').map(s => s.trim()).filter(Boolean);
}

// delete local files helper
function deleteLocalFiles(paths = []) {
  for (const p of paths) {
    if (!p) continue;
    if (p.startsWith('/uploads/') || p.startsWith('uploads/')) {
      const local = path.join(process.cwd(), p.replace(/^\//, ''));
      if (fs.existsSync(local)) {
        try { fs.unlinkSync(local); } catch (e) { /* ignore */ }
      }
    }
  }
}

async function createNews(req, res, next) {
  try {
    const { title, content } = req.body;
    const categories = normalizeCategories(req.body.categories);

    // collect images from multer (multipart/form-data) or from JSON (images field)
    let images = [];
    if (req.files && req.files.length) {
      images = req.files.map(f => `/uploads/${f.filename}`);
    } else if (req.body.images) {
      // if images is a JSON array or comma string
      if (Array.isArray(req.body.images)) images = req.body.images;
      else images = String(req.body.images).split(',').map(s => s.trim()).filter(Boolean);
    }

    const payload = {
      title,
      slug: slugify(title || '', { lower: true, strict: true }),
      content,
      images,
      categories
    };
    if (req.user && req.user.id) payload.createdBy = req.user.id;

    const news = await newsService.createNews(payload);
    res.status(201).json(news);
  } catch (err) {
    next(err);
  }
}

async function listNews(req, res, next) {
  try {
    const { q, category, page, limit, sort } = req.query;
    const result = await newsService.getNews({ q, category, page, limit, sort });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getNews(req, res, next) {
  try {
    const doc = await newsService.getNewsById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'News not found' });
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

async function updateNews(req, res, next) {
  try {
    const existing = await newsService.getNewsById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'News not found' });

    const data = {};
    if (req.body.title) {
      data.title = req.body.title;
      data.slug = slugify(req.body.title, { lower: true, strict: true });
    }
    if (req.body.content) data.content = req.body.content;
    if (req.body.categories !== undefined) data.categories = normalizeCategories(req.body.categories);

    // handle images
    const newImages = [];
    if (req.files && req.files.length) {
      newImages.push(...req.files.map(f => `/uploads/${f.filename}`));
    }

    // if JSON images sent, handle them only if provided
    if (req.body.images) {
      const jsonImgs = Array.isArray(req.body.images) ? req.body.images : String(req.body.images).split(',').map(s=>s.trim()).filter(Boolean);
      newImages.push(...jsonImgs);
    }

    // Replace behaviour: if query replaceImages=true -> delete old local images and set images to newImages
    if (req.query.replaceImages === 'true') {
      // delete local old images
      deleteLocalFiles(existing.images || []);
      data.images = newImages;
    } else if (newImages.length) {
      // append
      data.images = (existing.images || []).concat(newImages);
    }

    const updated = await newsService.updateNews(req.params.id, data);
    res.json({ message: 'News updated', news: updated });
  } catch (err) {
    next(err);
  }
}

async function removeNews(req, res, next) {
  try {
    const existing = await newsService.getNewsById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'News not found' });

    // delete local images
    deleteLocalFiles(existing.images || []);

    await newsService.deleteNews(req.params.id);
    res.json({ message: 'News deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createNews,
  listNews,
  getNews,
  updateNews,
  removeNews
};
