import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Warehouse_Have_Raw_Material = sequelize.define('Warehouse_Have_Raw_Material', {}, {
    tableName: 'warehouse_have_raw_material',
    timestamps: false,
  });

  Warehouse_Have_Raw_Material.associate = models => {
    Warehouse_Have_Raw_Material.belongsTo(models.Warehouse,     { foreignKey: 'warehouse_id',     as: 'warehouse' });
    Warehouse_Have_Raw_Material.belongsTo(models.Raw_Material, { foreignKey: 'raw_material_id', as: 'rawMaterial' });
  };

  return Warehouse_Have_Raw_Material;
};