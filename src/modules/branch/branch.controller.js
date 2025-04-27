// Branch controller functions
import models from '../../../DB/models/index.js';
import { AppError } from '../../middleware/catchError.js';

/**
 * Get all branches
 */
export const getAllBranches = async (req, res) => {
  const branches = await models.Branch.findAll();
  
  res.status(200).json({
    status: 'success',
    results: branches.length,
    data: {
      branches,
    },
  });
};

/**
 * Get branch by ID
 */
export const getBranchById = async (req, res, next) => {
  const { id } = req.params;
  
  const branch = await models.Branch.findByPk(id, {
    include: [
      { model: models.Inventory, as: 'inventories' },
      { model: models.Branch_Expenses, as: 'expenses' },
    ],
  });
  
  if (!branch) {
    return next(new AppError('Branch not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      branch,
    },
  });
};

/**
 * Create new branch
 */
export const createBranch = async (req, res) => {
  const { branch_name, address, city, postal_code, country, phone } = req.body;
  
  const branch = await models.Branch.create({
    name: branch_name,
    address: `${address}, ${city}, ${postal_code || ''}, ${country}`,
    phone,
    email: req.body.email || '',
  });
  
  res.status(201).json({
    status: 'success',
    data: {
      branch,
    },
  });
};

/**
 * Update branch
 */
export const updateBranch = async (req, res, next) => {
  const { id } = req.params;
  const { branch_name, address, city, postal_code, country, phone } = req.body;
  
  const branch = await models.Branch.findByPk(id);
  
  if (!branch) {
    return next(new AppError('Branch not found', 404));
  }
  
  // Prepare updated address if any address components are provided
  let updatedAddress = branch.address;
  if (address || city || postal_code || country) {
    // Parse existing address to get components not being updated
    const addressParts = branch.address.split(', ');
    const existingAddress = addressParts[0] || '';
    const existingCity = addressParts[1] || '';
    const existingPostalCode = addressParts[2] || '';
    const existingCountry = addressParts[3] || '';
    
    updatedAddress = `${address || existingAddress}, ${city || existingCity}, ${postal_code || existingPostalCode}, ${country || existingCountry}`;
  }
  
  await branch.update({
    name: branch_name || branch.name,
    address: updatedAddress,
    phone: phone || branch.phone,
    email: req.body.email || branch.email,
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      branch,
    },
  });
};

/**
 * Delete branch
 */
export const deleteBranch = async (req, res, next) => {
  const { id } = req.params;
  
  const branch = await models.Branch.findByPk(id);
  
  if (!branch) {
    return next(new AppError('Branch not found', 404));
  }
  
  // Check if branch has associated data
  const inventories = await models.Inventory.findAll({ where: { branch_id: id } });
  const expenses = await models.Branch_Expenses.findAll({ where: { branch_id: id } });
  const shifts = await models.Employee_Shift.findAll({ where: { branch_id: id } });
  
  if (inventories.length > 0 || expenses.length > 0 || shifts.length > 0) {
    return next(new AppError('Cannot delete branch with associated data', 400));
  }
  
  await branch.destroy();
  
  res.status(204).json({
    status: 'success',
    data: null,
  });
};