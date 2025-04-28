import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Employee_Shift = sequelize.define('Employee_Shift', {
    date: DataTypes.DATEONLY,
    start_time: DataTypes.TIME,
    end_time: DataTypes.TIME,
  }, {
    tableName: 'employee_shift',
    timestamps: false,
  });

  Employee_Shift.associate = models => {
    Employee_Shift.belongsTo(models.Employee, { foreignKey: 'identity_card', as: 'employee' });
    Employee_Shift.belongsTo(models.Branch,   { foreignKey: 'branch_id',     as: 'branch' });
  };

  return Employee_Shift;
};
