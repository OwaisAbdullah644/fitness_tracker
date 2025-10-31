// server/models/register.js (Update existing schema if needed; already has name, email, image)
const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  image: { type: String, default: '' },
  preferences: {
    notifications: { type: Boolean, default: true },
    units: { type: String, default: 'metric' },
    theme: { type: String, default: 'dark' },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('register', registerSchema);