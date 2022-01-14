const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class OrderItem extends Model {}
OrderItem.init({
  quantity: DataTypes.INTEGER
}, { sequelize, modelName: 'OrderItem' });

module.exports = OrderItem;