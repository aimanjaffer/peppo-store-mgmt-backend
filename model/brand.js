const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require('./product');
class Brand extends Model {}
Brand.init({
  brand_name: DataTypes.STRING
}, { sequelize, modelName: 'Brand' });
Brand.hasMany(Product);
Product.belongsTo(Brand);
module.exports = Brand;