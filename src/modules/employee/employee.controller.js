// Employee controller functions
import models from '../../../DB/models/index.js';
import { AppError } from '../../middleware/catchError.js';
import bcrypt from 'bcryptjs';

/**
 * Get all employees
 */
export const getAllEmployees = async (req, res) => {
  const employees = await models.Employee.findAll({
    include: [
      { model: models.People, as: 'person' },
      { model: models.Branch, as: 'branch' },
      { model: models.Role, as: 'role' }
    ]
  });
  
  res.status(200).json({
    status: 'success',
    results: employees.length,
    data: {
      employees,
    },
  });
};

/**
 * Get employee by ID
 */
export const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  
  const employee = await models.Employee.findByPk(id, {
    include: [
      { model: models.People, as: 'person' },
      { model: models.Branch, as: 'branch' },
      { model: models.Role, as: 'role' },
      { model: models.Employee_Shift, as: 'shifts' }
    ]
  });
  
  if (!employee) {
    throw new AppError('Employee not found', 404);
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      employee,
    },
  });
};

/**
 * Create a new employee
 */
export const createEmployee = async (req, res) => {
  const { 
    identity_card, 
    first_name, 
    last_name, 
    email, 
    password, 
    phone_number,
    address,
    hire_date, 
    hourly_wage, 
    branch_id,
    role_id 
  } = req.body;
  
  // Check if person already exists
  const existingPerson = await models.People.findOne({ where: { identity_card } });
  if (existingPerson) {
    throw new AppError('Person with this identity card already exists', 400);
  }
  
  // Start a transaction
  const transaction = await models.sequelize.transaction();
  
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create person record
    const person = await models.People.create({
      identity_card,
      first_name,
      last_name,
      email,
      password: hashedPassword,
      type: 'employee'
    }, { transaction });
    
    // Create phone record if provided
    if (phone_number) {
      await models.Phone.create({
        identity_card,
        phone_number
      }, { transaction });
    }
    
    // Create address record if provided
    if (address) {
      await models.Address.create({
        identity_card,
        ...address
      }, { transaction });
    }
    
    // Create employee record
    const employee = await models.Employee.create({
      identity_card,
      hire_date: hire_date || new Date(),
      hourly_wage,
      branch_id,
      role_id
    }, { transaction });
    
    // Commit transaction
    await transaction.commit();
    
    res.status(201).json({
      status: 'success',
      data: {
        employee,
      },
    });
  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    throw new AppError(error.message, 400);
  }
};

/**
 * Update an employee
 */
export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { 
    first_name, 
    last_name, 
    email, 
    phone_number,
    address,
    hourly_wage, 
    branch_id,
    role_id,
    termination_date 
  } = req.body;
  
  // Find the employee
  const employee = await models.Employee.findByPk(id);
  if (!employee) {
    throw new AppError('Employee not found', 404);
  }
  
  // Start a transaction
  const transaction = await models.sequelize.transaction();
  
  try {
    // Update person details if provided
    if (first_name || last_name || email) {
      await models.People.update(
        { first_name, last_name, email },
        { where: { identity_card: id }, transaction }
      );
    }
    
    // Update phone if provided
    if (phone_number) {
      const existingPhone = await models.Phone.findOne({ 
        where: { identity_card: id }
      });
      
      if (existingPhone) {
        await models.Phone.update(
          { phone_number },
          { where: { identity_card: id }, transaction }
        );
      } else {
        await models.Phone.create({
          identity_card: id,
          phone_number
        }, { transaction });
      }
    }
    
    // Update address if provided
    if (address) {
      const existingAddress = await models.Address.findOne({ 
        where: { identity_card: id }
      });
      
      if (existingAddress) {
        await models.Address.update(
          address,
          { where: { identity_card: id }, transaction }
        );
      } else {
        await models.Address.create({
          identity_card: id,
          ...address
        }, { transaction });
      }
    }
    
    // Update employee details
    await employee.update({
      hourly_wage: hourly_wage !== undefined ? hourly_wage : employee.hourly_wage,
      branch_id: branch_id !== undefined ? branch_id : employee.branch_id,
      role_id: role_id !== undefined ? role_id : employee.role_id,
      termination_date: termination_date !== undefined ? termination_date : employee.termination_date
    }, { transaction });
    
    // Commit transaction
    await transaction.commit();
    
    // Get updated employee with associations
    const updatedEmployee = await models.Employee.findByPk(id, {
      include: [
        { model: models.People, as: 'person' },
        { model: models.Branch, as: 'branch' },
        { model: models.Role, as: 'role' }
      ]
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        employee: updatedEmployee,
      },
    });
  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    throw new AppError(error.message, 400);
  }
};

/**
 * Delete an employee
 */
export const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  
  // Find the employee
  const employee = await models.Employee.findByPk(id);
  if (!employee) {
    throw new AppError('Employee not found', 404);
  }
  
  // Check for associated shifts
  const shifts = await models.Employee_Shift.findAll({ where: { employee_id: id } });
  if (shifts.length > 0) {
    throw new AppError('Cannot delete employee with associated shifts. Please reassign or delete the shifts first.', 400);
  }
  
  // Check for associated orders (if employee is assigned to orders)
  const orders = await models.Order.findAll({ where: { employee_id: id } });
  if (orders.length > 0) {
    throw new AppError('Cannot delete employee with associated orders. Please reassign the orders first.', 400);
  }
  
  // Start a transaction
  const transaction = await models.sequelize.transaction();
  
  try {
    // Delete employee record
    await employee.destroy({ transaction });
    
    // Delete person record (will cascade to phone and address)
    await models.People.destroy({
      where: { identity_card: id },
      transaction
    });
    
    // Commit transaction
    await transaction.commit();
    
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    throw new AppError(error.message, 400);
  }
};