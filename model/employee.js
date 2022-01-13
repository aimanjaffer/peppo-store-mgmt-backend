const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Employee extends Model {}
Employee.init({
  employee_name: DataTypes.STRING,
  employee_role: DataTypes.STRING,
  employee_phone: DataTypes.STRING,
  employee_email: DataTypes.STRING,
  employee_password: DataTypes.STRING,
  auth_token: DataTypes.STRING,
}, { sequelize, modelName: 'Employee' });

module.exports = Employee;