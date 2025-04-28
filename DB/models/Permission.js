import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Permission = sequelize.define('Permission', {
    permission: DataTypes.STRING,
  }, {
    tableName: 'permission',
    timestamps: false,
  });

  Permission.associate = (models) => {
    Permission.belongsToMany(models.Role, { through: models.Role_Permissions, foreignKey: 'permission_id', otherKey: 'role_id', as: 'roles' });
  };

  return Permission;
};