import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Branch_Expenses = sequelize.define('Branch_Expenses', {
    expense_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: DataTypes.DECIMAL,
    date: DataTypes.DATE,
    description: DataTypes.TEXT,
  }, {
    tableName: 'branch_expenses',
    timestamps: false,
  });

  Branch_Expenses.associate = models => {
    Branch_Expenses.belongsTo(models.Branch,          { foreignKey: 'branch_id',     as: 'branch' });
    Branch_Expenses.belongsTo(models.Expense_Category, { foreignKey: 'category_id',  as: 'category' });
  };

  return Branch_Expenses;
};
