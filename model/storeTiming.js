const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class StoreTiming extends Model {}
StoreTiming.init({
  day_of_week: DataTypes.STRING,
  opening_time: DataTypes.TIME,
  closing_time: DataTypes.TIME
}, { sequelize, modelName: 'StoreTiming' });

module.exports = StoreTiming;