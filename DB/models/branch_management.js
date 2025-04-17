import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Branch_Management = sequelize.define('Branch_Management', {
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
  }, {
    tableName: 'branch_management',
    timestamps: false,
  });

  Branch_Management.associate = models => {
    Branch_Management.belongsTo(models.Employee, { foreignKey: 'identity_card', as: 'manager' });
    Branch_Management.belongsTo(models.Branch,   { foreignKey: 'branch_id',     as: 'branch' });
  };

  return Branch_Management;
};
