const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Order extends Model {}
Order.init({
  customer_id: DataTypes.INTEGER,
  store_id: DataTypes.INTEGER,
  transaction_amount: DataTypes.INTEGER,
}, { sequelize, modelName: 'Order' });
sequelize.sync();
module.exports = Order;