import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { getEnv } from './config/env';
import authRoutes from './routes/auth.routes';
import businessRoutes from './routes/business.routes';
import documentRoutes from './routes/document.routes';
import directorRoutes from './routes/director.routes';
import fundingRoutes from './routes/funding.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Load environment variables
dotenv.config();

const app = express();

// Request logging middleware
app.use((req: Request, _res: Response, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (for local storage)
const uploadPath = process.env.LOCAL_STORAGE_PATH || './uploads';
app.use('/uploads', express.static(path.resolve(uploadPath)));

// Health check route
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ 
    success: true, 
    data: { 
      status: 'ok', 
      timestamp: new Date().toISOString() 
    } 
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/businesses', businessRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/directors', directorRoutes);
app.use('/api/v1/funding-utilities', fundingRoutes);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Error handling middleware - must be last
app.use(errorHandler);

const PORT = parseInt(getEnv('PORT')) || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${getEnv('NODE_ENV')}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
