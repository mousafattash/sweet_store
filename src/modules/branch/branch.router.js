// Branch routes
import express from 'express';
import * as branchController from './branch.controller.js';
import { validate } from './branch.validation.js';
import { authenticate, restrictTo } from '../../middleware/auth.js';
import { catchError } from '../../middleware/catchError.js';

const router = express.Router();

// Public routes - anyone can view branches
router.get('/', catchError(branchController.getAllBranches));
router.get('/:id', validate('getBranch'), catchError(branchController.getBranchById));

// Protected routes - only authenticated employees can manage branches
router.use(authenticate);
router.use(restrictTo('employee'));

router.post('/', validate('createBranch'), catchError(branchController.createBranch));
router.patch('/:id', validate('updateBranch'), catchError(branchController.updateBranch));
router.delete('/:id', validate('getBranch'), catchError(branchController.deleteBranch));

export default router;