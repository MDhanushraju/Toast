import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/district227_toastmasters', {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[DB] MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[DB] MongoDB Connection Warning: ${error.message}`);
    console.log(`[DB] Fallback: Express Server running with In-Memory / Local JSON storage mode.`);
  }
};
