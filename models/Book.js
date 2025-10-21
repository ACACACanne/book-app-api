const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, default: 'Unknown' },
  publishedYear: { type: Number },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  read: { type: Boolean, default: false },
  coverImageUrl: { type: String, default: '' },
  purchaseLink: { type: String, default: '' },
  readOnlineLink: { type: String, default: '' },
  summary: { type: String, default: '' }, // 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  public: { type: Boolean, default: false },
  approved: { type: Boolean, default: false }
});

module.exports = mongoose.model('Book', bookSchema);

