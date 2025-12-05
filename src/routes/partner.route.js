const express = require('express');
const router = express.Router();
const controller = require('../controllers/partner.controller');
const validate = require('../middlewares/validate');
const { partnerSchema } = require('../validators/partner.validator');
const auth = require('../middlewares/auth'); // your JWT middleware
const upload = require('../middlewares/upload');

// Public read routes
router.get('/', controller.getPartners);
router.get('/:id', controller.getPartner);

// Protected create/update/delete
// create: accept multipart/form-data with "image" file OR JSON with image URL
router.post('/', auth, upload.single('image'), validate(partnerSchema), controller.createPartner);

// update: allow new image file or image URL
router.put('/:id', auth, upload.single('image'), validate(partnerSchema), controller.updatePartner);

router.delete('/:id', auth, controller.deletePartner);

module.exports = router;
