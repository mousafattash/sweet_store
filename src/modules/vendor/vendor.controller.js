// Vendor controller functions
import models from '../../../DB/models/index.js';
import { AppError } from '../../middleware/catchError.js';

/**
 * Get all vendors
 */
export const getAllVendors = async (req, res) => {
  const vendors = await models.Vendor.findAll({
    include: [
      { model: models.Raw_Material, as: 'materials', required: false },
    ],
  });
  
  res.status(200).json({
    status: 'success',
    results: vendors.length,
    data: {
      vendors,
    },
  });
};

/**
 * Get vendor by ID
 */
export const getVendorById = async (req, res) => {
  const { id } = req.params;
  
  const vendor = await models.Vendor.findByPk(id, {
    include: [
      { model: models.Raw_Material, as: 'materials', required: false },
      { model: models.Is_Purchased, as: 'purchases', required: false },
    ],
  });
  
  if (!vendor) {
    throw new AppError('Vendor not found', 404);
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      vendor,
    },
  });
};

/**
 * Create new vendor
 */
export const createVendor = async (req, res) => {
  const { vendor_name, phone, email, address, country } = req.body;
  
  const vendor = await models.Vendor.create({
    vendor_name,
    phone,
    email,
    address,
    country,
  });
  
  res.status(201).json({
    status: 'success',
    data: {
      vendor,
    },
  });
};

/**
 * Update vendor
 */
export const updateVendor = async (req, res) => {
  const { id } = req.params;
  const { vendor_name, phone, email, address, country } = req.body;
  
  const vendor = await models.Vendor.findByPk(id);
  
  if (!vendor) {
    throw new AppError('Vendor not found', 404);
  }
  
  await vendor.update({
    vendor_name: vendor_name || vendor.vendor_name,
    phone: phone || vendor.phone,
    email: email || vendor.email,
    address: address || vendor.address,
    country: country || vendor.country,
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      vendor,
    },
  });
};

/**
 * Delete vendor
 */
export const deleteVendor = async (req, res) => {
  const { id } = req.params;
  
  const vendor = await models.Vendor.findByPk(id);
  
  if (!vendor) {
    throw new AppError('Vendor not found', 404);
  }
  
  // Check if vendor has related materials or purchases
  const materialsCount = await models.Raw_Material.count({ where: { vendor_id: id } });
  const purchasesCount = await models.Is_Purchased.count({ where: { vendor_id: id } });
  
  if (materialsCount > 0 || purchasesCount > 0) {
    throw new AppError('Cannot delete vendor with associated materials or purchases', 400);
  }
  
  await vendor.destroy();
  
  res.status(204).json({
    status: 'success',
    data: null,
  });
};