import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Is_Purchased = sequelize.define('Is_Purchased', {
    quantity: DataTypes.DECIMAL,
    date: DataTypes.DATE,
    unit_price: DataTypes.DECIMAL,
  }, {
    tableName: 'is_purchased',
    timestamps: false,
  });

  Is_Purchased.associate = models => {
    Is_Purchased.belongsTo(models.Raw_Material, { foreignKey: 'raw_material_id', as: 'rawMaterial' });
    Is_Purchased.belongsTo(models.Vendor,       { foreignKey: 'vendor_id',       as: 'vendor' });
  };

  return Is_Purchased;
};