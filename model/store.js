const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Store extends Model {}
Store.init({
  store_name: DataTypes.STRING,
  zip_code: DataTypes.STRING,
  address: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  opening_time: DataTypes.TIME,
  closing_time: DataTypes.TIME,
  working_days: DataTypes.STRING,
}, { sequelize, modelName: 'Store' });
sequelize.sync();
module.exports = Store;