// Inventory controller functions
import models from '../../../DB/models/index.js';
import { AppError } from '../../middleware/catchError.js';

/**
 * Get all inventory items
 */
export const getAllInventory = async (req, res) => {
  const inventory = await models.Inventory.findAll({
    include: [
      { model: models.Branch, as: 'branch' },
      { model: models.Raw_Material, as: 'rawMaterial' },
    ],
  });
  
  res.status(200).json({
    status: 'success',
    results: inventory.length,
    data: {
      inventory,
    },
  });
};

/**
 * Get inventory by branch
 */
export const getInventoryByBranch = async (req, res) => {
  const { branch_id } = req.params;
  
  // Check if branch exists
  const branch = await models.Branch.findByPk(branch_id);
  if (!branch) {
    throw new AppError('Branch not found', 404);
  }
  
  const inventory = await models.Inventory.findAll({
    where: { branch_id },
    include: [
      { model: models.Raw_Material, as: 'rawMaterial' },
    ],
  });
  
  res.status(200).json({
    status: 'success',
    results: inventory.length,
    data: {
      branch,
      inventory,
    },
  });
};

/**
 * Get inventory by raw material
 */
export const getInventoryByMaterial = async (req, res) => {
  const { material_id } = req.params;
  
  // Check if material exists
  const material = await models.Raw_Material.findByPk(material_id);
  if (!material) {
    throw new AppError('Raw material not found', 404);
  }
  
  const inventory = await models.Inventory.findAll({
    where: { raw_material_id: material_id },
    include: [
      { model: models.Branch, as: 'branch' },
    ],
  });
  
  res.status(200).json({
    status: 'success',
    results: inventory.length,
    data: {
      material,
      inventory,
    },
  });
};

/**
 * Update inventory (create if not exists)
 */
export const updateInventory = async (req, res) => {
  const { branch_id, raw_material_id, quantity } = req.body;
  
  // Check if branch exists
  const branch = await models.Branch.findByPk(branch_id);
  if (!branch) {
    throw new AppError('Branch not found', 404);
  }
  
  // Check if material exists
  const material = await models.Raw_Material.findByPk(raw_material_id);
  if (!material) {
    throw new AppError('Raw material not found', 404);
  }
  
  // Find or create inventory record
  const [inventory, created] = await models.Inventory.findOrCreate({
    where: { branch_id, raw_material_id },
    defaults: {
      quantity,
      last_updated: new Date(),
    },
  });
  
  // If record already existed, update it
  if (!created) {
    await inventory.update({
      quantity,
      last_updated: new Date(),
    });
  }
  
  res.status(created ? 201 : 200).json({
    status: 'success',
    data: {
      inventory,
    },
  });
};

/**
 * Delete inventory record
 */
export const deleteInventory = async (req, res) => {
  const { branch_id, raw_material_id } = req.params;
  
  const inventory = await models.Inventory.findOne({
    where: { branch_id, raw_material_id },
  });
  
  if (!inventory) {
    throw new AppError('Inventory record not found', 404);
  }
  
  await inventory.destroy();
  
  res.status(204).json({
    status: 'success',
    data: null,
  });
};