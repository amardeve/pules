const partnerService = require('../services/partner.service');

async function createPartner(req, res, next) {
  try {
    // multer file available at req.file
    // client may also send `image` in body (URL)
    const { name, content } = req.body;
    let image;
    if (req.file) {
      // store served path (leading slash makes it easy to use)
      image = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      image = req.body.image;
    }

    const payload = { name, content, image };
    if (req.user?.id) payload.createdBy = req.user.id;

    const partner = await partnerService.createPartner(payload);
    res.status(201).json(partner);
  } catch (err) {
    next(err);
  }
}

async function getPartners(req, res, next) {
  try {
    const partners = await partnerService.getPartners();
    res.json(partners);
  } catch (err) {
    next(err);
  }
}

async function getPartner(req, res, next) {
  try {
    const partner = await partnerService.getPartnerById(req.params.id);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });
    res.json(partner);
  } catch (err) {
    next(err);
  }
}

async function updatePartner(req, res, next) {
  try {
    const { name, content } = req.body;
    let image;
    if (req.file) image = `/uploads/${req.file.filename}`;
    else if (req.body.image) image = req.body.image;

    const existing = await partnerService.getPartnerById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Partner not found' });

    // optional: only allow author or admin to edit
    // if (req.user && existing.createdBy && existing.createdBy.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

    // if replacing local image, delete old file
    if (image && existing.image && existing.image.startsWith('/uploads/')) {
      partnerService.deleteFileIfLocal(existing.image);
    }

    const updated = await partnerService.updatePartner(req.params.id, { name, content, image });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deletePartner(req, res, next) {
  try {
    const existing = await partnerService.getPartnerById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Partner not found' });

    // optional: check ownership/admin here

    // remove local image if present
    if (existing.image && existing.image.startsWith('/uploads/')) {
      partnerService.deleteFileIfLocal(existing.image);
    }

    await partnerService.deletePartner(req.params.id);
    res.json({ message: 'Partner deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createPartner,
  getPartners,
  getPartner,
  updatePartner,
  deletePartner
};
