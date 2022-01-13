const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Store extends Model {}
Store.init({
  store_name: DataTypes.STRING,
  zip_code: DataTypes.STRING,
  address: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING
}, { sequelize, modelName: 'Store' });

module.exports = Store;