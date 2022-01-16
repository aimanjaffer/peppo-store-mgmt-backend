const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class OrderItem extends Model {}
OrderItem.init({
  quantity: DataTypes.INTEGER,
  rating: DataTypes.REAL
}, { sequelize, modelName: 'OrderItem' });

module.exports = OrderItem;