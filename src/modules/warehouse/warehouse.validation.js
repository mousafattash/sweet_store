// Warehouse input validation using Joi
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
  // Get warehouse validation
  getWarehouse: Joi.object({
    id: Joi.number().integer().positive().required()
      .messages({
        'number.base': 'Warehouse ID must be a number',
        'number.integer': 'Warehouse ID must be an integer',
        'number.positive': 'Warehouse ID must be positive',
        'any.required': 'Warehouse ID is required'
      })
  }),

  // Create warehouse validation
  createWarehouse: Joi.object({
    phone_number: Joi.string().trim().max(20)
      .messages({
        'string.base': 'Phone number must be a string',
        'string.max': 'Phone number cannot exceed {#limit} characters'
      }),
    address: Joi.string().trim().required()
      .messages({
        'string.base': 'Address must be a string',
        'string.empty': 'Address cannot be empty',
        'any.required': 'Address is required'
      })
  }),

  // Update warehouse validation
  updateWarehouse: Joi.object({
    id: Joi.number().integer().positive().required()
      .messages({
        'number.base': 'Warehouse ID must be a number',
        'number.integer': 'Warehouse ID must be an integer',
        'number.positive': 'Warehouse ID must be positive',
        'any.required': 'Warehouse ID is required'
      }),
    phone_number: Joi.string().trim().max(20)
      .messages({
        'string.base': 'Phone number must be a string',
        'string.max': 'Phone number cannot exceed {#limit} characters'
      }),
    address: Joi.string().trim()
      .messages({
        'string.base': 'Address must be a string',
        'string.empty': 'Address cannot be empty'
      })
  })
};