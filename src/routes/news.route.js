
// src/routes/news.route.js
const express = require('express');
const router = express.Router();

const upload = require('../middlewares/multerMemory'); // memory multer
const auth = require('../middlewares/auth');           // existing auth (CommonJS)
const validate = require('../middlewares/validate');
const { createNewsSchema, updateNewsSchema } = require('../validators/news.validator');
const controller = require('../controllers/news.controller');

// helper to wrap multer and return JSON errors if upload fails
function multerHandler(mw) {
  return (req, res, next) => {
    mw(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message || 'Upload error' });
      next();
    });
  };
}

// Public endpoints
router.get('/', controller.listNews);
router.get('/:id', controller.getNews);

// Admin endpoints
router.post(
  '/',
  auth,
  auth.authorize('admin'),
  multerHandler(upload.array('images', 10)),
  validate(createNewsSchema),
  controller.createNews
);

router.put(
  '/:id',
  auth,
  auth.authorize('admin'),
  multerHandler(upload.array('images', 10)),
  validate(updateNewsSchema),
  controller.updateNews
);

router.delete('/:id', auth, auth.authorize('admin'), controller.removeNews);

module.exports = router;
