// Warehouse routes
import express from 'express';
import * as warehouseController from './warehouse.controller.js';
import { validate } from './warehouse.validation.js';
import { authenticate, restrictTo } from '../../middleware/auth.js';
import { catchError } from '../../middleware/catchError.js';

const router = express.Router();

// Public routes - anyone can view warehouses
router.get('/', catchError(warehouseController.getAllWarehouses));
router.get('/:id', validate('getWarehouse'), catchError(warehouseController.getWarehouseById));

// Protected routes - only authenticated employees can manage warehouses
router.use(authenticate);
router.use(restrictTo('employee'));

router.post('/', validate('createWarehouse'), catchError(warehouseController.createWarehouse));
router.patch('/:id', validate('updateWarehouse'), catchError(warehouseController.updateWarehouse));
router.delete('/:id', validate('getWarehouse'), catchError(warehouseController.deleteWarehouse));

export default router;