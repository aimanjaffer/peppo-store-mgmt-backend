const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require('./product');
class Category extends Model {}
Category.init({
  category_name: DataTypes.STRING
}, { sequelize, modelName: 'Category' });
Category.hasMany(Product);
Product.belongsTo(Category);
module.exports = Category;