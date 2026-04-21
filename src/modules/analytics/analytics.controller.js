import * as analyticsService from './analytics.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';
import { STATUS_CODES } from '../../constants/constants.js';
import { prisma } from '../../lib/prisma.js';

export const getOverview = async (req, res, next) => {
  try {
    const overview = await analyticsService.getOverview(req.merchant.id);
    successResponse(res, STATUS_CODES.OK, null, overview);
  } catch (error) {
    next(error);
  }
};

export const getProductsBreakdown = async (req, res, next) => {
  try {
    const breakdown = await analyticsService.getProductAnalytics(req.merchant.id);
    successResponse(res, STATUS_CODES.OK, null, breakdown);
  } catch (error) {
    next(error);
  }
};

export const trackEvent = async (req, res) => {
  try {
    const { type, productId, merchantId, metadata } = req.body;
    
    const event = await prisma.analytics.create({
      data: {
        type,
        productId,
        merchantId,
        metadata: metadata || {}
      }
    });

    return successResponse(res, STATUS_CODES.CREATED, "Event tracked", event);
  } catch (error) {
    return errorResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, error.message);
  }
};
