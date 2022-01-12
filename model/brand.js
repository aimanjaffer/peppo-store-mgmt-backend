const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Brand extends Model {}
Brand.init({
  brand_name: DataTypes.STRING
}, { sequelize, modelName: 'Brand' });
sequelize.sync();
module.exports = Brand;