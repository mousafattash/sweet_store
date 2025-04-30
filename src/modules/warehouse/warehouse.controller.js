// Warehouse controller functions
import models from '../../../DB/models/index.js';
import { AppError } from '../../middleware/catchError.js';

/**
 * Get all warehouses
 */
export const getAllWarehouses = async (req, res) => {
  const warehouses = await models.Warehouse.findAll({
    include: [
      { model: models.Warehouse_Have_Raw_Material, as: 'stockEntries', required: false },
    ],
  });
  
  res.status(200).json({
    status: 'success',
    results: warehouses.length,
    data: {
      warehouses,
    },
  });
};

/**
 * Get warehouse by ID
 */
export const getWarehouseById = async (req, res) => {
  const { id } = req.params;
  
  const warehouse = await models.Warehouse.findByPk(id, {
    include: [
      { model: models.Warehouse_Have_Raw_Material, as: 'stockEntries', required: false },
    ],
  });
  
  if (!warehouse) {
    throw new AppError('Warehouse not found', 404);
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      warehouse,
    },
  });
};

/**
 * Create new warehouse
 */
export const createWarehouse = async (req, res) => {
  const { phone_number, address } = req.body;
  
  const warehouse = await models.Warehouse.create({
    phone_number,
    address,
  });
  
  res.status(201).json({
    status: 'success',
    data: {
      warehouse,
    },
  });
};

/**
 * Update warehouse
 */
export const updateWarehouse = async (req, res) => {
  const { id } = req.params;
  const { phone_number, address } = req.body;
  
  const warehouse = await models.Warehouse.findByPk(id);
  
  if (!warehouse) {
    throw new AppError('Warehouse not found', 404);
  }
  
  await warehouse.update({
    phone_number: phone_number || warehouse.phone_number,
    address: address || warehouse.address,
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      warehouse,
    },
  });
};

/**
 * Delete warehouse
 */
export const deleteWarehouse = async (req, res) => {
  const { id } = req.params;
  
  const warehouse = await models.Warehouse.findByPk(id);
  
  if (!warehouse) {
    throw new AppError('Warehouse not found', 404);
  }
  
  // Check if warehouse has related stock entries
  const stockCount = await models.Warehouse_Have_Raw_Material.count({ where: { warehouse_id: id } });
  
  if (stockCount > 0) {
    throw new AppError('Cannot delete warehouse with associated stock entries', 400);
  }
  
  await warehouse.destroy();
  
  res.status(204).json({
    status: 'success',
    data: null,
  });
};