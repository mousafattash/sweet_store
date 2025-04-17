import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Role = sequelize.define('Role', {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    description: DataTypes.TEXT,
  }, {
    tableName: 'role',
    timestamps: false,
  });

  Role.associate = (models) => {
    Role.hasMany(models.Employee, { foreignKey: 'role_id', as: 'employees' });
  };

  return Role;
};