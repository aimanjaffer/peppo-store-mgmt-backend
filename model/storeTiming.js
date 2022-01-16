const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class StoreTiming extends Model {}
StoreTiming.init({
  dayOfWeek: DataTypes.STRING,
  openingTime: DataTypes.TIME,
  closingTime: DataTypes.TIME
}, { sequelize, modelName: 'StoreTiming' });

module.exports = StoreTiming;