import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { globalErrorHandler } from './middleware/errorHandler.js';
import routes from './index.router.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling
app.use(globalErrorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app; 