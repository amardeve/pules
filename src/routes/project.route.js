const express = require('express');
const router = express.Router();

const controller = require('../controllers/project.controller');
const auth = require('../middlewares/auth');
const authorizeRole = require('../middlewares/role.middleware'); // authorizeRole(['admin'])
const validate = require('../middlewares/validate');
const upload = require('../middlewares/upload');
const { createProjectSchema, updateProjectSchema } = require('../validators/project.validator');

// Public: list & view
router.get('/', controller.listProjects);
router.get('/:id', controller.getProject);

// Admin-only create/update/delete:
// create: accept multipart/form-data with images[] files OR application/json with image URLs in images[] array
router.post(
  '/',
  auth,
  authorizeRole(['admin']),
  upload.array('images', 5),
  validate(createProjectSchema),
  controller.createProject
);

// update: allow adding images (images[]), or replace if ?replaceImages=true
router.put(
  '/:id',
  auth,
  authorizeRole(['admin']),
  upload.array('images', 5),
  validate(updateProjectSchema),
  controller.updateProject
);

router.delete('/:id', auth, authorizeRole(['admin']), controller.removeProject);

module.exports = router;
