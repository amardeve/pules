const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  // image stores either a URL or a local path (e.g. /uploads/filename.jpg)
  image: { type: String, required: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // optional
}, { timestamps: true });

module.exports = mongoose.model('Partner', PartnerSchema);
