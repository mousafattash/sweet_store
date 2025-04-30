// Vehicle routes
import express from 'express';
import * as vehicleController from './vehicle.controller.js';
import { validate } from './vehicle.validation.js';
import { authenticate, restrictTo } from '../../middleware/auth.js';
import { catchError } from '../../middleware/catchError.js';

const router = express.Router();

// Public routes - anyone can view vehicles
router.get('/', catchError(vehicleController.getAllVehicles));
router.get('/:id', validate('getVehicle'), catchError(vehicleController.getVehicleById));

// Protected routes - only authenticated employees can manage vehicles
router.use(authenticate);
router.use(restrictTo('employee'));

router.post('/', validate('createVehicle'), catchError(vehicleController.createVehicle));
router.patch('/:id', validate('updateVehicle'), catchError(vehicleController.updateVehicle));
router.delete('/:id', validate('getVehicle'), catchError(vehicleController.deleteVehicle));

export default router;