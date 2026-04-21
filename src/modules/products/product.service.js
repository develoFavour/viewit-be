import { prisma } from '../../lib/prisma.js';

export const getAllProducts = async (merchantId) => {
  const products = await prisma.product.findMany({
    where: { merchantId },
    orderBy: { createdAt: 'desc' },
    include: {
      analytics: {
        where: {
          type: { in: ['VIEW', 'AR_VIEW'] }
        }
      }
    }
  });

  return products.map(product => {
    const realViewCount = product.analytics.filter(a => a.type === 'VIEW').length;
    const realArViewCount = product.analytics.filter(a => a.type === 'AR_VIEW').length;
    
    const { analytics, ...productData } = product;
    
    return {
      ...productData,
      viewCount: realViewCount > 0 ? realViewCount : productData.viewCount,
      arViewCount: realArViewCount > 0 ? realArViewCount : productData.arViewCount,
    };
  });
};

export const createProduct = async (merchantId, data) => {
  return await prisma.product.create({
    data: {
      ...data,
      merchantId
    }
  });
};

export const getProductById = async (id, merchantId) => {
  const product = await prisma.product.findFirst({
    where: { id, merchantId }
  });

  if (!product) {
    throw { status: 404, message: 'Product not found' };
  }

  return product;
};

export const updateProduct = async (id, merchantId, data) => {
  const product = await prisma.product.findFirst({
    where: { id, merchantId }
  });

  if (!product) {
    throw { status: 404, message: 'Product not found' };
  }

  return await prisma.product.update({
    where: { id },
    data
  });
};

export const deleteProduct = async (id, merchantId) => {
  const product = await prisma.product.findFirst({
    where: { id, merchantId }
  });

  if (!product) {
    throw { status: 404, message: 'Product not found' };
  }

  return await prisma.product.delete({
    where: { id }
  });
};

export const togglePublishProduct = async (id, merchantId) => {
  const product = await prisma.product.findFirst({
    where: { id, merchantId }
  });

  if (!product) {
    throw { status: 404, message: 'Product not found' };
  }

  return await prisma.product.update({
    where: { id },
    data: { isPublished: !product.isPublished }
  });
};
