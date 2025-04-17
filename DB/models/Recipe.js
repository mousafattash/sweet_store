import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Recipe = sequelize.define('Recipe', {
    quantity_needed: DataTypes.DECIMAL,
    unit_of_measure: DataTypes.STRING,
  }, {
    tableName: 'recipe',
    timestamps: false,
  });

  Recipe.associate = models => {
    Recipe.belongsTo(models.Product,      { foreignKey: 'product_id',       as: 'product' });
    Recipe.belongsTo(models.Raw_Material,{ foreignKey: 'raw_material_id',  as: 'rawMaterial' });
  };

  return Recipe;
};