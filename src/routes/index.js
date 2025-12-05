

const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.route'));
router.use('/posts', require('./post.route'));
router.use('/partners', require('./partner.route')); // <-- add this
router.use('/contact', require('./contact.route'));



module.exports = router;
