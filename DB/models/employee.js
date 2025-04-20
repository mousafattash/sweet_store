import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Employee = sequelize.define('Employee', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'people',
        key: 'id'
      }
    },
    identity_card: {
      type: DataTypes.INTEGER,
      unique: true,
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
    Employee.belongsTo(models.People,  { foreignKey: 'id', as: 'person', onDelete: 'CASCADE' });
    Employee.belongsTo(models.Branch,  { foreignKey: 'branch_id',    as: 'branch' });
    Employee.belongsTo(models.Role,    { foreignKey: 'role_id',      as: 'role' });
    Employee.hasMany(models.Employee_Shift,      { foreignKey: 'id', as: 'shifts' });
    Employee.hasMany(models.Branch_Management,   { foreignKey: 'id', as: 'managements' });
    Employee.belongsToMany(models.Order, { through: models.Works_On, foreignKey: 'id', otherKey: 'order_id', as: 'ordersWorked' });
  };

  return Employee;
};
