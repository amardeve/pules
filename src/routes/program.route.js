

// src/routes/program.route.js
const express = require('express');
const router = express.Router();

const controller = require('../controllers/program.controller');
const auth = require('../middlewares/auth'); // must export a middleware function
const authorizeRole = require('../middlewares/role.middleware'); // ensure file exists
const validate = require('../middlewares/validate');
const { createProgramSchema, updateProgramSchema } = require('../validators/program.validation');

// Public: list & view
router.get('/', controller.getPrograms);
router.get('/:id', controller.getProgram);

// Admin-only: create / update / delete
router.post('/', auth, authorizeRole(['admin']), validate(createProgramSchema), controller.createProgram);
router.put('/:id', auth, authorizeRole(['admin']), validate(updateProgramSchema), controller.updateProgram);
router.delete('/:id', auth, authorizeRole(['admin']), controller.deleteProgram);

module.exports = router;
