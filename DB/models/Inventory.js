import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Inventory = sequelize.define('Inventory', {
    quantity: DataTypes.DECIMAL,
    last_updated: DataTypes.DATE,
  }, {
    tableName: 'inventory',
    timestamps: false,
  });

  Inventory.associate = models => {
    Inventory.belongsTo(models.Branch,      { foreignKey: 'branch_id',       as: 'branch' });
    Inventory.belongsTo(models.Raw_Material,{ foreignKey: 'raw_material_id', as: 'rawMaterial' });
  };

  return Inventory;
};