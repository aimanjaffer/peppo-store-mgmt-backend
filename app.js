require("dotenv").config();
const express = require("express");
const cors = require('cors');
const sequelize = require("./config/database");
const routes = require("./routes");
require('./model/associations')();

sequelize.sync();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use('/employees', routes.employeeRoute);
app.use('/stores', routes.storeRoute);
app.use('/products', routes.productRoute);
app.use('/brands', routes.brandRoute);
app.use('/categories', routes.categoryRoute);
app.use('/customers', routes.customerRoute);
app.use('/orderitem', routes.orderItemRoute);
app.use('/orders', routes.orderRoute);

//TODO: check the order in which route handlers are defined

module.exports = app;