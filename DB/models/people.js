import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const People = sequelize.define('People', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    type: {
      type: DataTypes.ENUM('person','organization'),
      allowNull: false,
      defaultValue: 'person',
    },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'people_or_organization',
    timestamps: false,
  });

  People.associate = (models) => {
    People.hasMany(models.Phone,    { foreignKey: 'owner_id',   as: 'phones' });
    People.hasOne (models.Employee, { foreignKey: 'identity_card', as: 'employee' });
    People.hasOne (models.Customer, { foreignKey: 'customer_id',  as: 'customer' });
    People.hasMany(models.Address,  { foreignKey: 'person_id',   as: 'addresses' });
  };

  return People;
};