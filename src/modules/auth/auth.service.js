import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt.js';
import { v4 as uuidv4 } from 'uuid';

export const registerMerchant = async (data) => {
  const { email, password, name, businessName, slug } = data;

  const existingMerchant = await prisma.merchant.findFirst({
    where: {
      OR: [{ email }, { slug }]
    }
  });

  if (existingMerchant) {
    const field = existingMerchant.email === email ? 'Email' : 'Store Slug';
    throw { status: 400, message: `${field} is already taken` };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = uuidv4();

  const merchant = await prisma.merchant.create({
    data: {
      email,
      password: hashedPassword,
      name,
      businessName,
      slug,
      verificationToken,
      isVerified: false
    }
  });

  const { password: _, ...merchantWithoutPassword } = merchant;
  return { merchant: merchantWithoutPassword };
};

export const verifyMerchantEmail = async (token) => {
  const merchant = await prisma.merchant.findFirst({
    where: { verificationToken: token }
  });

  if (!merchant) {
    throw { status: 400, message: 'Invalid or expired verification token' };
  }

  await prisma.merchant.update({
    where: { id: merchant.id },
    data: { 
      isVerified: true, 
      verificationToken: null 
    }
  });

  const payload = { id: merchant.id, email: merchant.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const { password: _, ...merchantWithoutPassword } = merchant;
  return { merchant: merchantWithoutPassword, accessToken, refreshToken };
};

export const loginMerchant = async (email, password) => {
  const merchant = await prisma.merchant.findUnique({ where: { email } });

  if (!merchant) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  if (!merchant.isVerified) {
    throw { status: 403, message: 'Please verify your email address before logging in.' };
  }

  const isMatch = await bcrypt.compare(password, merchant.password);
  if (!isMatch) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  const payload = { id: merchant.id, email: merchant.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const { password: _, ...merchantWithoutPassword } = merchant;
  return { merchant: merchantWithoutPassword, accessToken, refreshToken };
};

export const getMerchantProfile = async (id) => {
  const merchant = await prisma.merchant.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  if (!merchant) {
    throw { status: 404, message: 'Merchant not found' };
  }

  const { password: _, ...merchantWithoutPassword } = merchant;
  return merchantWithoutPassword;
};
