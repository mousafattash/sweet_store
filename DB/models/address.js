import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Address = sequelize.define('Address', {
    address_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: DataTypes.STRING,
    country: DataTypes.STRING,
    address_line: DataTypes.STRING,
  }, {
    tableName: 'address',
    timestamps: false,
  });

  Address.associate = (models) => {
    Address.belongsTo(models.People, { foreignKey: 'id',      as: 'person' });
  };

  return Address;
};
