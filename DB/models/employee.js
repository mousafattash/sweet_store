import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Employee = sequelize.define('Employee', {
    identity_card: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    hire_date: DataTypes.DATE,
    termination_date: DataTypes.DATE,
    hourly_wage: DataTypes.DECIMAL,
    branch_id: DataTypes.INTEGER,
  }, {
    tableName: 'employee',
    timestamps: false,
  });

  Employee.associate = (models) => {
    Employee.belongsTo(models.People,  { foreignKey: 'identity_card', as: 'person', onDelete: 'CASCADE' });
    Employee.belongsTo(models.Branch,  { foreignKey: 'branch_id',    as: 'branch' });
    Employee.belongsTo(models.Role,    { foreignKey: 'role_id',      as: 'role' });
    Employee.hasMany(models.Employee_Shift,      { foreignKey: 'identity_card', as: 'shifts' });
    Employee.hasMany(models.Branch_Management,   { foreignKey: 'identity_card', as: 'managements' });
    Employee.belongsToMany(models.Order, { through: models.Works_On, foreignKey: 'identity_card', otherKey: 'order_id', as: 'ordersWorked' });
  };

  return Employee;
};
