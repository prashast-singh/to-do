import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import logger from './config/logger';
import env from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import todoRoutes from './modules/todos/todo.routes';

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(pinoHttp({ logger }));

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Todo Service is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/v1/todos', todoRoutes);

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      code: 'ROUTE_NOT_FOUND',
    },
  });
});

// Error handling middleware
app.use(errorHandler);

export default app; 