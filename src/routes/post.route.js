const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { postSchema } = require('../validators/post.validator');

// All post routes are protected
router.use(auth);

router.post('/', validate(postSchema), postController.createPost);
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);
router.put('/:id', validate(postSchema), postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;
