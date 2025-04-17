import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Works_On = sequelize.define('Works_On', {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    identity_card: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  }, {
    tableName: 'works_on',
    timestamps: false,
  });

  Works_On.associate = models => {
    Works_On.belongsTo(models.Order,    { foreignKey: 'order_id',      as: 'order' });
    Works_On.belongsTo(models.Employee, { foreignKey: 'identity_card', as: 'employee' });
  };

  return Works_On;
};
