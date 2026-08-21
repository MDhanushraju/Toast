import mongoose from 'mongoose';

const bookletSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  districtName: { type: String, default: 'District 227' },
  createdBy: { type: String, default: 'admin' },
  status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
  completedPercent: { type: Number, default: 0 },
  page3: { type: Object, default: {} }, // Segment 1: Before Meeting
  page4: { type: Object, default: {} }, // Physical Room & Tech Setup
  page5: { type: Object, default: {} }, // Segment 2: During Meeting
  page6: { type: Object, default: {} }, // Meeting Outcome Report
  page7: { type: Object, default: {} }, // Segment 3: After Meeting Tracker
  page8: { type: Object, default: {} }, // Data Summary Sheet
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Booklet = mongoose.models.Booklet || mongoose.model('Booklet', bookletSchema);
