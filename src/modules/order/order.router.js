// Order routes
import express from 'express';
import * as orderController from './order.controller.js';
import { validate } from './order.validation.js';
import { authenticate, restrictTo } from '../../middleware/auth.js';
import { catchError } from '../../middleware/catchError.js';

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

// Routes for both customers and employees
router.get('/', catchError(orderController.getAllOrders));
router.get('/:id', validate('getOrder'), catchError(orderController.getOrderById));

// Routes primarily for customers
router.post('/', validate('createOrder'), catchError(orderController.createOrder));
router.patch('/:id', validate('updateOrder'), catchError(orderController.updateOrder));
router.delete('/:id/cancel', validate('getOrder'), catchError(orderController.cancelOrder));

export default router;