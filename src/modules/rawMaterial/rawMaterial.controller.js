// Raw Material controller functions
import models from '../../../DB/models/index.js';
import { AppError } from '../../middleware/catchError.js';

/**
 * Get all raw materials
 */
export const getAllRawMaterials = async (req, res) => {
  const rawMaterials = await models.Raw_Material.findAll({
    include: [
      { model: models.Vendor, as: 'vendor', required: false },
    ],
  });
  
  res.status(200).json({
    status: 'success',
    results: rawMaterials.length,
    data: {
      rawMaterials,
    },
  });
};

/**
 * Get raw material by ID
 */
export const getRawMaterialById = async (req, res) => {
  const { id } = req.params;
  
  const rawMaterial = await models.Raw_Material.findByPk(id, {
    include: [
      { model: models.Vendor, as: 'vendor', required: false },
      { model: models.Is_Purchased, as: 'purchases', required: false },
      { model: models.Inventory, as: 'inventoryRecords', required: false },
    ],
  });
  
  if (!rawMaterial) {
    throw new AppError('Raw material not found', 404);
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      rawMaterial,
    },
  });
};

/**
 * Create new raw material
 */
export const createRawMaterial = async (req, res) => {
  const { material_name, description, vendor_id } = req.body;
  
  // Check if vendor exists if vendor_id is provided
  if (vendor_id) {
    const vendor = await models.Vendor.findByPk(vendor_id);
    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }
  }
  
  const rawMaterial = await models.Raw_Material.create({
    material_name,
    description,
    vendor_id,
    last_updated: new Date(),
  });
  
  res.status(201).json({
    status: 'success',
    data: {
      rawMaterial,
    },
  });
};

/**
 * Update raw material
 */
export const updateRawMaterial = async (req, res) => {
  const { id } = req.params;
  const { material_name, description, vendor_id } = req.body;
  
  const rawMaterial = await models.Raw_Material.findByPk(id);
  
  if (!rawMaterial) {
    throw new AppError('Raw material not found', 404);
  }
  
  // Check if vendor exists if vendor_id is provided
  if (vendor_id && vendor_id !== rawMaterial.vendor_id) {
    const vendor = await models.Vendor.findByPk(vendor_id);
    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }
  }
  
  await rawMaterial.update({
    material_name: material_name || rawMaterial.material_name,
    description: description || rawMaterial.description,
    vendor_id: vendor_id || rawMaterial.vendor_id,
    last_updated: new Date(),
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      rawMaterial,
    },
  });
};

/**
 * Delete raw material
 */
export const deleteRawMaterial = async (req, res) => {
  const { id } = req.params;
  
  const rawMaterial = await models.Raw_Material.findByPk(id);
  
  if (!rawMaterial) {
    throw new AppError('Raw material not found', 404);
  }
  
  // Check if raw material has related records
  const purchasesCount = await models.Is_Purchased.count({ where: { raw_material_id: id } });
  const inventoryCount = await models.Inventory.count({ where: { raw_material_id: id } });
  const warehouseStockCount = await models.Warehouse_Have_Raw_Material.count({ where: { raw_material_id: id } });
  const recipeCount = await models.Recipe.count({ where: { raw_material_id: id } });
  
  if (purchasesCount > 0 || inventoryCount > 0 || warehouseStockCount > 0 || recipeCount > 0) {
    throw new AppError('Cannot delete raw material with associated records', 400);
  }
  
  await rawMaterial.destroy();
  
  res.status(204).json({
    status: 'success',
    data: null,
  });
};