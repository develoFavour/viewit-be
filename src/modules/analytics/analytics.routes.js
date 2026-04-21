import { Router } from 'express';
import * as analyticsController from './analytics.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/track', analyticsController.trackEvent);

router.use(authMiddleware);

router.get('/overview', analyticsController.getOverview);
router.get('/products', analyticsController.getProductsBreakdown);

export default router;
