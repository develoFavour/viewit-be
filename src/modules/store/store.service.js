import { prisma } from '../../lib/prisma.js';

export const getStoreBySlug = async (slug) => {
  const merchant = await prisma.merchant.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      businessName: true,
      logo: true,
      description: true,
      products: {
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!merchant) {
    throw { status: 404, message: 'Store not found' };
  }

  return merchant;
};

export const getStoreProduct = async (productId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId, isPublished: true },
    include: {
      merchant: {
        select: {
          id: true,
          businessName: true,
          slug: true,
          logo: true
        }
      }
    }
  });

  if (!product) {
    throw { status: 404, message: 'Product not found' };
  }

  return product;
};

export const trackView = async (merchantId, productId) => {
  await prisma.product.update({
    where: { id: productId },
    data: { viewCount: { increment: 1 } }
  });

  return await prisma.analytics.create({
    data: {
      type: 'VIEW',
      productId,
      merchantId
    }
  });
};

export const trackArView = async (merchantId, productId) => {
  await prisma.product.update({
    where: { id: productId },
    data: { arViewCount: { increment: 1 } }
  });

  return await prisma.analytics.create({
    data: {
      type: 'AR_VIEW',
      productId,
      merchantId
    }
  });
};
