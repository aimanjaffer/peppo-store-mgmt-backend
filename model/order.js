const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Order extends Model {}
Order.init({
  transaction_amount: DataTypes.INTEGER,
  order_status: DataTypes.STRING,
}, { sequelize, modelName: 'Order' });

module.exports = Order;