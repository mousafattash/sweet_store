// Order input validation using Joi
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
  // Create order validation
  createOrder: Joi.object({
    // Order details
    order_date: Joi.date().default(new Date()),
    total_amount: Joi.number().precision(2).positive().required()
      .messages({
        'number.base': 'Total amount must be a number',
        'number.positive': 'Total amount must be a positive number',
        'any.required': 'Total amount is required',
      }),
    status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').default('pending'),
    
    // Order items
    orderItems: Joi.array().items(
      Joi.object({
        product_id: Joi.number().integer().positive().required()
          .messages({
            'number.base': 'Product ID must be a number',
            'number.integer': 'Product ID must be an integer',
            'number.positive': 'Product ID must be a positive number',
            'any.required': 'Product ID is required',
          }),
        quantity: Joi.number().integer().positive().required()
          .messages({
            'number.base': 'Quantity must be a number',
            'number.integer': 'Quantity must be an integer',
            'number.positive': 'Quantity must be a positive number',
            'any.required': 'Quantity is required',
          }),
        price: Joi.number().precision(2).positive().required()
          .messages({
            'number.base': 'Price must be a number',
            'number.positive': 'Price must be a positive number',
            'any.required': 'Price is required',
          }),
      })
    ).min(1).required()
      .messages({
        'array.min': 'Order must contain at least one item',
        'any.required': 'Order items are required',
      }),
    
    // Shipping details (optional)
    shipping_address: Joi.string(),
    shipping_city: Joi.string(),
    shipping_postal_code: Joi.string(),
    shipping_country: Joi.string(),
  }),

  // Update order validation
  updateOrder: Joi.object({
    status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled')
      .messages({
        'any.only': 'Status must be one of: pending, processing, shipped, delivered, cancelled',
      }),
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update'
  }),

  // Get order by ID validation
  getOrder: Joi.object({
    id: Joi.number().integer().positive().required()
      .messages({
        'number.base': 'Order ID must be a number',
        'number.integer': 'Order ID must be an integer',
        'number.positive': 'Order ID must be a positive number',
        'any.required': 'Order ID is required',
      }),
  }),
};