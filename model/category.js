const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Category extends Model {}
Category.init({
  category_name: DataTypes.STRING
}, { sequelize, modelName: 'Category' });

module.exports = Category;