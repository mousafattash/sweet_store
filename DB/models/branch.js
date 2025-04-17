import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Branch = sequelize.define('Branch', {
    branch_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
  }, {
    tableName: 'branch',
    timestamps: false,
  });

  Branch.associate = models => {
    Branch.hasMany(models.Employee_Shift,     { foreignKey: 'branch_id',     as: 'shifts' });
    Branch.hasMany(models.Branch_Management,  { foreignKey: 'branch_id',     as: 'managements' });
    Branch.hasMany(models.Branch_Expenses,    { foreignKey: 'branch_id',     as: 'expenses' });
    Branch.hasMany(models.Inventory,          { foreignKey: 'branch_id',     as: 'inventories' });
  };

  return Branch;
};
