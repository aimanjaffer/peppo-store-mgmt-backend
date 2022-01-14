const { Op } = require("sequelize");
const isLoggedIn = require("../middleware/isLoggedInUser");
const express = require('express');
const router = express.Router();
const Product = require("../model/product");
const StoreProduct = require("../model/storeProduct");
const Store = require("../model/store");
//GET all products
  //Returns only first 10 products by default 
  router.get("/", isLoggedIn, async (req, res) => {
    let {offset=0, limit=10, ...query} = req.query;
    try{
      const products = await Product.findAll({
        offset: parseInt(offset),
        limit: parseInt(limit),
        where: {
        [Op.and]: [
          query
        ]
      }
    });
      if(products)
        return res.status(200).json(products);
      else
        return res.status(404).send("Resource not found");
    }catch(err){
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  //GET product by ID
  router.get("/:id", isLoggedIn, async (req, res) => {
    try{
      const product = await Product.findOne({ where: { id: req.params.id } });
      if(product)
        return res.status(200).json(product);
      else
        return res.status(404).send("Resource not found");
    }catch(err){
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  //Get stores that have a particular product
  router.get("/:id/stores", isLoggedIn, async (req, res) => {
    try{
      const storeIds = await StoreProduct.findAll({ attributes:['StoreId','quantityInStock'], where: { ProductId: req.params.id } });
      let ids = storeIds.filter(item => item.quantityInStock > 0).map(item => item.StoreId);
      if(!ids || (ids.length == 0))
        return res.status(404).send("Resource not found");
      else{
        const stores = await Store.findAll({where: { id: { [Op.or]: ids } }});
        return res.status(200).json(stores);
      }
    }catch(err){
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  })
  module.exports = router;