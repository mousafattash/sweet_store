import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ModelName = sequelize.define('ModelName', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // Required field with validation
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    // Field with default value
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
      allowNull: false
    },
    // Decimal field with precision
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        min: 0
      }
    },
    // Date field
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'table_name',
    timestamps: true, // Enables created_at and updated_at
    indexes: [
      {
        unique: true,
        fields: ['name']
      },
      {
        fields: ['status']
      }
    ]
  });

  // Define associations
  ModelName.associate = (models) => {
    ModelName.belongsTo(models.OtherModel, {
      foreignKey: {
        name: 'other_model_id',
        allowNull: false
      },
      as: 'otherModel'
    });
  };

  return ModelName;
}; 