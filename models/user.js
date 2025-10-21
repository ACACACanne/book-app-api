const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  role: { type: String, enum: ['client', 'admin'], default: 'client' }, // 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  tokens: [{ token: String }]
});

module.exports = mongoose.model('User', userSchema);