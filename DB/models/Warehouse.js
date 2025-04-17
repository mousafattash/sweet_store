import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Warehouse = sequelize.define('Warehouse', {
    warehouse_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phone_number: DataTypes.STRING,
    address: DataTypes.STRING,
  }, {
    tableName: 'warehouse',
    timestamps: false,
  });

  Warehouse.associate = models => {
    Warehouse.hasMany(models.Warehouse_Have_Raw_Material, { foreignKey: 'warehouse_id', as: 'stockEntries' });
  };

  return Warehouse;
};
