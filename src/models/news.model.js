


const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, trim: true, index: true },
  content: { type: String, required: true },
  images: [{ type: String }],        // local path (/uploads/...) or remote URL
  categories: [{ type: String, index: true }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// text index for search (title + content)
NewsSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('News', NewsSchema);
