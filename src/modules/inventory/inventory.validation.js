// Inventory input validation using Joi
import Joi from 'joi';
import { AppError } from '../../middleware/catchError.js';

/**
 * Middleware to validate request data against schema
 * @param {String} schemaName - Name of the validation schema to use
 * @returns {Function} - Express middleware function
 */
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
  // Create/update inventory validation
  updateInventory: Joi.object({
    branch_id: Joi.number().integer().positive().required()
      .messages({
        'number.base': 'Branch ID must be a number',
        'number.integer': 'Branch ID must be an integer',
        'number.positive': 'Branch ID must be a positive number',
        'any.required': 'Branch ID is required',
      }),
    raw_material_id: Joi.number().integer().positive().required()
      .messages({
        'number.base': 'Raw material ID must be a number',
        'number.integer': 'Raw material ID must be an integer',
        'number.positive': 'Raw material ID must be a positive number',
        'any.required': 'Raw material ID is required',
      }),
    quantity: Joi.number().precision(2).required()
      .messages({
        'number.base': 'Quantity must be a number',
        'any.required': 'Quantity is required',
      }),
  }),

  // Get inventory by branch validation
  getInventoryByBranch: Joi.object({
    branch_id: Joi.number().integer().positive().required()
      .messages({
        'number.base': 'Branch ID must be a number',
        'number.integer': 'Branch ID must be an integer',
        'number.positive': 'Branch ID must be a positive number',
        'any.required': 'Branch ID is required',
      }),
  }),

  // Get inventory by material validation
  getInventoryByMaterial: Joi.object({
    material_id: Joi.number().integer().positive().required()
      .messages({
        'number.base': 'Material ID must be a number',
        'number.integer': 'Material ID must be an integer',
        'number.positive': 'Material ID must be a positive number',
        'any.required': 'Material ID is required',
      }),
  }),
};