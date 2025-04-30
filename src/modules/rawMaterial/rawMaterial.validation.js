// Raw Material input validation using Joi
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
  // Get raw material validation
  getRawMaterial: Joi.object({
    id: Joi.number().integer().positive().required()
      .messages({
        'number.base': 'Raw material ID must be a number',
        'number.integer': 'Raw material ID must be an integer',
        'number.positive': 'Raw material ID must be positive',
        'any.required': 'Raw material ID is required'
      })
  }),

  // Create raw material validation
  createRawMaterial: Joi.object({
    material_name: Joi.string().trim().min(2).max(100).required()
      .messages({
        'string.base': 'Material name must be a string',
        'string.empty': 'Material name cannot be empty',
        'string.min': 'Material name must be at least {#limit} characters',
        'string.max': 'Material name cannot exceed {#limit} characters',
        'any.required': 'Material name is required'
      }),
    description: Joi.string().trim().allow('', null)
      .messages({
        'string.base': 'Description must be a string'
      }),
    vendor_id: Joi.number().integer().positive().allow(null)
      .messages({
        'number.base': 'Vendor ID must be a number',
        'number.integer': 'Vendor ID must be an integer',
        'number.positive': 'Vendor ID must be positive'
      })
  }),

  // Update raw material validation
  updateRawMaterial: Joi.object({
    id: Joi.number().integer().positive().required()
      .messages({
        'number.base': 'Raw material ID must be a number',
        'number.integer': 'Raw material ID must be an integer',
        'number.positive': 'Raw material ID must be positive',
        'any.required': 'Raw material ID is required'
      }),
    material_name: Joi.string().trim().min(2).max(100)
      .messages({
        'string.base': 'Material name must be a string',
        'string.empty': 'Material name cannot be empty',
        'string.min': 'Material name must be at least {#limit} characters',
        'string.max': 'Material name cannot exceed {#limit} characters'
      }),
    description: Joi.string().trim().allow('', null)
      .messages({
        'string.base': 'Description must be a string'
      }),
    vendor_id: Joi.number().integer().positive().allow(null)
      .messages({
        'number.base': 'Vendor ID must be a number',
        'number.integer': 'Vendor ID must be an integer',
        'number.positive': 'Vendor ID must be positive'
      })
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update'
  }),

  // Purchase raw material validation
  purchaseRawMaterial: Joi.object({
    raw_material_id: Joi.number().integer().positive().required()
      .messages({
        'number.base': 'Raw material ID must be a number',
        'number.integer': 'Raw material ID must be an integer',
        'number.positive': 'Raw material ID must be positive',
        'any.required': 'Raw material ID is required'
      }),
    vendor_id: Joi.number().integer().positive().required()
      .messages({
        'number.base': 'Vendor ID must be a number',
        'number.integer': 'Vendor ID must be an integer',
        'number.positive': 'Vendor ID must be positive',
        'any.required': 'Vendor ID is required'
      }),
    quantity: Joi.number().positive().required()
      .messages({
        'number.base': 'Quantity must be a number',
        'number.positive': 'Quantity must be positive',
        'any.required': 'Quantity is required'
      }),
    unit_price: Joi.number().positive().required()
      .messages({
        'number.base': 'Unit price must be a number',
        'number.positive': 'Unit price must be positive',
        'any.required': 'Unit price is required'
      }),
    purchase_date: Joi.date().default(new Date())
      .messages({
        'date.base': 'Purchase date must be a valid date'
      }),
    delivery_date: Joi.date().min(Joi.ref('purchase_date'))
      .messages({
        'date.base': 'Delivery date must be a valid date',
        'date.min': 'Delivery date cannot be before purchase date'
      }),
    status: Joi.string().valid('pending', 'delivered', 'cancelled').default('pending')
      .messages({
        'any.only': 'Status must be one of: pending, delivered, cancelled'
      })
  })
};