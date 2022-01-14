const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require('./product');
class Brand extends Model {}
Brand.init({
  brand_name: DataTypes.STRING
}, { sequelize, modelName: 'Brand' });
module.exports = Brand;