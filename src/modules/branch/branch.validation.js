// Branch input validation using Joi
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
  // Create branch validation
  createBranch: Joi.object({
    branch_name: Joi.string().trim().min(2).max(100).required()
      .messages({
        'string.empty': 'Branch name is required',
        'string.min': 'Branch name must be at least 2 characters',
        'string.max': 'Branch name cannot exceed 100 characters',
      }),
    address: Joi.string().trim().max(200).required()
      .messages({
        'string.empty': 'Address is required',
        'string.max': 'Address cannot exceed 200 characters',
      }),
    city: Joi.string().trim().max(50).required()
      .messages({
        'string.empty': 'City is required',
        'string.max': 'City cannot exceed 50 characters',
      }),
    postal_code: Joi.string().trim().max(20)
      .messages({
        'string.max': 'Postal code cannot exceed 20 characters',
      }),
    country: Joi.string().trim().max(50).required()
      .messages({
        'string.empty': 'Country is required',
        'string.max': 'Country cannot exceed 50 characters',
      }),
    phone: Joi.string().trim().max(20)
      .messages({
        'string.max': 'Phone number cannot exceed 20 characters',
      }),
  }),

  // Update branch validation
  updateBranch: Joi.object({
    branch_name: Joi.string().trim().min(2).max(100)
      .messages({
        'string.min': 'Branch name must be at least 2 characters',
        'string.max': 'Branch name cannot exceed 100 characters',
      }),
    address: Joi.string().trim().max(200)
      .messages({
        'string.max': 'Address cannot exceed 200 characters',
      }),
    city: Joi.string().trim().max(50)
      .messages({
        'string.max': 'City cannot exceed 50 characters',
      }),
    postal_code: Joi.string().trim().max(20)
      .messages({
        'string.max': 'Postal code cannot exceed 20 characters',
      }),
    country: Joi.string().trim().max(50)
      .messages({
        'string.max': 'Country cannot exceed 50 characters',
      }),
    phone: Joi.string().trim().max(20)
      .messages({
        'string.max': 'Phone number cannot exceed 20 characters',
      }),
  }),

  // Get branch by ID validation
  getBranch: Joi.object({
    id: Joi.number().integer().positive().required()
      .messages({
        'number.base': 'Branch ID must be a number',
        'number.integer': 'Branch ID must be an integer',
        'number.positive': 'Branch ID must be a positive number',
        'any.required': 'Branch ID is required',
      }),
  }),
};