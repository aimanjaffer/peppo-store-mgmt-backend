const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require('./product');
class Category extends Model {}
Category.init({
  name: DataTypes.STRING
}, { sequelize, modelName: 'Category' });

module.exports = Category;