// Inventory routes
import express from 'express';
import * as inventoryController from './inventory.controller.js';
import { validate } from './inventory.validation.js';
import { authenticate, restrictTo } from '../../middleware/auth.js';
import { catchError } from '../../middleware/catchError.js';

const router = express.Router();

// All inventory routes require authentication
router.use(authenticate);
router.use(restrictTo('employee'));

// Inventory routes
router.get('/', catchError(inventoryController.getAllInventory));
router.get('/branch/:branch_id', validate('getInventoryByBranch'), catchError(inventoryController.getInventoryByBranch));
router.get('/material/:material_id', validate('getInventoryByMaterial'), catchError(inventoryController.getInventoryByMaterial));
router.post('/', validate('updateInventory'), catchError(inventoryController.updateInventory));
router.delete('/:branch_id/:raw_material_id', catchError(inventoryController.deleteInventory));

export default router;