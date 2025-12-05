const Contact = require('../models/contact.model');

async function createContact(data) {
  return Contact.create(data);
}

async function getContacts({ page = 1, limit = 20 } = {}) {
  const p = Math.max(1, Number(page) || 1);
  const l = Math.max(1, Math.min(100, Number(limit) || 20));
  const skip = (p - 1) * l;
  const [items, total] = await Promise.all([
    Contact.find().sort({ createdAt: -1 }).skip(skip).limit(l).lean().exec(),
    Contact.countDocuments().exec()
  ]);
  return { items, total, page: p, limit: l };
}

async function getContactById(id) {
  return Contact.findById(id).lean().exec();
}

async function updateContact(id, data) {
  return Contact.findByIdAndUpdate(id, data, { new: true }).lean().exec();
}

async function deleteContact(id) {
  return Contact.findByIdAndDelete(id).lean().exec();
}

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact
};
