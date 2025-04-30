// Vendor routes
import express from 'express';
import * as vendorController from './vendor.controller.js';
import { validate } from './vendor.validation.js';
import { authenticate, restrictTo } from '../../middleware/auth.js';
import { catchError } from '../../middleware/catchError.js';

const router = express.Router();

// Public routes - anyone can view vendors
router.get('/', catchError(vendorController.getAllVendors));
router.get('/:id', validate('getVendor'), catchError(vendorController.getVendorById));

// Protected routes - only authenticated employees can manage vendors
router.use(authenticate);
router.use(restrictTo('employee'));

router.post('/', validate('createVendor'), catchError(vendorController.createVendor));
router.patch('/:id', validate('updateVendor'), catchError(vendorController.updateVendor));
router.delete('/:id', validate('getVendor'), catchError(vendorController.deleteVendor));

export default router;