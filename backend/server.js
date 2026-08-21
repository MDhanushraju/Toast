import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import bookletRoutes from './routes/bookletRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import votingRoutes from './routes/votingRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/booklets', bookletRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/voting', votingRoutes);

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'District 227 Toastmasters SaaS REST Server',
    time: new Date().toISOString()
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found on server` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 District 227 Toastmasters Backend API Server Running!`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
