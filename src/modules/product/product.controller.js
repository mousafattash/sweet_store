// Product controller functions
import models from '../../../DB/models/index.js';
import { AppError } from '../../middleware/catchError.js';

/**
 * Get all products
 */
export const getAllProducts = async (req, res) => {
  const products = await models.Product.findAll();
  
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
};

/**
 * Get product by ID
 */
export const getProductById = async (req, res) => {
  const { id } = req.params;
  
  const product = await models.Product.findByPk(id, {
    include: [{ model: models.Raw_Material, as: 'materials' }],
  });
  
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
};

/**
 * Create new product
 */
export const createProduct = async (req, res) => {
  const { product_name, description, base_price } = req.body;
  
  const product = await models.Product.create({
    product_name,
    description,
    base_price,
  });
  
  res.status(201).json({
    status: 'success',
    data: {
      product,
    },
  });
};

/**
 * Update product
 */
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { product_name, description, base_price } = req.body;
  
  const product = await models.Product.findByPk(id);
  
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  
  await product.update({
    product_name: product_name || product.product_name,
    description: description || product.description,
    base_price: base_price || product.base_price,
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
};

/**
 * Delete product
 */
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  
  const product = await models.Product.findByPk(id);
  
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  
  await product.destroy();
  
  res.status(204).json({
    status: 'success',
    data: null,
  });
};