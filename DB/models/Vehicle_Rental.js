import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Vehicle_Rental = sequelize.define('Vehicle_Rental', {
    rental_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    start_date: DataTypes.DATE,
    end_date:   DataTypes.DATE,
    daily_rate: DataTypes.DECIMAL,
  }, {
    tableName: 'vehicle_rental',
    timestamps: false,
  });

  Vehicle_Rental.associate = (models) => {
    Vehicle_Rental.belongsTo(models.Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });
    Vehicle_Rental.belongsTo(models.Agency,  { foreignKey: 'agency_id',  as: 'agency'  });
  };

  return Vehicle_Rental;
};