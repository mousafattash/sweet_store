import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Order = sequelize.define('Order', {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    discount: DataTypes.DECIMAL,
    address: DataTypes.STRING,
    deposit_amount: DataTypes.DECIMAL,
    deposit_paid: DataTypes.DECIMAL,
  }, {
    tableName: 'order',
    timestamps: false,
  });

  Order.associate = models => {
    Order.belongsTo(models.Customer,       { foreignKey: 'customer_id',  as: 'customer' });
    Order.hasMany(models.Order_Details,    { foreignKey: 'order_id',     as: 'details' });
    Order.hasMany(models.Shipping_Details, { foreignKey: 'order_id',     as: 'shippings' });
    Order.hasMany(models.Payment_Details,  { foreignKey: 'order_id',     as: 'payments' });
    Order.belongsToMany(models.Employee,   { through: models.Works_On,   foreignKey: 'order_id', otherKey: 'identity_card', as: 'employees' });
  };

  return Order;
};