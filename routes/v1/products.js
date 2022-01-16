const { Op } = require("sequelize");
const isLoggedIn = require("../../middleware/isLoggedInUser");
const express = require('express');
const router = express.Router();
const Product = require("../../model/product");
const StoreProduct = require("../../model/storeProduct");
const Store = require("../../model/store");
  //GET all products
  //Returns only first 10 products by default 
  router.get("/", isLoggedIn, async (req, res, next) => {
    let {offset=0, limit=10, ...query} = req.query;
    const products = await Product.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      where: {
      [Op.and]: [
        query
        ]
      }
    }).catch(next);
    if(products)
      return res.status(200).json(products);
  });

  //GET product by ID
  router.get("/:id", isLoggedIn, async (req, res, next) => {
    const product = await Product.findOne({ where: { id: req.params.id } }).catch(next);
    if(product)
      return res.status(200).json(product);
    else
      return res.status(404).send("Resource not found");
  });

  //Get stores that have a particular product
  router.get("/:id/stores", isLoggedIn, async (req, res, next) => {
    const results = await StoreProduct.findAll({
      where: {
          ProductId: req.params.id,
           quantityInStock:{[Op.gt]: 0}
          },
      include:[Store]
   }).catch(next);
    if(results && (results.length > 0)){
      let stores = results.map(item => item.Store);
      return res.status(200).json(stores);
    }
    else if(results && (results.length == 0))
      return res.status(200).send(results);
  })
  module.exports = router;