import * as productService from './product.service.js';
import { successResponse } from '../../utils/response.js';
import { STATUS_CODES, MESSAGES } from '../../constants/constants.js';

export const getAll = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts(req.merchant.id);
    successResponse(res, STATUS_CODES.OK, null, products);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.merchant.id, req.body);
    successResponse(res, STATUS_CODES.CREATED, MESSAGES.PRODUCT.CREATED, product);
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id, req.merchant.id);
    successResponse(res, STATUS_CODES.OK, null, product);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.merchant.id, req.body);
    successResponse(res, STATUS_CODES.OK, MESSAGES.PRODUCT.UPDATED, product);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id, req.merchant.id);
    successResponse(res, STATUS_CODES.OK, MESSAGES.PRODUCT.DELETED);
  } catch (error) {
    next(error);
  }
};

export const togglePublish = async (req, res, next) => {
  try {
    const product = await productService.togglePublishProduct(req.params.id, req.merchant.id);
    successResponse(res, STATUS_CODES.OK, MESSAGES.PRODUCT.UPDATED, product);
  } catch (error) {
    next(error);
  }
};
