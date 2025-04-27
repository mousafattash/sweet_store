// Product input validation using Joi
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
  // Create product validation
  createProduct: Joi.object({
    product_name: Joi.string().trim().min(2).max(100).required()
      .messages({
        'string.empty': 'Product name is required',
        'string.min': 'Product name must be at least 2 characters',
        'string.max': 'Product name cannot exceed 100 characters',
      }),
    description: Joi.string().trim().max(1000)
      .messages({
        'string.max': 'Description cannot exceed 1000 characters',
      }),
    base_price: Joi.number().precision(2).positive().required()
      .messages({
        'number.base': 'Base price must be a number',
        'number.positive': 'Base price must be a positive number',
        'any.required': 'Base price is required',
      }),
  }),

  // Update product validation
  updateProduct: Joi.object({
    product_name: Joi.string().trim().min(2).max(100)
      .messages({
        'string.min': 'Product name must be at least 2 characters',
        'string.max': 'Product name cannot exceed 100 characters',
      }),
    description: Joi.string().trim().max(1000)
      .messages({
        'string.max': 'Description cannot exceed 1000 characters',
      }),
    base_price: Joi.number().precision(2).positive()
      .messages({
        'number.base': 'Base price must be a number',
        'number.positive': 'Base price must be a positive number',
      }),
  }),

  // Get product by ID validation
  getProduct: Joi.object({
    id: Joi.number().integer().positive().required()
      .messages({
        'number.base': 'Product ID must be a number',
        'number.integer': 'Product ID must be an integer',
        'number.positive': 'Product ID must be a positive number',
        'any.required': 'Product ID is required',
      }),
  }),
};