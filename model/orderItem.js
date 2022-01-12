const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class OrderItem extends Model {}
OrderItem.init({
  order_id: DataTypes.INTEGER,
  product_id: DataTypes.INTEGER,
  quantity: DataTypes.INTEGER
}, { sequelize, modelName: 'OrderItemItem' });
sequelize.sync();
module.exports = OrderItem;