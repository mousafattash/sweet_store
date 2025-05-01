// Email sending utility functions
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { AppError } from '../middleware/catchError.js';

dotenv.config();

/**
 * Creates a nodemailer transporter
 * @returns {Object} - Nodemailer transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Sends an email
 * @param {Object} options - Email options
 * @param {String} options.to - Recipient email
 * @param {String} options.subject - Email subject
 * @param {String} options.text - Plain text email body
 * @param {String} options.html - HTML email body
 * @returns {Promise<Object>} - Email send result
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Sweet Store <noreply@sweetstore.com>',
      to,
      subject,
      text,
      html,
    };
    
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new AppError(`Error sending email: ${error.message}`, 500);
  }
};

/**
 * Sends a welcome email to a new user
 * @param {String} email - User's email
 * @param {String} name - User's name
 * @returns {Promise<Object>} - Email send result
 */
export const sendWelcomeEmail = async (email, name) => {
  const subject = 'Welcome to Sweet Store!';
  const text = `Hello ${name},\n\nWelcome to Sweet Store! We're excited to have you on board.\n\nBest regards,\nThe Sweet Store Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Sweet Store!</h2>
      <p>Hello ${name},</p>
      <p>We're excited to have you on board. Thank you for joining our sweet community!</p>
      <p>Best regards,<br>The Sweet Store Team</p>
    </div>
  `;
  
  return sendEmail({ to: email, subject, text, html });
};

/**
 * Sends a verification email with code
 * @param {String} email - User's email
 * @param {String} name - User's name
 * @param {String} code - Verification code
 * @returns {Promise<Object>} - Email send result
 */
export const sendVerificationEmail = async (email, name, code) => {
  const subject = 'Verify Your Sweet Store Account';
  const text = `Hello ${name},\n\nYour verification code is: ${code}\n\nPlease use this code to verify your account.\n\nBest regards,\nThe Sweet Store Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify Your Sweet Store Account</h2>
      <p>Hello ${name},</p>
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>Please use this code to verify your account.</p>
      <p>Best regards,<br>The Sweet Store Team</p>
    </div>
  `;
  
  return sendEmail({ to: email, subject, text, html });
};

/**
 * Sends a password reset email
 * @param {String} email - User's email
 * @param {String} resetToken - Password reset token
 * @param {String} resetUrl - Password reset URL
 * @returns {Promise<Object>} - Email send result
 */
export const sendPasswordResetEmail = async (email, resetToken, resetUrl) => {
  const subject = 'Password Reset Request';
  const text = `You requested a password reset. Please use the following token: ${resetToken}\n\nOr click this link: ${resetUrl}\n\nIf you didn't request this, please ignore this email.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Please use the following token:</p>
      <p><strong>${resetToken}</strong></p>
      <p>Or click this link: <a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;
  
  return sendEmail({ to: email, subject, text, html });
};