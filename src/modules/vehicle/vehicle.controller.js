// Vehicle controller functions
import models from '../../../DB/models/index.js';
import { AppError } from '../../middleware/catchError.js';

/**
 * Get all vehicles
 */
export const getAllVehicles = async (req, res) => {
  const vehicles = await models.Vehicle.findAll({
    include: [
      { model: models.Agency, as: 'agency', required: false },
    ],
  });
  
  res.status(200).json({
    status: 'success',
    results: vehicles.length,
    data: {
      vehicles,
    },
  });
};

/**
 * Get vehicle by ID
 */
export const getVehicleById = async (req, res) => {
  const { id } = req.params;
  
  const vehicle = await models.Vehicle.findByPk(id, {
    include: [
      { model: models.Agency, as: 'agency', required: false },
      { model: models.Vehicle_Rental, as: 'rentals', required: false },
    ],
  });
  
  if (!vehicle) {
    throw new AppError('Vehicle not found', 404);
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      vehicle,
    },
  });
};

/**
 * Create new vehicle
 */
export const createVehicle = async (req, res) => {
  const { 
    vin, 
    plate_number, 
    make, 
    model, 
    year, 
    mileage, 
    acquisition_type, 
    acquisition_date, 
    purchase_price, 
    notes,
    org_id 
  } = req.body;
  
  // Check if agency exists if org_id is provided
  if (org_id) {
    const agency = await models.Agency.findByPk(org_id);
    if (!agency) {
      throw new AppError('Agency not found', 404);
    }
  }
  
  const vehicle = await models.Vehicle.create({
    vin,
    plate_number,
    make,
    model,
    year,
    mileage,
    acquisition_type,
    acquisition_date,
    purchase_price,
    notes,
    org_id
  });
  
  res.status(201).json({
    status: 'success',
    data: {
      vehicle,
    },
  });
};

/**
 * Update vehicle
 */
export const updateVehicle = async (req, res) => {
  const { id } = req.params;
  const { 
    vin, 
    plate_number, 
    make, 
    model, 
    year, 
    mileage, 
    acquisition_type, 
    acquisition_date, 
    purchase_price, 
    notes,
    org_id 
  } = req.body;
  
  const vehicle = await models.Vehicle.findByPk(id);
  
  if (!vehicle) {
    throw new AppError('Vehicle not found', 404);
  }
  
  // Check if agency exists if org_id is provided
  if (org_id && org_id !== vehicle.org_id) {
    const agency = await models.Agency.findByPk(org_id);
    if (!agency) {
      throw new AppError('Agency not found', 404);
    }
  }
  
  await vehicle.update({
    vin: vin || vehicle.vin,
    plate_number: plate_number || vehicle.plate_number,
    make: make || vehicle.make,
    model: model || vehicle.model,
    year: year || vehicle.year,
    mileage: mileage || vehicle.mileage,
    acquisition_type: acquisition_type || vehicle.acquisition_type,
    acquisition_date: acquisition_date || vehicle.acquisition_date,
    purchase_price: purchase_price || vehicle.purchase_price,
    notes: notes || vehicle.notes,
    org_id: org_id || vehicle.org_id
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      vehicle,
    },
  });
};

/**
 * Delete vehicle
 */
export const deleteVehicle = async (req, res) => {
  const { id } = req.params;
  
  const vehicle = await models.Vehicle.findByPk(id);
  
  if (!vehicle) {
    throw new AppError('Vehicle not found', 404);
  }
  
  // Check if vehicle has related rentals
  const rentalCount = await models.Vehicle_Rental.count({ where: { vehicle_id: id } });
  
  if (rentalCount > 0) {
    throw new AppError('Cannot delete vehicle with associated rentals', 400);
  }
  
  await vehicle.destroy();
  
  res.status(204).json({
    status: 'success',
    data: null,
  });
};