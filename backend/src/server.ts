import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import expenseRoutes from './routes/expenses.js';
import invoiceRoutes from './routes/invoices.js';
import pageContentRoutes from './routes/page-content.js';
import showcaseProjectRoutes from './routes/showcase-projects.js';
import leadsRoutes from './routes/leads.js';
import dashboardRoutes from './routes/dashboard.js';
import downloadRoutes from './routes/download.js';
import uploadRoutes from './routes/upload.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security headers
app.use(helmet());

// CORS — restrict origins in production
// CORS_ORIGINS env var should include admin, website, and any public domains (comma-separated)
app.use(cors({
  origin: config.CORS_ORIGINS.split(',').map((o) => o.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-webhook-secret'],
}));

// Body parsing with size limit
app.use(express.json({ limit: '1mb' }));

// Rate limiting
const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { message: 'Too many requests, try again later' } });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { message: 'Too many login attempts, try again later' } });
const webhookLimiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 30, message: { message: 'Too many webhook requests' } });
const contactFormLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: { message: 'Too many submissions, please wait before trying again' } });

app.use('/api/auth', authLimiter);
app.use('/api/leads/webhook', webhookLimiter);
app.use('/api/leads/submit', contactFormLimiter);
app.use('/api', generalLimiter);

// Health check
app.get('/api/health', (_req, res) => {
  const mongoState = mongoose.connection.readyState;
  const healthy = mongoState === 1;
  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongo: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoState] || 'unknown',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/projects', projectRoutes);
app.use('/api/admin/expenses', expenseRoutes);
app.use('/api/admin/invoices', invoiceRoutes);
app.use('/api/page-content', pageContentRoutes);
app.use('/api/showcase-projects', showcaseProjectRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/admin', dashboardRoutes);
app.use('/api/admin/download', downloadRoutes);
app.use('/api/upload', uploadRoutes);

// Error handler (must be last middleware)
app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(config.PORT, () => {
    console.log(`Backend running on http://localhost:${config.PORT} [${config.NODE_ENV}]`);
  });
}

start();
