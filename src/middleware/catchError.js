// Error handling middleware

/**
 * Wraps async controller functions to catch errors and pass them to the global error handler
 * @param {Function} fn - The async controller function to wrap
 * @returns {Function} - Express middleware function
 */
export const catchError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * Custom error class with status code
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}