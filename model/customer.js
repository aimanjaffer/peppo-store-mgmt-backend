const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Customer extends Model {}
Customer.init({
  customer_name: DataTypes.STRING,
  customer_phone: DataTypes.STRING,
  customer_email: DataTypes.STRING
}, { sequelize, modelName: 'Customer' });
sequelize.sync();
module.exports = Customer;