const express = require('express');
const router = express.Router();
const controller = require('../controllers/contact.controller');
const validate = require('../middlewares/validate');
const { createContactSchema, updateContactSchema } = require('../validators/contact.validator');
const auth = require('../middlewares/auth');

// safe authorize helper: use auth.authorize if present, otherwise fallback
const authorize = (typeof auth.authorize === 'function')
  ? auth.authorize
  : (role) => (req, res, next) => {
      if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
      if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden - insufficient role' });
      next();
    };

// Public: create a message
router.post('/', validate(createContactSchema), controller.createContact);

// Admin-only: list, get, update, delete
router.get('/', auth, authorize('admin'), controller.listContacts);
router.get('/:id', auth, authorize('admin'), controller.getContact);
router.put('/:id', auth, authorize('admin'), validate(updateContactSchema), controller.updateContact);
router.delete('/:id', auth, authorize('admin'), controller.removeContact);

module.exports = router;
