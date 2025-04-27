// Employee routes
import express from 'express';
import * as employeeController from './employee.controller.js';
import { validate } from './employee.validation.js';
import { authenticate, restrictTo } from '../../middleware/auth.js';
import { catchError } from '../../middleware/catchError.js';

const router = express.Router();

// All employee routes require authentication and admin privileges
router.use(authenticate);
router.use(restrictTo('admin'));

// Employee management routes
router.get('/', catchError(employeeController.getAllEmployees));
router.get('/:id', validate('getEmployee'), catchError(employeeController.getEmployeeById));
router.post('/', validate('createEmployee'), catchError(employeeController.createEmployee));
router.patch('/:id', validate('updateEmployee'), catchError(employeeController.updateEmployee));
router.delete('/:id', validate('getEmployee'), catchError(employeeController.deleteEmployee));

export default router;