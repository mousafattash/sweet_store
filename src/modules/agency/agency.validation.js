// Agency input validation using Joi
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
  // Get agency validation
  getAgency: Joi.object({
    id: Joi.number().integer().positive().required()
      .messages({
        'number.base': 'Agency ID must be a number',
        'number.integer': 'Agency ID must be an integer',
        'number.positive': 'Agency ID must be positive',
        'any.required': 'Agency ID is required'
      })
  }),

  // Create agency validation
  createAgency: Joi.object({
    name: Joi.string().trim().min(2).max(100).required()
      .messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name cannot be empty',
        'string.min': 'Name must be at least {#limit} characters',
        'string.max': 'Name cannot exceed {#limit} characters',
        'any.required': 'Name is required'
      }),
    contact_info: Joi.string().trim().allow('', null)
      .messages({
        'string.base': 'Contact information must be a string'
      })
  }),

  // Update agency validation
  updateAgency: Joi.object({
    id: Joi.number().integer().positive().required()
      .messages({
        'number.base': 'Agency ID must be a number',
        'number.integer': 'Agency ID must be an integer',
        'number.positive': 'Agency ID must be positive',
        'any.required': 'Agency ID is required'
      }),
    name: Joi.string().trim().min(2).max(100)
      .messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name cannot be empty',
        'string.min': 'Name must be at least {#limit} characters',
        'string.max': 'Name cannot exceed {#limit} characters'
      }),
    contact_info: Joi.string().trim().allow('', null)
      .messages({
        'string.base': 'Contact information must be a string'
      })
  })
};