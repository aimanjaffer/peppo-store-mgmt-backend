const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Order = require('./order');
const Product = require('./product');
class OrderItem extends Model {}
OrderItem.init({
  quantity: DataTypes.INTEGER
}, { sequelize, modelName: 'OrderItem' });
Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);
Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);
module.exports = OrderItem;