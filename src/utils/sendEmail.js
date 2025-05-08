// Email sending utility functions
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { AppError } from '../middleware/catchError.js';

dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
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