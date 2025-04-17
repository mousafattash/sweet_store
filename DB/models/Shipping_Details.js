import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Shipping_Details = sequelize.define('Shipping_Details', {
    shipping_date: DataTypes.DATE,
    shipping_method: DataTypes.STRING,
    tracking_number: DataTypes.STRING,
    estimated_delivery: DataTypes.DATE,
    shipping_status: DataTypes.STRING,
  }, {
    tableName: 'shipping_details',
    timestamps: false,
  });

  Shipping_Details.associate = models => {
    Shipping_Details.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
  };

  return Shipping_Details;
};