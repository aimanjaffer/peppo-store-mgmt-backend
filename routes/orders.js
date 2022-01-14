const express = require('express');
const router = express.Router();
const Order = require("../model/order");
const { Op } = require("sequelize");
const isLoggedIn = require("../middleware/isLoggedInUser");
  //GET Orders
  //Returns only first 10 Orders by default 
  router.get("/", isLoggedIn, async (req, res) => {
    let {offset=0, limit=10, ...query} = req.query;
    try{
      const orders = await Order.findAll({
        offset: parseInt(offset),
        limit: parseInt(limit),
        where: {
        [Op.and]: [
          query
        ]
      }
    });
      if(orders)
        return res.status(200).json(orders);
      else
        return res.status(404).send("Resource not found");
    }catch(err){
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  // GET Order by ID
  router.get("/:id", isLoggedIn, async (req, res) => {
    try{
      const order = await Order.findOne({ where: { id: req.params.id } });
      if(order)
        return res.status(200).json(order);
      else
        return res.status(404).send("Resource not found");
    }catch(err){
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  // GET Orders by StoreId
  router.get("/store/:storeId", isLoggedIn, async (req, res) => {
    try{
      const orders = await Order.findAll({ where: { StoreId: req.params.storeId } });
      if(orders)
        return res.status(200).json(orders);
      else
        return res.status(404).send("Resource not found");
    }catch(err){
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  module.exports = router;