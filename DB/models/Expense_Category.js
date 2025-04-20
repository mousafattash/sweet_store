import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Expense_Category = sequelize.define('Expense_Category', {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
  }, {
    tableName: 'expense_category',
    timestamps: false,
  });

  Expense_Category.associate = models => {
    Expense_Category.hasMany(models.Branch_Expenses, { foreignKey: 'category_id', as: 'expenses' });
  };

  return Expense_Category;
};