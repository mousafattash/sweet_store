import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const UserAccount = sequelize.define('UserAccount', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'people',
        key: 'id'
      }
    },
    username:     { type: DataTypes.STRING, unique: true },
    password_hash:{ type: DataTypes.STRING },
    created_at:   { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    last_login:   DataTypes.DATE,
  }, {
    tableName: 'user_account',
    timestamps: false,
  });

  UserAccount.associate = (models) => {
    UserAccount.belongsTo(models.People, { foreignKey: 'people_id', as: 'person' });
    UserAccount.belongsToMany(models.Role, { through: models.User_Roles, foreignKey: 'user_id', otherKey: 'role_id', as: 'roles' });
  };

  return UserAccount;
};