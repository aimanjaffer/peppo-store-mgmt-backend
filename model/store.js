const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Store extends Model {}
Store.init({
  imgUrl: DataTypes.STRING,
  name: DataTypes.STRING,
  zipCode: DataTypes.STRING,
  address: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  rating: DataTypes.REAL
}, { sequelize, modelName: 'Store' });


module.exports = Store;