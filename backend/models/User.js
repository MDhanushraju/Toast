import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  role: { type: String, default: 'Toastmasters Leader' },
  division: { type: String, default: 'Div A / Area 01' },
  district: { type: String, default: 'District 227' },
  twoFactorEnabled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
