import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  division: { type: String, required: true },
  area: { type: String, required: true },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  club: { type: String, default: '' }
});

export const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
