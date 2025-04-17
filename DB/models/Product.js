import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Product = sequelize.define('Product', {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_name: DataTypes.STRING,
    description: DataTypes.TEXT,
    base_price: DataTypes.DECIMAL,
  }, {
    tableName: 'product',
    timestamps: false,
  });

  Product.associate = models => {
    Product.hasMany(models.Order_Details,       { foreignKey: 'product_id',         as: 'orderLines' });
    Product.belongsToMany(models.Raw_Material,  { through: models.Recipe,            foreignKey: 'product_id', otherKey: 'raw_material_id', as: 'materials' });
  };

  return Product;
};