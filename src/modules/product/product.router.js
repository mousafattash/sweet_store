// Product routes
import express from 'express';
import * as productController from './product.controller.js';
import { validate } from './product.validation.js';
import { authenticate, restrictTo } from '../../middleware/auth.js';
import { catchError } from '../../middleware/catchError.js';

const router = express.Router();

// Public routes - anyone can view products
router.get('/', catchError(productController.getAllProducts));
router.get('/:id', validate('getProduct'), catchError(productController.getProductById));

// Protected routes - only authenticated employees can manage products
router.use(authenticate);
router.use(restrictTo('employee'));

router.post('/', validate('createProduct'), catchError(productController.createProduct));
router.patch('/:id', validate('updateProduct'), catchError(productController.updateProduct));
router.delete('/:id', validate('getProduct'), catchError(productController.deleteProduct));

export default router;