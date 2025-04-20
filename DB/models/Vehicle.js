import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Vehicle = sequelize.define('Vehicle', {
    vin:              DataTypes.STRING,
    plate_number:     DataTypes.STRING,
    make:             DataTypes.STRING,
    model:            DataTypes.STRING,
    year:             DataTypes.INTEGER,
    mileage:          DataTypes.INTEGER,
    acquisition_type: DataTypes.STRING,
    acquisition_date: DataTypes.DATE,
    purchase_price:   DataTypes.DECIMAL,
    notes:            DataTypes.TEXT,
  }, {
    tableName: 'vehicle',
    timestamps: false,
  });

  Vehicle.associate = (models) => {
    Vehicle.belongsTo(models.Agency,          { foreignKey: 'org_id',    as: 'agency' });
    Vehicle.hasMany(models.Vehicle_Rental,    { foreignKey: 'vehicle_id', as: 'rentals' });
  };

  return Vehicle;
};