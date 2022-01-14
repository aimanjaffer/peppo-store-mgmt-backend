const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Employee = require("./employee");
const Order = require("./order");
const StoreTiming = require("./storeTiming");
const StoreProduct = require("./storeProduct");
class Store extends Model {}
Store.init({
  img_url: DataTypes.STRING,
  store_name: DataTypes.STRING,
  zip_code: DataTypes.STRING,
  address: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING
}, { sequelize, modelName: 'Store' });

Store.hasMany(Employee);
Employee.belongsTo(Store);
Store.hasMany(Order);
Order.belongsTo(Store);
Store.hasMany(StoreTiming);
StoreTiming.belongsTo(Store);
Store.hasMany(StoreProduct);
StoreProduct.belongsTo(Store);
module.exports = Store;