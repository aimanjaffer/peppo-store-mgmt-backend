const { Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class StoreProduct extends Model {}
StoreProduct.init({
    quantityInStock: DataTypes.INTEGER
}, { sequelize, modelName: 'StoreProduct' });

module.exports = StoreProduct;