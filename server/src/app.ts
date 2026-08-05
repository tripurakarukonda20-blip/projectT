import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config();

const app = express();

// Security Headers
app.use(helmet());

// CORS Configuration
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Middleware
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', routes);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Safe Error Handler (Never expose raw stack traces or internal secrets)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Global Error Handler]:', err.message);
  res.status(500).json({
    error: 'An unexpected server error occurred. Please try again.',
  });
});

export default app;
