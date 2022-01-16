const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class DeliveryAgent extends Model {}
DeliveryAgent.init({
  imgUrl: DataTypes.STRING,
  name: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  rating: DataTypes.REAL
}, { sequelize, modelName: 'DeliveryAgent' });

module.exports = DeliveryAgent;