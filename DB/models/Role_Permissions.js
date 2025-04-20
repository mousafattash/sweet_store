// DB/models/Role_Permissions.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Role_Permissions = sequelize.define('Role_Permissions', {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    permission_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  }, {
    tableName: 'role_permissions',
    timestamps: false,
  });

  Role_Permissions.associate = (models) => {
    // Each row belongs to exactly one Role and one Permission
    Role_Permissions.belongsTo(models.Role, {
      foreignKey: 'role_id',
      as: 'role',
      onDelete: 'CASCADE'
    });
    Role_Permissions.belongsTo(models.Permission, {
      foreignKey: 'permission_id',
      as: 'permission',
      onDelete: 'CASCADE'
    });
  };

  return Role_Permissions;
};