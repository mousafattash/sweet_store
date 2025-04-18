import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserRole = sequelize.define('UserRole', {
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'roles',
      key: 'role_id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'user_accounts',
      key: 'people_id'
    }
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'user_roles',
  timestamps: true
});

export default UserRole; 