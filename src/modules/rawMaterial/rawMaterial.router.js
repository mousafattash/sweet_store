// Raw Material routes
import express from 'express';
import * as rawMaterialController from './rawMaterial.controller.js';
import { validate } from './rawMaterial.validation.js';
import { authenticate, restrictTo } from '../../middleware/auth.js';
import { catchError } from '../../middleware/catchError.js';

const router = express.Router();

// Public routes - anyone can view raw materials
router.get('/', catchError(rawMaterialController.getAllRawMaterials));
router.get('/:id', validate('getRawMaterial'), catchError(rawMaterialController.getRawMaterialById));

// Protected routes - only authenticated employees can manage raw materials
router.use(authenticate);
router.use(restrictTo('employee'));

router.post('/', validate('createRawMaterial'), catchError(rawMaterialController.createRawMaterial));
router.patch('/:id', validate('updateRawMaterial'), catchError(rawMaterialController.updateRawMaterial));
router.delete('/:id', validate('getRawMaterial'), catchError(rawMaterialController.deleteRawMaterial));

export default router;