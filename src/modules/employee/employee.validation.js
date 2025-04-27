// Employee input validation using Joi
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
  // Schema for getting a single employee
  getEmployee: Joi.object({
    id: Joi.number().integer().required().messages({
      'number.base': 'Employee ID must be a number',
      'number.integer': 'Employee ID must be an integer',
      'any.required': 'Employee ID is required',
    }),
  }),

  // Schema for creating a new employee
  createEmployee: Joi.object({
    identity_card: Joi.number().integer().required().messages({
      'number.base': 'Identity card must be a number',
      'number.integer': 'Identity card must be an integer',
      'any.required': 'Identity card is required',
    }),
    first_name: Joi.string().required().trim().min(2).max(50).messages({
      'string.base': 'First name must be a string',
      'string.empty': 'First name cannot be empty',
      'string.min': 'First name must be at least {#limit} characters',
      'string.max': 'First name cannot exceed {#limit} characters',
      'any.required': 'First name is required',
    }),
    last_name: Joi.string().required().trim().min(2).max(50).messages({
      'string.base': 'Last name must be a string',
      'string.empty': 'Last name cannot be empty',
      'string.min': 'Last name must be at least {#limit} characters',
      'string.max': 'Last name cannot exceed {#limit} characters',
      'any.required': 'Last name is required',
    }),
    email: Joi.string().required().email().trim().lowercase().messages({
      'string.base': 'Email must be a string',
      'string.email': 'Email must be a valid email address',
      'string.empty': 'Email cannot be empty',
      'any.required': 'Email is required',
    }),
    password: Joi.string().required().min(8).max(30).messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password cannot be empty',
      'string.min': 'Password must be at least {#limit} characters',
      'string.max': 'Password cannot exceed {#limit} characters',
      'any.required': 'Password is required',
    }),
    phone_number: Joi.string().trim().messages({
      'string.base': 'Phone number must be a string',
    }),
    address: Joi.object({
      street: Joi.string().trim(),
      city: Joi.string().trim(),
      state: Joi.string().trim(),
      postal_code: Joi.string().trim(),
      country: Joi.string().trim(),
    }),
    hire_date: Joi.date().default(new Date()).messages({
      'date.base': 'Hire date must be a valid date',
    }),
    hourly_wage: Joi.number().required().min(0).messages({
      'number.base': 'Hourly wage must be a number',
      'number.min': 'Hourly wage cannot be negative',
      'any.required': 'Hourly wage is required',
    }),
    branch_id: Joi.number().integer().required().messages({
      'number.base': 'Branch ID must be a number',
      'number.integer': 'Branch ID must be an integer',
      'any.required': 'Branch ID is required',
    }),
    role_id: Joi.number().integer().required().messages({
      'number.base': 'Role ID must be a number',
      'number.integer': 'Role ID must be an integer',
      'any.required': 'Role ID is required',
    }),
  }),

  // Schema for updating an employee
  updateEmployee: Joi.object({
    id: Joi.number().integer().required().messages({
      'number.base': 'Employee ID must be a number',
      'number.integer': 'Employee ID must be an integer',
      'any.required': 'Employee ID is required',
    }),
    first_name: Joi.string().trim().min(2).max(50).messages({
      'string.base': 'First name must be a string',
      'string.min': 'First name must be at least {#limit} characters',
      'string.max': 'First name cannot exceed {#limit} characters',
    }),
    last_name: Joi.string().trim().min(2).max(50).messages({
      'string.base': 'Last name must be a string',
      'string.min': 'Last name must be at least {#limit} characters',
      'string.max': 'Last name cannot exceed {#limit} characters',
    }),
    email: Joi.string().email().trim().lowercase().messages({
      'string.base': 'Email must be a string',
      'string.email': 'Email must be a valid email address',
    }),
    phone_number: Joi.string().trim().messages({
      'string.base': 'Phone number must be a string',
    }),
    address: Joi.object({
      street: Joi.string().trim(),
      city: Joi.string().trim(),
      state: Joi.string().trim(),
      postal_code: Joi.string().trim(),
      country: Joi.string().trim(),
    }),
    hourly_wage: Joi.number().min(0).messages({
      'number.base': 'Hourly wage must be a number',
      'number.min': 'Hourly wage cannot be negative',
    }),
    branch_id: Joi.number().integer().messages({
      'number.base': 'Branch ID must be a number',
      'number.integer': 'Branch ID must be an integer',
    }),
    role_id: Joi.number().integer().messages({
      'number.base': 'Role ID must be a number',
      'number.integer': 'Role ID must be an integer',
    }),
    termination_date: Joi.date().messages({
      'date.base': 'Termination date must be a valid date',
    }),
  }),
};