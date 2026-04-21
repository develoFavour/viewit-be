import * as storeService from './store.service.js';
import { successResponse } from '../../utils/response.js';
import { STATUS_CODES } from '../../constants/constants.js';
import { prisma } from '../../lib/prisma.js';

export const getStore = async (req, res, next) => {
  try {
    const store = await storeService.getStoreBySlug(req.params.slug);
    successResponse(res, STATUS_CODES.OK, null, store);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await storeService.getStoreProduct(req.params.productId);
    successResponse(res, STATUS_CODES.OK, null, product);
  } catch (error) {
    next(error);
  }
};

export const getMarketplace = async (req, res, next) => {
  try {
    const [merchants, products] = await Promise.all([
      prisma.merchant.findMany({
        take: 8,
        include: { 
          _count: { 
            select: { products: true } 
          } 
        }
      }),
      prisma.product.findMany({
        where: { isPublished: true },
        take: 20,
        include: { 
          merchant: {
            select: {
              id: true,
              businessName: true,
              slug: true,
              logo: true
            }
          } 
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);
    
    return successResponse(res, STATUS_CODES.OK, "Marketplace data fetched", { merchants, products });
  } catch (error) {
    next(error);
  }
};

// ... other existing methods (viewProduct, arViewProduct)
export const viewProduct = async (req, res, next) => {
  try {
    const { merchantId, productId } = req.body;
    const view = await prisma.analytics.create({
      data: { type: 'VIEW', merchantId, productId }
    });
    successResponse(res, STATUS_CODES.CREATED, null, view);
  } catch (error) {
    next(error);
  }
};

export const arViewProduct = async (req, res, next) => {
  try {
    const { merchantId, productId } = req.body;
    const view = await prisma.analytics.create({
      data: { type: 'AR_VIEW', merchantId, productId }
    });
    successResponse(res, STATUS_CODES.CREATED, null, view);
  } catch (error) {
    next(error);
  }
};
