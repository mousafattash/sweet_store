// Agency routes
import express from 'express';
import * as agencyController from './agency.controller.js';
import { validate } from './agency.validation.js';
import { authenticate, restrictTo } from '../../middleware/auth.js';
import { catchError } from '../../middleware/catchError.js';

const router = express.Router();

// Public routes - anyone can view agencies
router.get('/', catchError(agencyController.getAllAgencies));
router.get('/:id', validate('getAgency'), catchError(agencyController.getAgencyById));

// Protected routes - only authenticated employees can manage agencies
router.use(authenticate);
router.use(restrictTo('employee'));

router.post('/', validate('createAgency'), catchError(agencyController.createAgency));
router.patch('/:id', validate('updateAgency'), catchError(agencyController.updateAgency));
router.delete('/:id', validate('getAgency'), catchError(agencyController.deleteAgency));

export default router;