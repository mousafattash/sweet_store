// Authentication middleware
import jwt from 'jsonwebtoken';
import { AppError } from './catchError.js';
import models from '../../DB/models/index.js';

/**
 * Verifies JWT token and attaches user to request object
 */
export const authenticate = async (req, res, next) => {
  try {
    // 1) Check if token exists
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Not authenticated. Please log in', 401));
    }
    
    const token = authHeader.split(' ')[1];
    
    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3) Check if user still exists
    const user = await models.People.findByPk(decoded.id, {
      include: [
        { model: models.Customer, required: false },
        { model: models.Employee, required: false }
      ]
    });
    
    if (!user) {
      return next(new AppError('User no longer exists', 401));
    }
    
    // 4) Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired. Please log in again', 401));
    }
    next(error);
  }
};

export const restrictTo = (...types) => {
  return (req, res, next) => {
    // Check if user has employee record and required role
    if (types.includes('employee') && req.user.Employee) {
      return next();
    }
    
    // Check if user has customer record
    if (types.includes('customer') && req.user.Customer) {
      return next();
    }
    
    return next(new AppError('You do not have permission to perform this action', 403));
  };
};