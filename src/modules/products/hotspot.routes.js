import express from 'express';
import { createHotspot, getHotspotsByProduct, deleteHotspot } from './hotspot.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:productId', getHotspotsByProduct);
router.post('/:productId', authMiddleware, createHotspot);
router.delete('/:id', authMiddleware, deleteHotspot);

export default router;
