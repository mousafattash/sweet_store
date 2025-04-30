// User controller functions
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import models from '../../../DB/models/index.js';
import { AppError } from '../../middleware/catchError.js';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../../utils/sendEmail.js';

/**
 * Generate JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

/**
 * Register a new user
 */
export const register = async (req, res) => {
  const { first_name, last_name, email, password, type = 'person' } = req.body;
  
  // Check if user already exists
  const existingUser = await models.People.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError('Email already in use', 400);
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);
  
  // Create user in transaction
  const result = await models.sequelize.transaction(async (t) => {
    // Create person record
    const person = await models.People.create({
      first_name,
      last_name,
      email,
      type,
    }, { transaction: t });
    
    // Create customer record
    const customer = await models.Customer.create({
      person_id: person.id,
      password: hashedPassword,
    }, { transaction: t });
    
    return { person, customer };
  });
  
  // Send welcome email
  await sendWelcomeEmail(email, `${first_name} ${last_name}`);
  
  // Generate token
  const token = generateToken(result.person.id);
  
  // Send response
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: {
        id: result.person.id,
        first_name: result.person.first_name,
        last_name: result.person.last_name,
        email: result.person.email,
        type: result.person.type,
      },
    },
  });
};

/**
 * Login user
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  
  // Check if email and password exist
  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }
  
  // Find user
  const person = await models.People.findOne({
    where: { email },
    include: [{ model: models.Customer }],
  });
  
  // Check if user exists and password is correct
  if (!person || !person.Customer || !(await bcrypt.compare(password, person.Customer.password))) {
    throw new AppError('Incorrect email or password', 401);
  }
  
  // Generate token
  const token = generateToken(person.id);
  
  // Send response
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        id: person.id,
        first_name: person.first_name,
        last_name: person.last_name,
        email: person.email,
        type: person.type,
      },
    },
  });
};

/**
 * Get current user profile
 */
export const getProfile = async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: req.user.id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        type: req.user.type,
      },
    },
  });
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res) => {
  const { first_name, last_name, email } = req.body;
  
  // Check if email is already taken
  if (email && email !== req.user.email) {
    const existingUser = await models.People.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }
  }
  
  // Update user
  await req.user.update({
    first_name: first_name || req.user.first_name,
    last_name: last_name || req.user.last_name,
    email: email || req.user.email,
  });
  
  // Send response
  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: req.user.id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        type: req.user.type,
      },
    },
  });
};

/**
 * Change password
 */
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  // Get user with password
  const user = await models.People.findByPk(req.user.id, {
    include: [{ model: models.Customer }],
  });
  
  // Check current password
  if (!(await bcrypt.compare(currentPassword, user.Customer.password))) {
    throw new AppError('Current password is incorrect', 401);
  }
  
  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  
  // Update password
  await user.Customer.update({ password: hashedPassword });
  
  // Generate new token
  const token = generateToken(user.id);
  
  // Send response
  res.status(200).json({
    status: 'success',
    token,
    message: 'Password updated successfully',
  });
};

/**
 * Request password reset
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  // Find user
  const user = await models.People.findOne({
    where: { email },
    include: [{ model: models.Customer }],
  });
  
  if (!user || !user.Customer) {
    throw new AppError('No user found with that email', 404);
  }
  
  // Generate reset token
  const resetToken = Math.random().toString(36).slice(-8).toUpperCase();
  const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  // Hash token and save to database
  const hashedToken = await bcrypt.hash(resetToken, 12);
  await user.Customer.update({
    reset_token: hashedToken,
    reset_token_expires: resetTokenExpires,
  });
  
  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;
  
  try {
    // Send email
    await sendPasswordResetEmail(email, resetToken, resetUrl);
    
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (error) {
    // If email fails, reset the token
    await user.Customer.update({
      reset_token: null,
      reset_token_expires: null,
    });
    
    throw new AppError('Error sending email. Please try again later.', 500);
  }
};

/**
 * Reset password
 */
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  
  // Find user with valid reset token
  const users = await models.People.findAll({
    include: [{
      model: models.Customer,
      where: {
        reset_token_expires: { [models.sequelize.Op.gt]: new Date() },
      },
    }],
  });
  
  // Find user with matching token
  let user = null;
  for (const u of users) {
    if (await bcrypt.compare(token, u.Customer.reset_token)) {
      user = u;
      break;
    }
  }
  
  if (!user) {
    throw new AppError('Token is invalid or has expired', 400);
  }
  
  // Hash new password
  const hashedPassword = await bcrypt.hash(password, 12);
  
  // Update password and clear reset token
  await user.Customer.update({
    password: hashedPassword,
    reset_token: null,
    reset_token_expires: null,
  });
  
  // Generate new token
  const jwtToken = generateToken(user.id);
  
  // Send response
  res.status(200).json({
    status: 'success',
    token: jwtToken,
    message: 'Password reset successful',
  });
};