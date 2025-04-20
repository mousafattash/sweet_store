import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Address = sequelize.define('Address', {
    person_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'people_or_organization',
        key: 'id'
      }
    },
    type: DataTypes.STRING,
    country: DataTypes.STRING,
    address: DataTypes.STRING,
  }, {
    tableName: 'address',
    timestamps: false,
  });

  Address.associate = (models) => {
    Address.belongsTo(models.People, { 
      foreignKey: 'person_id',
      as: 'person' 
    });
  };

  return Address;
};
