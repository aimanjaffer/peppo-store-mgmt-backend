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
app.use('/api', routes);

//Error Handler Middleware
app.use((error, req, res, next) => {
    return res.status(500).json({ error: error.toString() });
});

module.exports = app;