const projectService = require('../services/project.service');
const fs = require('fs');
const path = require('path');

// helper to convert categories field (accept comma string or array)
function normalizeCategories(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(s => String(s).trim()).filter(Boolean);
  // comma-separated
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

async function createProject(req, res, next) {
  try {
    const { title, content } = req.body;
    const categories = normalizeCategories(req.body.categories);
    const images = [];
    if (req.files && req.files.length) {
      for (const f of req.files) images.push(`/uploads/${f.filename}`);
    }
    const payload = { title, content, categories, images };
    if (req.user && req.user.id) payload.createdBy = req.user.id;

    const project = await projectService.createProject(payload);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

async function listProjects(req, res, next) {
  try {
    const { q, category, page, limit, sort } = req.query;
    const result = await projectService.getProjects({ q, category, page, limit, sort });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getProject(req, res, next) {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    next(err);
  }
}

async function updateProject(req, res, next) {
  try {
    const data = { ...req.body };
    if (req.body.categories !== undefined) {
      data.categories = normalizeCategories(req.body.categories);
    }

    // if new files uploaded, append to images; support optional replace behavior:
    const newImages = [];
    if (req.files && req.files.length) {
      for (const f of req.files) newImages.push(`/uploads/${f.filename}`);
    }

    const existing = await projectService.getProjectById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Project not found' });

    // Example behavior: append new images to existing images unless client sends replaceImages=true
    if (newImages.length) {
      if (req.query.replaceImages === 'true') {
        // delete old local images
        deleteLocalFiles(existing.images || []);
        data.images = newImages;
      } else {
        data.images = (existing.images || []).concat(newImages);
      }
    }

    const updated = await projectService.updateProject(req.params.id, data);
    res.json({ message: 'Project updated', project: updated });
  } catch (err) {
    next(err);
  }
}

async function removeProject(req, res, next) {
  try {
    const existing = await projectService.getProjectById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Project not found' });

    // delete local image files
    deleteLocalFiles(existing.images || []);

    await projectService.deleteProject(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createProject,
  listProjects,
  getProject,
  updateProject,
  removeProject
};
