


const express = require('express');
const router = express.Router();

const upload = require('../middlewares/upload'); // your multer config (upload.array etc)
const auth = require('../middlewares/auth');     // must export function auth + auth.authorize(role)
const validate = require('../middlewares/validate'); // your Joi wrapper middleware
const { createNewsSchema, updateNewsSchema } = require('../validators/news.validator');

const controller = require('../controllers/news.controller');

// Public
// list: supports ?q=searchText&category=cat&page=1&limit=20&sort=-createdAt
router.get('/', controller.listNews);
router.get('/:id', controller.getNews);

// Admin-protected create / update / delete
// Use upload.array('images', 10) to accept multiple files under key "images"
router.post(
  '/',
  auth,
  auth.authorize('admin'),
  upload.array('images', 10),
  validate(createNewsSchema),
  controller.createNews
);

router.put(
  '/:id',
  auth,
  auth.authorize('admin'),
  upload.array('images', 10),
  validate(updateNewsSchema),
  controller.updateNews
);

router.delete('/:id', auth, auth.authorize('admin'), controller.removeNews);

module.exports = router;
