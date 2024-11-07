// lib/models.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export { User };
