// Vendor input validation using Joi
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
  // Get vendor validation
  getVendor: Joi.object({
    id: Joi.number().integer().positive().required()
      .messages({
        'number.base': 'Vendor ID must be a number',
        'number.integer': 'Vendor ID must be an integer',
        'number.positive': 'Vendor ID must be positive',
        'any.required': 'Vendor ID is required'
      })
  }),

  // Create vendor validation
  createVendor: Joi.object({
    vendor_name: Joi.string().trim().min(2).max(100).required()
      .messages({
        'string.base': 'Vendor name must be a string',
        'string.empty': 'Vendor name cannot be empty',
        'string.min': 'Vendor name must be at least {#limit} characters',
        'string.max': 'Vendor name cannot exceed {#limit} characters',
        'any.required': 'Vendor name is required'
      }),
    phone: Joi.string().trim().allow('', null)
      .messages({
        'string.base': 'Phone must be a string'
      }),
    email: Joi.string().trim().email().allow('', null)
      .messages({
        'string.base': 'Email must be a string',
        'string.email': 'Email must be a valid email address'
      }),
    address: Joi.string().trim().allow('', null)
      .messages({
        'string.base': 'Address must be a string'
      }),
    country: Joi.string().trim().allow('', null)
      .messages({
        'string.base': 'Country must be a string'
      })
  }),

  // Update vendor validation
  updateVendor: Joi.object({
    id: Joi.number().integer().positive().required()
      .messages({
        'number.base': 'Vendor ID must be a number',
        'number.integer': 'Vendor ID must be an integer',
        'number.positive': 'Vendor ID must be positive',
        'any.required': 'Vendor ID is required'
      }),
    vendor_name: Joi.string().trim().min(2).max(100)
      .messages({
        'string.base': 'Vendor name must be a string',
        'string.empty': 'Vendor name cannot be empty',
        'string.min': 'Vendor name must be at least {#limit} characters',
        'string.max': 'Vendor name cannot exceed {#limit} characters'
      }),
    phone: Joi.string().trim().allow('', null)
      .messages({
        'string.base': 'Phone must be a string'
      }),
    email: Joi.string().trim().email().allow('', null)
      .messages({
        'string.base': 'Email must be a string',
        'string.email': 'Email must be a valid email address'
      }),
    address: Joi.string().trim().allow('', null)
      .messages({
        'string.base': 'Address must be a string'
      }),
    country: Joi.string().trim().allow('', null)
      .messages({
        'string.base': 'Country must be a string'
      })
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update'
  })
};