const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Product extends Model {}
Product.init({
  name: DataTypes.STRING,
  price: DataTypes.REAL,
  discountRate: DataTypes.REAL,
  rating: DataTypes.REAL
}, { sequelize, modelName: 'Product' });

module.exports = Product;