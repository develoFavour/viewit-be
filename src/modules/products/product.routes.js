import { Router } from 'express';
import * as productController from './product.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware); // Protect all product routes

router.get('/', productController.getAll);
router.post('/', productController.create);
router.get('/:id', productController.getOne);
router.put('/:id', productController.update);
router.delete('/:id', productController.remove);
router.patch('/:id/publish', productController.togglePublish);

export default router;
