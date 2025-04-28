import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Role = sequelize.define('Role', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true, // Make name the primary key
    },
    description: DataTypes.TEXT,
  }, {
    tableName: 'role',
    timestamps: false,
  });

  Role.associate = (models) => {
    // 1) One-to-many with Employee
    Role.hasMany(models.Employee, {
      foreignKey: 'role_id',
      as: 'employees',
    });

    // 2) Many-to-many with UserAccount
    Role.belongsToMany(models.UserAccount, {
      through: models.User_Roles,
      foreignKey: 'role_id',
      otherKey: 'user_id',
      as: 'users',
    });

    // 3) Many-to-many with Permission
    Role.belongsToMany(models.Permission, {
      through: models.Role_Permissions,
      foreignKey: 'role_id',
      otherKey: 'permission_id',
      as: 'permissions',
    });
  };

  return Role;
};