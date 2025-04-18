import Customer from './Customer.js';
import PeopleOrganization from './PeopleOrganization.js';
import Phone from './Phone.js';
import Role from './Role.js';
import Permission from './Permission.js';
import Employee from './Employee.js';
import Branch from './Branch.js';
import UserAccount from './UserAccount.js';
import UserRole from './UserRole.js';
import RolePermission from './RolePermission.js';

// PeopleOrganization relationships
PeopleOrganization.hasMany(Phone, {
  foreignKey: 'id',
  as: 'phones'
});
Phone.belongsTo(PeopleOrganization, {
  foreignKey: 'id'
});

// Customer - PeopleOrganization relationship
Customer.belongsTo(PeopleOrganization, {
  foreignKey: 'customer_id',
  targetKey: 'id'
});
PeopleOrganization.hasOne(Customer, {
  foreignKey: 'customer_id',
  sourceKey: 'id'
});

// Employee - PeopleOrganization relationship
Employee.belongsTo(PeopleOrganization, {
  foreignKey: 'id',
  targetKey: 'id'
});
PeopleOrganization.hasOne(Employee, {
  foreignKey: 'id',
  sourceKey: 'id'
});

// Branch - Employee relationship
Branch.hasMany(Employee, {
  foreignKey: 'branch_id'
});
Employee.belongsTo(Branch, {
  foreignKey: 'branch_id'
});

// UserAccount - PeopleOrganization relationship
UserAccount.belongsTo(PeopleOrganization, {
  foreignKey: 'people_id',
  targetKey: 'id'
});
PeopleOrganization.hasOne(UserAccount, {
  foreignKey: 'people_id',
  sourceKey: 'id'
});

// Role - Permission relationship (many-to-many)
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'role_id',
  otherKey: 'permission_id'
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permission_id',
  otherKey: 'role_id'
});

// User - Role relationship (many-to-many)
UserAccount.belongsToMany(Role, {
  through: UserRole,
  foreignKey: 'user_id',
  otherKey: 'role_id'
});
Role.belongsToMany(UserAccount, {
  through: UserRole,
  foreignKey: 'role_id',
  otherKey: 'user_id'
});

export {
  Customer,
  PeopleOrganization,
  Phone,
  Role,
  Permission,
  Employee,
  Branch,
  UserAccount,
  UserRole,
  RolePermission
}; 