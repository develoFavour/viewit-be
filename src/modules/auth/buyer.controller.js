import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma.js';
import { successResponse, errorResponse } from '../../utils/response.js';
import { STATUS_CODES } from '../../constants/constants.js';

export const registerBuyer = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const existing = await prisma.buyer.findUnique({ where: { email } });
    if (existing) return errorResponse(res, STATUS_CODES.BAD_REQUEST, "Email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const buyer = await prisma.buyer.create({
      data: { email, password: hashedPassword, name }
    });

    const token = jwt.sign({ id: buyer.id, role: 'buyer' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return successResponse(res, STATUS_CODES.CREATED, "Buyer registered", { token, buyer: { id: buyer.id, name: buyer.name, email: buyer.email } });
  } catch (error) {
    return errorResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const loginBuyer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const buyer = await prisma.buyer.findUnique({ where: { email } });
    
    if (!buyer || !(await bcrypt.compare(password, buyer.password))) {
      return errorResponse(res, STATUS_CODES.UNAUTHORIZED, "Invalid credentials");
    }

    const token = jwt.sign({ id: buyer.id, role: 'buyer' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return successResponse(res, STATUS_CODES.OK, "Login successful", { token, buyer: { id: buyer.id, name: buyer.name, email: buyer.email } });
  } catch (error) {
    return errorResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
    const buyerId = req.user.id;

    const existing = await prisma.favorite.findFirst({
      where: { buyerId, productId }
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return successResponse(res, STATUS_CODES.OK, "Removed from favorites");
    }

    const favorite = await prisma.favorite.create({
      data: { buyerId, productId }
    });

    return successResponse(res, STATUS_CODES.CREATED, "Added to favorites", favorite);
  } catch (error) {
    return errorResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const getFavorites = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const favorites = await prisma.favorite.findMany({
      where: { buyerId },
      include: {
        product: {
          include: { merchant: { select: { businessName: true, slug: true } } }
        }
      }
    });

    return successResponse(res, STATUS_CODES.OK, "Favorites fetched", favorites);
  } catch (error) {
    return errorResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, error.message);
  }
};
