const express = require('express');
const router = express.Router();
const Order = require("../../model/order");
const { Op } = require("sequelize");
const isLoggedIn = require("../../middleware/isLoggedInUser");
  //GET Orders
  //Returns only first 10 Orders by default 
  router.get("/", isLoggedIn, async (req, res, next) => {
    let {offset=0, limit=10, ...query} = req.query;
    const orders = await Order.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      where: {
      [Op.and]: [
        query
        ]
      }
    }).catch(next);
    if(orders)
      return res.status(200).json(orders);
  });

  // GET Order by ID
  router.get("/:id", isLoggedIn, async (req, res, next) => {
    const order = await Order.findOne({ where: { id: req.params.id } }).catch(next);
    if(order)
      return res.status(200).json(order);
    else
      return res.status(404).send("Resource not found");
  });

  // GET Orders by StoreId
  router.get("/store/:storeId", isLoggedIn, async (req, res, next) => {
    const orders = await Order.findAll({ where: { StoreId: req.params.storeId } }).catch(next);
    if(orders)
      return res.status(200).json(orders);
  });

  module.exports = router;