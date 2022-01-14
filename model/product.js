const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const StoreProduct = require("./storeProduct");
class Product extends Model {}
Product.init({
  product_name: DataTypes.STRING,
  price: DataTypes.INTEGER,
  discount_rate: DataTypes.INTEGER
}, { sequelize, modelName: 'Product' });
Product.hasMany(StoreProduct);
StoreProduct.belongsTo(Product);
module.exports = Product;