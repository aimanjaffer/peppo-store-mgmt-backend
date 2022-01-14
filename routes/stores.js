const { Op } = require("sequelize");
const isLoggedIn = require("../middleware/isLoggedInUser");
const isAdmin = require("../middleware/isAdmin");
const isAdminOrManager = require("../middleware/isAdminOrManager");
const express = require('express');
const router = express.Router();
const Store = require("../model/store");
const StoreTiming = require("../model/storeTiming");
const StoreProduct = require("../model/storeProduct");
const Product = require("../model/product");

  //GET stores
  //shows only first 10 stores by default 
  router.get("/", isLoggedIn, async (req, res) => {
    let {offset=0, limit=10, ...query} = req.query;
    try{
      const stores = await Store.findAll({
        offset: parseInt(offset),
        limit: parseInt(limit),
          where: {
          [Op.and]: [
            query
          ]
        }
      });
      if(stores)
        return res.status(200).json(stores);
      else
        return res.status(404).send("Resource not found");
    }catch(err){
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  //GET store by ID
  router.get("/:id", isLoggedIn, async (req, res) => {
    try{
      const store = await Store.findOne({ where: { id: req.params.id } });
      if(store)
        return res.status(200).json(store);
      else
        return res.status(404).send("Resource not found");
    }catch(err){
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  //POST Create New Store
  router.post("/", isLoggedIn, isAdmin, async (req, res) => {
    try {
      const { store_name, zip_code, address, city, state, opening_time="10:00", closing_time="22:00", working_days="MON,TUE,WED,THU,FRI,SAT,SUN" } = req.body;
      if (!(store_name, zip_code, address, city, state)) {
          console.log("Mandatory fields are missing for Store Creation");
        res.status(400).send("Mandatory fields are missing for Store Creation");
      }
      const rows = await Store.findAll({
        where: {
          store_name: store_name
        }
      });
      if (rows && rows.length > 0) {
        console.log(rows);
        return res.status(409).send("Store with this name already exists. Please Change the Store Name");
      }
      const store = await Store.create({
          store_name,
          zip_code,
          address,
          city,
          state,
          opening_time,
          closing_time,
          working_days 
      });
      return res.status(201).json(store);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  //Delete Store By ID
  router.delete("/:id", isLoggedIn, isAdmin, async (req, res) => {
    try {
        const rowsDeletedCount = await Store.destroy({
            limit: 1,
            where: { id: req.params.id }
            });
        if(rowsDeletedCount == 1)
          return res.status(200).json("Store with ID "+req.params.id+" successfully deleted");
        else
          return res.status(404).send("Resource not found");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  //PATCH Update Store
  router.patch("/:id", isLoggedIn, isAdminOrManager, async (req, res) => {
    try {
      let {store_name, zip_code, address, city, state} = req.body;
      // Store Manager can only update the store for which they are manager
      if(req.user.role!=="admin" && req.user.StoreId != req.params.id)
        return res.status(403).send("Insufficient Privileges");
      const [rowsUpdatedCount] = await Store.update( 
        {store_name, zip_code, address, city, state}, 
        { where: { id: req.params.id }
      });
      if(rowsUpdatedCount == 1)
        return res.status(200).json("Store with ID "+req.params.id+" successfully updated");
      else
        return res.status(404).send("Resource not found");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });
  //GET Store Timings By Store ID for given dayOfWeek
  router.get("/:id/timings/:dayOfWeek", isLoggedIn, async (req, res) => {
    try{
      const storeTimings = await StoreTiming.findOne({
        where: {
        StoreId: req.params.id,
        day_of_week: req.params.dayOfWeek
      }
    });
      if(storeTimings)
        return res.status(200).json(storeTimings);
      else
        return res.status(404).send("Resource not found");
    }catch(err){
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  //GET All Store Timings By Store ID
  router.get("/:id/timings", isLoggedIn, async (req, res) => {
    try{
      const storeTimings = await StoreTiming.findAll({
        where: {
        StoreId: req.params.id
      }
    });
      if(storeTimings)
        return res.status(200).json(storeTimings);
      else
        return res.status(404).send("Resource not found");
    }catch(err){
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  //PATCH update store timings by storeId and dayOfWeek
  router.patch("/:id/timings/:dayOfWeek", isLoggedIn, isAdminOrManager, async (req, res) => {
    let {opening_time, closing_time} = req.body
    try {
      const [rowsUpdatedCount] = await StoreTiming.update({ opening_time, closing_time },{
          limit: 1,
          where: { StoreId: req.params.id, day_of_week: req.params.dayOfWeek }
          });
      if(rowsUpdatedCount == 1)
        return res.status(200).json("Timings for Store with ID "+req.params.id+" successfully updated");
      else
        return res.status(404).send("Resource not found");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  //PATCH update store timings by storeId for all days of the week
  router.patch("/:id/timings", isLoggedIn, isAdminOrManager, async (req, res) => {
    let {opening_time, closing_time} = req.body
    try {
      const [rowsUpdatedCount] = await StoreTiming.update({ opening_time, closing_time },{
          where: { StoreId: req.params.id }
      });
      if(rowsUpdatedCount > 0)
        return res.status(200).json("Timings for Store with ID "+req.params.id+" successfully updated");
      else
        return res.status(404).send("Resource not found");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  //POST add product to storeProducts (StoreId and ProductId)
  router.post("/:id/products/:productId", isLoggedIn, isAdminOrManager, async (req, res) => {
    try{
      const storeId = req.params.id;
      const productId = req.params.productId;
      const { quantity=100 } = req.body;
      if (!( storeId, productId )) {
        res.status(400).send("All input is required");
      }
      const storeProduct = await StoreProduct.findOne({
        where: {
          StoreId: storeId,
          ProductId: productId
        }
      });
      if (storeProduct) {
        return res.status(409).send("Product already exists in Store.");      
      }else{
        const storeProduct = await StoreProduct.create({
          StoreId: storeId,
          ProductId: productId,
          quantityInStock: quantity
        });
        return res.status(201).json(storeProduct);
      }
    }catch(err){
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });
  //DELETE product from storeProducts (StoreId and ProductId)
  router.delete("/:id/products/:productId", isLoggedIn, isAdmin, async (req, res) => {
    try {
        const rowsDeletedCount = await StoreProduct.destroy({
            limit: 1,
            where: { StoreId: req.params.id, ProductId: req.params.productId }
            });
        if(rowsDeletedCount == 1)
          return res.status(200).json("Product with ID "+req.params.productId+" successfully deleted from Store "+req.params.id);
        else
          return res.status(404).send("Resource not found");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });
  //PATCH - Update quantity of product at store (StoreId and ProductId)
  router.patch("/:id/products/:productId/updateQuantity", isLoggedIn, isAdminOrManager, async (req, res) => {
    try {
      const storeId = req.params.id;
      const productId = req.params.productId;
      const {quantity} = req.body;
      if(!(storeId && productId && quantity)){
        res.status(400).send("Mandatory inputs missing");
      }
      const [rowsUpdatedCount] = await StoreProduct.update({ quantityInStock : quantity },{
          limit: 1,
          where: { StoreId: storeId, ProductId: productId }
          });
      if(rowsUpdatedCount == 1)
        return res.status(200).json("Quantity of Product with ID "+productId+" updated at store with ID "+storeId);
      else
        return res.status(404).send("Resource not found");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  // Get products that are available in the store
  router.get("/:id/products", isLoggedIn, async (req, res) => {
    try{
      const productIds = await StoreProduct.findAll({ attributes:['ProductId','quantityInStock'], where: { StoreId: req.params.id } });
      let ids = productIds.filter(item => item.quantityInStock > 0).map(item => item.ProductId);
      if(!ids || (ids.length == 0))
        return res.status(404).send("Resource not found");
      else{
        const products = await Product.findAll({where: { id: { [Op.or]: ids } }});
        return res.status(200).json(products);
      }
    }catch(err){
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  })
  
// Get quantity of the product available in the store
router.get("/:id/products/:productId", isLoggedIn, async (req, res) => {
  try{
    const quantity = await StoreProduct.findOne({ attributes:['quantityInStock'], where: { StoreId: req.params.id, ProductId: req.params.productId } });
    if(!quantity)
      return res.status(404).send("Resource not found");
    else{
      return res.status(200).json(quantity);
    }
  }catch(err){
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
})
  module.exports = router;