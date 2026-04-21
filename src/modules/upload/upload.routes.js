import { Router } from 'express';
import upload from '../../config/cloudinary.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { successResponse } from '../../utils/response.js';
import { STATUS_CODES } from '../../constants/constants.js';

const router = Router();

router.use(authMiddleware);

router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  successResponse(res, STATUS_CODES.OK, 'Image uploaded', { url: req.file.path });
});

router.post('/model', upload.single('model'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  successResponse(res, STATUS_CODES.OK, 'Model uploaded', { url: req.file.path });
});

export default router;
