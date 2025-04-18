import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserAccount = sequelize.define('UserAccount', {
  people_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'people_organizations',
      key: 'id'
    }
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'user_accounts',
  timestamps: true
});

export default UserAccount; 