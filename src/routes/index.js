

const express = require('express');
const router = express.Router();


router.use('/auth', require('./auth.route'));
router.use('/posts', require('./post.route'));
router.use('/partners', require('./partner.route')); // <-- add this
router.use('/contact', require('./contact.route'));
router.use("/programs", require("./program.route"));
router.use('/projects', require('./project.route'));
// router.use('/newss', require('./news.route'));
router.use("/news", require("./news.route"));












module.exports = router;
