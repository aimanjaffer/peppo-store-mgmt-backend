const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Order = require("./order");
class Customer extends Model {}
Customer.init({
  customer_name: DataTypes.STRING,
  customer_phone: DataTypes.STRING,
  customer_email: DataTypes.STRING
}, { sequelize, modelName: 'Customer' });
Customer.hasMany(Order);
Order.belongsTo(Customer);
module.exports = Customer;