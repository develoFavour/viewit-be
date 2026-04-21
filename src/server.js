import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Routes
import authRoutes from './modules/auth/auth.routes.js';
import productRoutes from './modules/products/product.routes.js';
import storeRoutes from './modules/store/store.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import uploadRoutes from './modules/upload/upload.routes.js';
import hotspotRoutes from './modules/products/hotspot.routes.js';
import buyerRoutes from './modules/auth/buyer.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';

import { errorResponse } from './utils/response.js';
import { STATUS_CODES } from './constants/constants.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Basic Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'ViewIt API is running' });
});

// Route mounting
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/hotspots', hotspotRoutes);
app.use('/api/buyer', buyerRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || STATUS_CODES.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';
  errorResponse(res, status, message, err);
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
