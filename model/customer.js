const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Order = require("./order");
class Customer extends Model {}
Customer.init({
  name: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: DataTypes.STRING
}, { sequelize, modelName: 'Customer' });

module.exports = Customer;