const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Product extends Model {}
Product.init({
  product_name: DataTypes.STRING,
  brand_id: DataTypes.INTEGER,
  category_id: DataTypes.INTEGER,
  price: DataTypes.INTEGER,
  discount_rate: DataTypes.INTEGER
}, { sequelize, modelName: 'Product' });
sequelize.sync();
module.exports = Product;