import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User_Roles = sequelize.define('User_Roles', {
    start_date: DataTypes.DATE,
    end_date:   DataTypes.DATE,
  }, {
    tableName: 'user_roles',
    timestamps: false,
  });

  User_Roles.associate = (models) => {
    User_Roles.belongsTo(models.UserAccount, { foreignKey: 'user_id', as: 'user' });
    User_Roles.belongsTo(models.Role,        { foreignKey: 'role_id', as: 'role' });
  };

  return User_Roles;
};