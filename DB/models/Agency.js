// DB/models/Agency.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Agency = sequelize.define('Agency', {
    agency_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact_info: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'agency',
    timestamps: false,
  });

  Agency.associate = (models) => {
    Agency.hasMany(models.Vehicle,         { foreignKey: 'org_id',    as: 'vehicles' });
    Agency.hasMany(models.Vehicle_Rental,  { foreignKey: 'agency_id', as: 'rentals'  });
  };

  return Agency;
};