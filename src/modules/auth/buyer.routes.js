import express from 'express';
import { registerBuyer, loginBuyer, toggleFavorite, getFavorites } from './buyer.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerBuyer);
router.post('/login', loginBuyer);

// Protected routes
router.post('/favorites/toggle', authMiddleware, toggleFavorite);
router.get('/favorites', authMiddleware, getFavorites);

export default router;
