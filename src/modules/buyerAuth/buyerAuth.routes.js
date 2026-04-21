import express from 'express';
import { body } from 'express-validator';
import * as buyerAuthController from './buyerAuth.controller.js';
import { validate } from '../../middleware/validate.middleware.js';

const router = express.Router();

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty(),
  validate
], buyerAuthController.register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate
], buyerAuthController.login);

export default router;
