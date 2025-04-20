import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Customer = sequelize.define('Customer', {
        customer_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        registration_date: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      }, {
        tableName: 'customer',
        timestamps: false,
      });
      

  Customer.associate = (models) => {
    Customer.belongsTo(models.People, { foreignKey: 'customer_id', as: 'person', onDelete: 'CASCADE' });
    Customer.hasMany(models.Order,            { foreignKey: 'customer_id', as: 'orders' });
    Customer.hasMany(models.Shipping_Details, { foreignKey: 'order_id',    as: 'shippingRecords' });
    Customer.hasMany(models.Payment_Details,  { foreignKey: 'order_id',    as: 'paymentRecords' });
  };

  return Customer;
};