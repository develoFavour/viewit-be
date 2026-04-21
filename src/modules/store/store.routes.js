import { Router } from 'express';
import * as storeController from './store.controller.js';

const router = Router();

router.get('/marketplace/all', storeController.getMarketplace);
router.get('/:slug', storeController.getStore);
router.get('/:slug/products/:productId', storeController.getProduct);
router.post('/track/view', storeController.viewProduct);
router.post('/track/ar-view', storeController.arViewProduct);

export default router;
