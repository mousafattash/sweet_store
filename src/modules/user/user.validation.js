// User input validation using Joi
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
  // Register validation
  register: Joi.object({
    first_name: Joi.string().trim().min(2).max(50).required()
      .messages({
        'string.empty': 'First name is required',
        'string.min': 'First name must be at least 2 characters',
        'string.max': 'First name cannot exceed 50 characters',
      }),
    last_name: Joi.string().trim().min(2).max(50).required()
      .messages({
        'string.empty': 'Last name is required',
        'string.min': 'Last name must be at least 2 characters',
        'string.max': 'Last name cannot exceed 50 characters',
      }),
    email: Joi.string().email().required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email',
      }),
    password: Joi.string().min(8).required()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
      .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 8 characters',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
      .messages({
        'any.only': 'Passwords do not match',
        'string.empty': 'Please confirm your password',
      }),
    type: Joi.string().valid('person', 'organization').default('person'),
  }),

  // Login validation
  login: Joi.object({
    email: Joi.string().email().required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email',
      }),
    password: Joi.string().required()
      .messages({
        'string.empty': 'Password is required',
      }),
  }),

  // Update profile validation
  updateProfile: Joi.object({
    first_name: Joi.string().trim().min(2).max(50)
      .messages({
        'string.min': 'First name must be at least 2 characters',
        'string.max': 'First name cannot exceed 50 characters',
      }),
    last_name: Joi.string().trim().min(2).max(50)
      .messages({
        'string.min': 'Last name must be at least 2 characters',
        'string.max': 'Last name cannot exceed 50 characters',
      }),
    email: Joi.string().email()
      .messages({
        'string.email': 'Please provide a valid email',
      }),
  }),

  // Change password validation
  changePassword: Joi.object({
    currentPassword: Joi.string().required()
      .messages({
        'string.empty': 'Current password is required',
      }),
    newPassword: Joi.string().min(8).required()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
      .messages({
        'string.empty': 'New password is required',
        'string.min': 'New password must be at least 8 characters',
        'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, and one number',
      }),
    confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required()
      .messages({
        'any.only': 'New passwords do not match',
        'string.empty': 'Please confirm your new password',
      }),
  }),

  // Forgot password validation
  forgotPassword: Joi.object({
    email: Joi.string().email().required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email',
      }),
  }),

  // Reset password validation
  resetPassword: Joi.object({
    password: Joi.string().min(8).required()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
      .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 8 characters',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
      .messages({
        'any.only': 'Passwords do not match',
        'string.empty': 'Please confirm your password',
      }),
  }),
};