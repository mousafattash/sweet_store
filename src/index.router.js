// Main router file that connects all feature modules
import express from 'express';
import userRouter from './modules/user/user.router.js';
import productRouter from './modules/product/product.router.js';
import orderRouter from './modules/order/order.router.js';
import branchRouter from './modules/branch/branch.router.js';
import inventoryRouter from './modules/inventory/inventory.router.js';
import employeeRouter from './modules/employee/employee.router.js';
import vehicleRouter from './modules/vehicle/vehicle.router.js';
import warehouseRouter from './modules/warehouse/warehouse.router.js';
import vendorRouter from './modules/vendor/vendor.router.js';
import rawMaterialRouter from './modules/rawMaterial/rawMaterial.router.js';
import agencyRouter from './modules/agency/agency.router.js';

const router = express.Router();

// Mount feature routers
router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/orders', orderRouter);
router.use('/branches', branchRouter);
router.use('/inventory', inventoryRouter);
router.use('/employees', employeeRouter);
router.use('/vehicles', vehicleRouter);
router.use('/warehouses', warehouseRouter);
router.use('/vendors', vendorRouter);
router.use('/raw-materials', rawMaterialRouter);
router.use('/agencies', agencyRouter);

export default router;