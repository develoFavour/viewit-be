import express from 'express';
import { generateHotspotContent, analyzeProductImage } from '../../utils/ai.js';
import { successResponse, errorResponse } from '../../utils/response.js';
import { STATUS_CODES } from '../../constants/constants.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Generate content for a 3D hotspot
router.post('/hotspot-generate', authMiddleware, async (req, res) => {
  try {
    const { label, context } = req.body;
    const content = await generateHotspotContent(label, context);
    return successResponse(res, STATUS_CODES.OK, "AI Content Generated", { content });
  } catch (error) {
    return errorResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, error.message);
  }
});

// Analyze image for auto-filling product forms
router.post('/describe-image', authMiddleware, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) return errorResponse(res, STATUS_CODES.BAD_REQUEST, "Image URL required");
    
    const analysis = await analyzeProductImage(imageUrl);
    return successResponse(res, STATUS_CODES.OK, "Image Analyzed", analysis);
  } catch (error) {
    return errorResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, error.message);
  }
});

export default router;
