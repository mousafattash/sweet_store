import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Payment_Details = sequelize.define('Payment_Details', {
    payment_date: DataTypes.DATE,
    payment_method: DataTypes.STRING,
    deposit_amount: DataTypes.DECIMAL,
    deposit_paid: DataTypes.DECIMAL,
    payment_type: DataTypes.STRING,
  }, {
    tableName: 'payment_details',
    timestamps: false,
  });

  Payment_Details.associate = models => {
    Payment_Details.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
  };

  return Payment_Details;
};