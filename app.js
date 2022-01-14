require("dotenv").config();
const express = require("express");
const cors = require('cors');
const sequelize = require("./config/database");
const employeeRouteHandler = require('./routes/employees');
const storeRouteHandler = require('./routes/stores');
const productRouteHandler = require('./routes/products');
const brandRouteHandler = require('./routes/brands');
const categoryRouteHandler = require('./routes/categories');
const customerRouteHandler = require('./routes/customers');
const orderRouteHandler = require('./routes/orders');
const orderItemRouteHandler = require('./routes/orderItems');


sequelize.sync();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use('/employees', employeeRouteHandler);
app.use('/stores', storeRouteHandler);
app.use('/products', productRouteHandler);
app.use('/brands', brandRouteHandler);
app.use('/categories', categoryRouteHandler);
app.use('/customers', customerRouteHandler);
app.use('/orderitem', orderItemRouteHandler);
app.use('/orders', orderRouteHandler);

//TODO: check the order in which route handlers are defined
//TODO: check the APIs in the employee handler for managers, deliveryagents

module.exports = app;