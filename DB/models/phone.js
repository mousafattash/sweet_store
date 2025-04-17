import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Phone = sequelize.define('Phone', {
    phone_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: DataTypes.STRING,
    number: DataTypes.STRING,
  }, {
    tableName: 'phone',
    timestamps: false,
  });

  Phone.associate = (models) => {
    Phone.belongsTo(models.People, { foreignKey: 'owner_id', as: 'owner', onDelete: 'CASCADE' });
  };

  return Phone;
};
