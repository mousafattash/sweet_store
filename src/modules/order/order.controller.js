// Order controller functions
import models from '../../../DB/models/index.js';
import { AppError } from '../../middleware/catchError.js';

/**
 * Get all orders
 */
export const getAllOrders = async (req, res) => {
  // For customers, only show their own orders
  // For employees, show all orders
  let orders;
  
  if (req.user.Customer) {
    // User is a customer, only show their orders
    orders = await models.Order.findAll({
      where: { customer_id: req.user.Customer.customer_id },
      include: [
        { model: models.Order_Details, as: 'details', include: [{ model: models.Product, as: 'product' }] },
        { model: models.Shipping_Details, as: 'shippings' },
        { model: models.Payment_Details, as: 'payments' },
      ],
    });
  } else {
    // User is an employee, show all orders
    orders = await models.Order.findAll({
      include: [
        { model: models.Customer, as: 'customer', include: [{ model: models.People }] },
        { model: models.Order_Details, as: 'details', include: [{ model: models.Product, as: 'product' }] },
        { model: models.Shipping_Details, as: 'shippings' },
        { model: models.Payment_Details, as: 'payments' },
      ],
    });
  }
  
  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders,
    },
  });
};

/**
 * Get order by ID
 */
export const getOrderById = async (req, res, next) => {
  const { id } = req.params;
  
  // Find order with all related data
  const order = await models.Order.findByPk(id, {
    include: [
      { model: models.Customer, as: 'customer', include: [{ model: models.People }] },
      { model: models.Order_Details, as: 'details', include: [{ model: models.Product, as: 'product' }] },
      { model: models.Shipping_Details, as: 'shippings' },
      { model: models.Payment_Details, as: 'payments' },
    ],
  });
  
  if (!order) {
    return next(new AppError('Order not found', 404));
  }
  
  // Check if customer is accessing their own order
  if (req.user.Customer && order.customer_id !== req.user.Customer.customer_id) {
    return next(new AppError('You do not have permission to view this order', 403));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
};

/**
 * Create new order
 */
export const createOrder = async (req, res, next) => {
  const { total_amount, status, orderItems, shipping_address, shipping_city, shipping_postal_code, shipping_country } = req.body;
  
  // Check if user is a customer
  if (!req.user.Customer) {
    return next(new AppError('Only customers can create orders', 403));
  }
  
  // Create order in transaction
  const result = await models.sequelize.transaction(async (t) => {
    // Create order
    const order = await models.Order.create({
      customer_id: req.user.Customer.customer_id,
      discount: 0, // Default values, can be updated later
      address: shipping_address || '',
      deposit_amount: total_amount,
      deposit_paid: 0, // Initially no deposit paid
    }, { transaction: t });
    
    // Create order details for each item
    const orderDetails = [];
    for (const item of orderItems) {
      const detail = await models.Order_Details.create({
        order_id: order.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        date: new Date(),
        time: new Date().toTimeString().split(' ')[0],
      }, { transaction: t });
      
      orderDetails.push(detail);
    }
    
    // Create shipping details if provided
    let shipping = null;
    if (shipping_address) {
      shipping = await models.Shipping_Details.create({
        order_id: order.order_id,
        address: shipping_address,
        city: shipping_city || '',
        postal_code: shipping_postal_code || '',
        country: shipping_country || '',
        status: status || 'pending',
      }, { transaction: t });
    }
    
    return { order, orderDetails, shipping };
  });
  
  res.status(201).json({
    status: 'success',
    data: {
      order: result.order,
      orderDetails: result.orderDetails,
      shipping: result.shipping,
    },
  });
};

/**
 * Update order status
 */
export const updateOrder = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  
  // Find order
  const order = await models.Order.findByPk(id);
  
  if (!order) {
    return next(new AppError('Order not found', 404));
  }
  
  // Check if customer is updating their own order
  if (req.user.Customer && order.customer_id !== req.user.Customer.customer_id) {
    return next(new AppError('You do not have permission to update this order', 403));
  }
  
  // Update shipping status if exists
  const shipping = await models.Shipping_Details.findOne({
    where: { order_id: id },
  });
  
  if (shipping) {
    await shipping.update({ status });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      order,
      shipping,
    },
  });
};

/**
 * Cancel order
 */
export const cancelOrder = async (req, res, next) => {
  const { id } = req.params;
  
  // Find order
  const order = await models.Order.findByPk(id);
  
  if (!order) {
    return next(new AppError('Order not found', 404));
  }
  
  // Check if customer is cancelling their own order
  if (req.user.Customer && order.customer_id !== req.user.Customer.customer_id) {
    return next(new AppError('You do not have permission to cancel this order', 403));
  }
  
  // Update shipping status if exists
  const shipping = await models.Shipping_Details.findOne({
    where: { order_id: id },
  });
  
  if (shipping) {
    await shipping.update({ status: 'cancelled' });
  }
  
  res.status(200).json({
    status: 'success',
    message: 'Order cancelled successfully',
  });
};