import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Vendor = sequelize.define('Vendor', {
    vendor_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vendor_name: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    country: DataTypes.STRING,
  }, {
    tableName: 'vendor',
    timestamps: false,
  });

  Vendor.associate = models => {
    Vendor.hasMany(models.Raw_Material, { foreignKey: 'vendor_id', as: 'materials' });
    Vendor.hasMany(models.Is_Purchased, { foreignKey: 'vendor_id', as: 'purchases' });
  };

  return Vendor;
};
