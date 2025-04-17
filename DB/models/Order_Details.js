import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Order_Details = sequelize.define('Order_Details', {
    order_line_number: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: DataTypes.DATEONLY,
    time: DataTypes.TIME,
    quantity: DataTypes.INTEGER,
  }, {
    tableName: 'order_details',
    timestamps: false,
  });

  Order_Details.associate = models => {
    Order_Details.belongsTo(models.Order,   { foreignKey: 'order_id',   as: 'order' });
    Order_Details.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  };

  return Order_Details;
};