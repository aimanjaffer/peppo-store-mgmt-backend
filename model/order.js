const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Order extends Model {}
Order.init({
  transactionAmount: DataTypes.REAL,
  orderStatus: DataTypes.STRING,
  paymentStatus: DataTypes.STRING,
  orderRating: DataTypes.REAL,
  deliveryAgentRating: DataTypes.REAL,
  deliveryAgentId: DataTypes.INTEGER
}, { sequelize, modelName: 'Order' });

module.exports = Order;