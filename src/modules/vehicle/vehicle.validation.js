// Vehicle input validation using Joi
import Joi from 'joi';
import { AppError } from '../../middleware/catchError.js';

export const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return next(new AppError(`Validation schema '${schemaName}' not found`, 500));
    }

    // Determine which part of the request to validate
    let dataToValidate;
    let validationOptions = { abortEarly: false };

    if (['GET', 'DELETE'].includes(req.method)) {
      dataToValidate = { ...req.params, ...req.query };
    } else {
      dataToValidate = req.body;
    }

    // Validate data against schema
    const { error, value } = schema.validate(dataToValidate, validationOptions);

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return next(new AppError(errorMessage, 400));
    }

    // Replace request data with validated data
    if (['GET', 'DELETE'].includes(req.method)) {
      req.params = value;
    } else {
      req.body = value;
    }

    next();
  };
};

// Validation schemas
const schemas = {
  // Get vehicle validation
  getVehicle: Joi.object({
    id: Joi.number().integer().positive().required()
      .messages({
        'number.base': 'Vehicle ID must be a number',
        'number.integer': 'Vehicle ID must be an integer',
        'number.positive': 'Vehicle ID must be positive',
        'any.required': 'Vehicle ID is required'
      })
  }),

  // Create vehicle validation
  createVehicle: Joi.object({
    vin: Joi.string().trim().max(17)
      .messages({
        'string.base': 'VIN must be a string',
        'string.max': 'VIN cannot exceed {#limit} characters'
      }),
    plate_number: Joi.string().trim().max(20)
      .messages({
        'string.base': 'Plate number must be a string',
        'string.max': 'Plate number cannot exceed {#limit} characters'
      }),
    make: Joi.string().trim().max(50)
      .messages({
        'string.base': 'Make must be a string',
        'string.max': 'Make cannot exceed {#limit} characters'
      }),
    model: Joi.string().trim().max(50)
      .messages({
        'string.base': 'Model must be a string',
        'string.max': 'Model cannot exceed {#limit} characters'
      }),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1)
      .messages({
        'number.base': 'Year must be a number',
        'number.integer': 'Year must be an integer',
        'number.min': 'Year must be at least {#limit}',
        'number.max': 'Year cannot exceed {#limit}'
      }),
    mileage: Joi.number().integer().min(0)
      .messages({
        'number.base': 'Mileage must be a number',
        'number.integer': 'Mileage must be an integer',
        'number.min': 'Mileage cannot be negative'
      }),
    acquisition_type: Joi.string().trim().valid('purchase', 'lease', 'rental')
      .messages({
        'string.base': 'Acquisition type must be a string',
        'any.only': 'Acquisition type must be one of: purchase, lease, rental'
      }),
    acquisition_date: Joi.date()
      .messages({
        'date.base': 'Acquisition date must be a valid date'
      }),
    purchase_price: Joi.number().precision(2).min(0)
      .messages({
        'number.base': 'Purchase price must be a number',
        'number.min': 'Purchase price cannot be negative'
      }),
    notes: Joi.string().trim().allow('', null)
      .messages({
        'string.base': 'Notes must be a string'
      }),
    org_id: Joi.number().integer().positive().allow(null)
      .messages({
        'number.base': 'Agency ID must be a number',
        'number.integer': 'Agency ID must be an integer',
        'number.positive': 'Agency ID must be positive'
      })
  }),

  // Update vehicle validation
  updateVehicle: Joi.object({
    id: Joi.number().integer().positive().required()
      .messages({
        'number.base': 'Vehicle ID must be a number',
        'number.integer': 'Vehicle ID must be an integer',
        'number.positive': 'Vehicle ID must be positive',
        'any.required': 'Vehicle ID is required'
      }),
    vin: Joi.string().trim().max(17)
      .messages({
        'string.base': 'VIN must be a string',
        'string.max': 'VIN cannot exceed {#limit} characters'
      }),
    plate_number: Joi.string().trim().max(20)
      .messages({
        'string.base': 'Plate number must be a string',
        'string.max': 'Plate number cannot exceed {#limit} characters'
      }),
    make: Joi.string().trim().max(50)
      .messages({
        'string.base': 'Make must be a string',
        'string.max': 'Make cannot exceed {#limit} characters'
      }),
    model: Joi.string().trim().max(50)
      .messages({
        'string.base': 'Model must be a string',
        'string.max': 'Model cannot exceed {#limit} characters'
      }),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1)
      .messages({
        'number.base': 'Year must be a number',
        'number.integer': 'Year must be an integer',
        'number.min': 'Year must be at least {#limit}',
        'number.max': 'Year cannot exceed {#limit}'
      }),
    mileage: Joi.number().integer().min(0)
      .messages({
        'number.base': 'Mileage must be a number',
        'number.integer': 'Mileage must be an integer',
        'number.min': 'Mileage cannot be negative'
      }),
    acquisition_type: Joi.string().trim().valid('purchase', 'lease', 'rental')
      .messages({
        'string.base': 'Acquisition type must be a string',
        'any.only': 'Acquisition type must be one of: purchase, lease, rental'
      }),
    acquisition_date: Joi.date()
      .messages({
        'date.base': 'Acquisition date must be a valid date'
      }),
    purchase_price: Joi.number().precision(2).min(0)
      .messages({
        'number.base': 'Purchase price must be a number',
        'number.min': 'Purchase price cannot be negative'
      }),
    notes: Joi.string().trim().allow('', null)
      .messages({
        'string.base': 'Notes must be a string'
      }),
    org_id: Joi.number().integer().positive().allow(null)
      .messages({
        'number.base': 'Agency ID must be a number',
        'number.integer': 'Agency ID must be an integer',
        'number.positive': 'Agency ID must be positive'
      })
  })
};