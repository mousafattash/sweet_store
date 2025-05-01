// User routes
import express from 'express';
import * as userController from './user.controller.js';
import { validate } from './user.validation.js';
import { authenticate, restrictTo } from '../../middleware/auth.js';
import { catchError } from '../../middleware/catchError.js';

const router = express.Router();

// Public routes
router.post('/register', validate('register'), catchError(userController.register));
router.post('/login', validate('login'), catchError(userController.login));
router.post('/verify', validate('verifyEmail'), catchError(userController.verifyEmail));
router.post('/resend-code', validate('resendVerificationCode'), catchError(userController.resendVerificationCode));
router.post('/forgot-password', validate('forgotPassword'), catchError(userController.forgotPassword));
router.post('/reset-password/:token', validate('resetPassword'), catchError(userController.resetPassword));

// Protected routes
router.use(authenticate);
router.use(restrictTo('customer'));

router.get('/profile', catchError(userController.getProfile));
router.patch('/profile', validate('updateProfile'), catchError(userController.updateProfile));
router.patch('/change-password', validate('changePassword'), catchError(userController.changePassword));

export default router;