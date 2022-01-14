const express = require('express');
const router = express.Router();
const Brand = require("../model/brand");
const { Op } = require("sequelize");
const isLoggedIn = require("../middleware/isLoggedInUser");
  //GET Brands
  //Returns only first 10 Brands by default 
  router.get("/", isLoggedIn, async (req, res) => {
    let {offset=0, limit=10, ...query} = req.query;
    try{
      const brands = await Brand.findAll({
        offset: parseInt(offset),
        limit: parseInt(limit),
        where: {
        [Op.and]: [
          query
        ]
      }
    });
      if(brands)
        return res.status(200).json(brands);
      else
        return res.status(404).send("Resource not found");
    }catch(err){
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  //GET Brand by ID
  router.get("/:id", isLoggedIn, async (req, res) => {
    try{
      const brand = await Brand.findOne({ where: { id: req.params.id } });
      if(brand)
        return res.status(200).json(brand);
      else
        return res.status(404).send("Resource not found");
    }catch(err){
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  module.exports = router;
