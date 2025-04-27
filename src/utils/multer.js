// Multer configuration for file uploads
import multer from 'multer';
import path from 'path';
import { nanoid } from 'nanoid';
import { AppError } from '../middleware/catchError.js';

// Configure storage
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueFileName = nanoid(10) + path.extname(file.originalname);
    cb(null, uniqueFileName);
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.mimetype.startsWith('image')) {
    return cb(new AppError('Only image files are allowed!', 400), false);
  }
  cb(null, true);
};

// Create multer upload instance
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB max file size
});

// Middleware for handling single image upload
export const uploadSingleImage = (fieldName) => upload.single(fieldName);

// Middleware for handling multiple image uploads
export const uploadMultipleImages = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);

// Middleware for handling multiple fields with multiple files
export const uploadFields = (fields) => upload.fields(fields);