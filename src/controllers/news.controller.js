
// src/controllers/news.controller.js
const newsService = require('../services/news.service');
const slugify = require('slugify');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// helper to upload buffer to Cloudinary (folder optional)
function uploadBufferToCloudinary(buffer, folder = 'pulse/news') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result); // result.secure_url, result.public_id, ...
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

function normalizeCategories(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(s => String(s).trim()).filter(Boolean);
  return String(raw).split(',').map(s => s.trim()).filter(Boolean);
}

async function createNews(req, res, next) {
  try {
    const { title, content } = req.body;
    const categories = normalizeCategories(req.body.categories);

    const images = [];
    const imagesPublicIds = [];

    // upload files in req.files (memory multer)
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const result = await uploadBufferToCloudinary(file.buffer, 'pulse/news');
        images.push(result.secure_url || result.url);
        imagesPublicIds.push(result.public_id);
      }
    } else if (req.body.images) {
      const arr = Array.isArray(req.body.images) ? req.body.images : String(req.body.images).split(',').map(s=>s.trim()).filter(Boolean);
      images.push(...arr);
    }

    const payload = {
      title,
      slug: slugify(title || '', { lower: true, strict: true }),
      content,
      images,
      imagesPublicIds,
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

    const newImages = [];
    const newPublicIds = [];

    if (req.files && req.files.length) {
      for (const file of req.files) {
        const result = await uploadBufferToCloudinary(file.buffer, 'pulse/news');
        newImages.push(result.secure_url || result.url);
        newPublicIds.push(result.public_id);
      }
    }

    if (req.body.images) {
      const arr = Array.isArray(req.body.images) ? req.body.images : String(req.body.images).split(',').map(s=>s.trim()).filter(Boolean);
      newImages.push(...arr);
    }

    if (req.query.replaceImages === 'true') {
      // delete old cloudinary images if public ids exist
      if (existing.imagesPublicIds && existing.imagesPublicIds.length) {
        for (const pid of existing.imagesPublicIds) {
          try { await cloudinary.uploader.destroy(pid, { invalidate: true }); } catch(e) { /* ignore */ }
        }
      }
      data.images = newImages;
      data.imagesPublicIds = newPublicIds;
    } else {
      if (newImages.length) data.images = (existing.images || []).concat(newImages);
      if (newPublicIds.length) data.imagesPublicIds = (existing.imagesPublicIds || []).concat(newPublicIds);
    }

    // if client provided images JSON and replaceImages=true (and no files), also handle deletion
    if (req.body.images && req.query.replaceImages === 'true' && (!req.files || !req.files.length)) {
      if (existing.imagesPublicIds && existing.imagesPublicIds.length) {
        for (const pid of existing.imagesPublicIds) {
          try { await cloudinary.uploader.destroy(pid, { invalidate: true }); } catch(e) { /* ignore */ }
        }
      }
      data.images = Array.isArray(req.body.images) ? req.body.images : String(req.body.images).split(',').map(s=>s.trim()).filter(Boolean);
      data.imagesPublicIds = [];
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

    if (existing.imagesPublicIds && existing.imagesPublicIds.length) {
      for (const pid of existing.imagesPublicIds) {
        try { await cloudinary.uploader.destroy(pid, { invalidate: true }); } catch(e) { /* ignore */ }
      }
    }

    await newsService.deleteNews(req.params.id);
    res.json({ message: 'News deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { createNews, listNews, getNews, updateNews, removeNews };
