import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Raw_Material = sequelize.define('Raw_Material', {
    raw_material_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    material_name: DataTypes.STRING,
    last_updated: DataTypes.DATE,
    description: DataTypes.TEXT,
  }, {
    tableName: 'raw_material',
    timestamps: false,
  });

  Raw_Material.associate = models => {
    Raw_Material.belongsTo(models.Vendor,         { foreignKey: 'vendor_id',        as: 'vendor' });
    Raw_Material.hasMany(models.Is_Purchased,     { foreignKey: 'raw_material_id',  as: 'purchases' });
    Raw_Material.hasMany(models.Inventory,        { foreignKey: 'raw_material_id',  as: 'inventoryRecords' });
    Raw_Material.belongsToMany(models.Warehouse,  { through: models.Warehouse_Have_Raw_Material, foreignKey: 'raw_material_id', otherKey: 'warehouse_id', as: 'warehouses' });
    Raw_Material.belongsToMany(models.Product,    { through: models.Recipe,         foreignKey: 'raw_material_id', otherKey: 'product_id',   as: 'products' });
  };

  return Raw_Material;
};
