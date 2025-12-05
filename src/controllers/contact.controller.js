const contactService = require('../services/contact.service');

async function createContact(req, res, next) {
  try {
    const payload = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      message: req.body.message
    };
    // if logged in, attach createdBy (optional)
    if (req.user && req.user.id) payload.createdBy = req.user.id;

    const contact = await contactService.createContact(payload);
    return res.status(201).json({ message: 'Message received', contact });
  } catch (err) {
    next(err);
  }
}

async function listContacts(req, res, next) {
  try {
    const { page, limit } = req.query;
    const result = await contactService.getContacts({ page, limit });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getContact(req, res, next) {
  try {
    const contact = await contactService.getContactById(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json(contact);
  } catch (err) {
    next(err);
  }
}

async function updateContact(req, res, next) {
  try {
    const updated = await contactService.updateContact(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Contact not found' });
    res.json({ message: 'Contact updated', contact: updated });
  } catch (err) {
    next(err);
  }
}

async function removeContact(req, res, next) {
  try {
    const deleted = await contactService.deleteContact(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Contact not found' });
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createContact,
  listContacts,
  getContact,
  updateContact,
  removeContact
};
