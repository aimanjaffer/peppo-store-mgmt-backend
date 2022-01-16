const { Op } = require("sequelize");
const isLoggedIn = require("../../middleware/isLoggedInUser");
const express = require('express');
const router = express.Router();
const OrderItem = require("../../model/orderItem");
  //GET Order Items
  //Returns only first 10 Order Items by default 
  router.get("/", isLoggedIn, async (req, res, next) => {
    let {offset=0, limit=10, ...query} = req.query;
    const orderItems = await OrderItem.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      where: {
      [Op.and]: [
        query
      ]
      }
    }).catch(next);
    if(orderItems)
      return res.status(200).json(orderItems);
  });

  module.exports = router;