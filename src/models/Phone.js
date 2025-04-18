import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Phone = sequelize.define('Phone', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  phone_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^\+?[1-9]\d{1,14}$/
    }
  }
}, {
  tableName: 'phones',
  timestamps: true
});

export default Phone; 