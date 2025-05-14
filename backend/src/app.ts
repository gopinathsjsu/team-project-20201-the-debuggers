import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { authRouter } from './routes/auth';
import { errorHandler } from './middleware/errorHandler';

// Load environment variable
config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);

// Error handling
app.use(errorHandler);

export default app; 
