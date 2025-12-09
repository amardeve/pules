

const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, crypto.randomBytes(8).toString('hex') + '-' + Date.now() + ext);
  }
});

function fileFilter(req, file, cb) {
  const allowed = ['image/jpeg','image/png','image/jpg','image/gif','image/webp','image/svg+xml'];
  console.log('UPLOAD:', file.fieldname, file.mimetype, file.originalname);
  if (!allowed.includes(file.mimetype)) return cb(new Error('Only images are allowed'), false);
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;


