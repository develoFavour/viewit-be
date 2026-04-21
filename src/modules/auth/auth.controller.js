import * as authService from './auth.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';
import { STATUS_CODES, MESSAGES } from '../../constants/constants.js';
import { sendVerificationEmail } from '../../utils/email.js';

export const register = async (req, res, next) => {
  try {
    const result = await authService.registerMerchant(req.body);
    
    // Background task to send verification email
    sendVerificationEmail(
      result.merchant.email, 
      result.merchant.name, 
      result.merchant.verificationToken
    ).catch(console.error);

    successResponse(res, STATUS_CODES.CREATED, MESSAGES.AUTH.REGISTER_SUCCESS, result);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) return errorResponse(res, STATUS_CODES.BAD_REQUEST, "Token is required");

    const result = await authService.verifyMerchantEmail(token);
    successResponse(res, STATUS_CODES.OK, "Email verified successfully", result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginMerchant(email, password);
    successResponse(res, STATUS_CODES.OK, MESSAGES.AUTH.LOGIN_SUCCESS, result);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const profile = await authService.getMerchantProfile(req.merchant.id);
    successResponse(res, STATUS_CODES.OK, null, profile);
  } catch (error) {
    next(error);
  }
};
