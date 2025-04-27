// Cloudinary configuration and utility functions
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { AppError } from '../middleware/catchError.js';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file to Cloudinary
 * @param {String} filePath - Path to the file to upload
 * @param {String} folder - Folder to upload to in Cloudinary
 * @returns {Promise<Object>} - Cloudinary upload response
 */
export const uploadToCloudinary = async (filePath, folder = 'sweet_store') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
    });
    return result;
  } catch (error) {
    throw new AppError(`Error uploading to Cloudinary: ${error.message}`, 500);
  }
};

/**
 * Deletes a file from Cloudinary
 * @param {String} publicId - Public ID of the file to delete
 * @returns {Promise<Object>} - Cloudinary delete response
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new AppError(`Error deleting from Cloudinary: ${error.message}`, 500);
  }
};

export default cloudinary;