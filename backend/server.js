import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import matchingRoutes from './routes/matchingRoutes.js';
import spocRoutes from './routes/spocRoutes.js';
import recruiterRoutes from './routes/recruiterRoutes.js';
import seedRoutes from './routes/seedRoutes.js';

// Load Environment Variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Global Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'KaushalSetu Skill Intelligence API (SIH26044)',
    timestamp: new Date().toISOString(),
    sponsor: 'Ministry of Ayush & All India Institute of Ayurveda (AIIA)'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/spoc', spocRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/seed', seedRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 [KaushalSetu Backend Running]: http://localhost:${PORT}`);
  console.log(`📡 [Health Check]: http://localhost:${PORT}/api/health`);
  console.log(`🌱 [Seed Status]: http://localhost:${PORT}/api/seed/status`);
});

export default app;
