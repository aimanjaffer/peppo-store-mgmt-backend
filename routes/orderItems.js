const { Op } = require("sequelize");
const isLoggedIn = require("../middleware/isLoggedInUser");
const express = require('express');
const router = express.Router();
const OrderItem = require("../model/orderItem");
//GET Order Items
  //Returns only first 10 Order Items by default 
  router.get("/", isLoggedIn, async (req, res) => {
    let {offset=0, limit=10, ...query} = req.query;
    try{
      const orderItems = await OrderItem.findAll({
        offset: parseInt(offset),
        limit: parseInt(limit),
        where: {
        [Op.and]: [
          query
        ]
      }
    });
      if(orderItems)
        return res.status(200).json(orderItems);
      else
        return res.status(404).send("Resource not found");
    }catch(err){
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  module.exports = router;