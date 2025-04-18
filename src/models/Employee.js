import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  identity_card: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  hire_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  termination_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  hourly_wage: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  branch_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'branches',
      key: 'branch_id'
    }
  }
}, {
  tableName: 'employees',
  timestamps: true
});

export default Employee; 