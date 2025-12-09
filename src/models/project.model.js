const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: true },
  content: { type: String, required: true },
  images: [{ type: String }], // store served path: /uploads/filename.jpg or remote url
  categories: [{ type: String, index: true }], // simple string categories
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }
}, { timestamps: true });

// optional text index for better search (MongoDB text search)
ProjectSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Project', ProjectSchema);
