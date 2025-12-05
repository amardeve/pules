const Partner = require('../models/partner.model');
const fs = require('fs');
const path = require('path');

async function createPartner(data) {
  const partner = await Partner.create(data);
  return partner;
}

async function getPartners() {
  return Partner.find().sort({ createdAt: -1 });
}

async function getPartnerById(id) {
  return Partner.findById(id);
}

async function updatePartner(id, data) {
  return Partner.findByIdAndUpdate(id, data, { new: true });
}

async function deletePartner(id) {
  const p = await Partner.findByIdAndDelete(id);
  return p;
}

// helper to delete a local file (if storing uploads locally)
function deleteFileIfLocal(filePath) {
  if (!filePath) return;
  // local files stored as e.g. /uploads/filename.jpg
  if (filePath.startsWith('/uploads/') || filePath.startsWith('uploads/')) {
    const localPath = path.join(process.cwd(), filePath.replace(/^\//, ''));
    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
  }
}

module.exports = {
  createPartner,
  getPartners,
  getPartnerById,
  updatePartner,
  deletePartner,
  deleteFileIfLocal
};
