import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  role: { type: String, default: 'Toastmasters Leader' },
  division: { type: String, default: 'Div A / Area 01' },
  district: { type: String, default: 'District 227' },
  area: { type: String, default: 'Area 12' },
  club: { type: String, default: 'Toastmasters Leadership Club' },
  memberId: { type: String, default: 'TM-227-09412' },
  phone: { type: String, default: '+1 (555) 227-8627' },
  bio: { type: String, default: 'Dedicated Toastmasters leader focused on club growth and excellence.' },
  
  // Custom Avatar & Photo / Emoji Fields
  avatarType: { type: String, enum: ['photo', 'emoji', 'initial'], default: 'initial' },
  avatarPhoto: { type: String, default: null }, // Base64 or Image URL
  avatarEmoji: { type: String, default: '🏆' },

  twoFactorEnabled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
