const express = require('express');
const router = express.Router();
const Customer = require("../model/customer");
const { Op } = require("sequelize");
const isLoggedIn = require("../middleware/isLoggedInUser");
 //GET Customers
  //Returns only first 10 Customers by default 
  router.get("/", isLoggedIn, async (req, res) => {
    let {offset=0, limit=10, ...query} = req.query;
    try{
      const customers = await Customer.findAll({
        offset: parseInt(offset),
        limit: parseInt(limit),
        where: {
        [Op.and]: [
          query
        ]
      }
    });
      if(customers)
        return res.status(200).json(customers);
      else
        return res.status(404).send("Resource not found");
    }catch(err){
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  //GET Customer by ID
  router.get("/:id", isLoggedIn, async (req, res) => {
    try{
      const customer = await Customer.findOne({ where: { id: req.params.id } });
      if(customer)
        return res.status(200).json();
      else
        return res.status(404).send("Resource not found");
    }catch(err){
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  module.exports = router;