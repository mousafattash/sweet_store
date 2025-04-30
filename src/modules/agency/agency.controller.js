// Agency controller functions
import models from '../../../DB/models/index.js';
import { AppError } from '../../middleware/catchError.js';

/**
 * Get all agencies
 */
export const getAllAgencies = async (req, res) => {
  const agencies = await models.Agency.findAll({
    include: [
      { model: models.Vehicle, as: 'vehicles', required: false },
    ],
  });
  
  res.status(200).json({
    status: 'success',
    results: agencies.length,
    data: {
      agencies,
    },
  });
};

/**
 * Get agency by ID
 */
export const getAgencyById = async (req, res) => {
  const { id } = req.params;
  
  const agency = await models.Agency.findByPk(id, {
    include: [
      { model: models.Vehicle, as: 'vehicles', required: false },
      { model: models.Vehicle_Rental, as: 'rentals', required: false },
    ],
  });
  
  if (!agency) {
    throw new AppError('Agency not found', 404);
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      agency,
    },
  });
};

/**
 * Create new agency
 */
export const createAgency = async (req, res) => {
  const { name, contact_info } = req.body;
  
  const agency = await models.Agency.create({
    name,
    contact_info,
  });
  
  res.status(201).json({
    status: 'success',
    data: {
      agency,
    },
  });
};

/**
 * Update agency
 */
export const updateAgency = async (req, res) => {
  const { id } = req.params;
  const { name, contact_info } = req.body;
  
  const agency = await models.Agency.findByPk(id);
  
  if (!agency) {
    throw new AppError('Agency not found', 404);
  }
  
  await agency.update({
    name: name || agency.name,
    contact_info: contact_info || agency.contact_info,
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      agency,
    },
  });
};

/**
 * Delete agency
 */
export const deleteAgency = async (req, res) => {
  const { id } = req.params;
  
  const agency = await models.Agency.findByPk(id);
  
  if (!agency) {
    throw new AppError('Agency not found', 404);
  }
  
  // Check if agency has related vehicles or rentals
  const vehicleCount = await models.Vehicle.count({ where: { org_id: id } });
  const rentalCount = await models.Vehicle_Rental.count({ where: { agency_id: id } });
  
  if (vehicleCount > 0 || rentalCount > 0) {
    throw new AppError('Cannot delete agency with associated vehicles or rentals', 400);
  }
  
  await agency.destroy();
  
  res.status(204).json({
    status: 'success',
    data: null,
  });
};