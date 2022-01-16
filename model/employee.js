const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Employee extends Model {}
Employee.init({
  imgUrl: DataTypes.STRING,
  name: DataTypes.STRING,
  role: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  authToken: DataTypes.STRING,
}, { sequelize, modelName: 'Employee' });

module.exports = Employee;