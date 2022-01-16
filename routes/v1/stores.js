const { Op } = require("sequelize");
const isLoggedIn = require("../../middleware/isLoggedInUser");
const isAdmin = require("../../middleware/isAdmin");
const isAdminOrManager = require("../../middleware/isAdminOrManager");
const express = require('express');
const router = express.Router();
const Store = require("../../model/store");
const StoreTiming = require("../../model/storeTiming");
const StoreProduct = require("../../model/storeProduct");
const Product = require("../../model/product");

  //GET all stores - only name and id since this is required field for a user to sign up for a new account
  router.get("/all", async (req, res, next) => {
    const stores = await Store.findAll({ attributes:['id','name'] }).catch(next);
    if(stores)
      return res.status(200).json(stores);
  });
  //GET stores
  //shows only first 10 stores by default 
  router.get("/", isLoggedIn, isAdminOrManager, async (req, res, next) => {
    let {offset=0, limit=10, ...query} = req.query;
    const stores = await Store.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
        where: {
        [Op.and]: [
          query
        ]
      }
    }).catch(next);
    if(stores)
      return res.status(200).json(stores);
  });

  //GET store by ID
  router.get("/:id", isLoggedIn, async (req, res, next) => {
    const store = await Store.findOne({ where: { id: req.params.id } }).catch(next);
    if(store)
      return res.status(200).json(store);
    else
      return res.status(404).send({error: "Resource not found"});
  });

  //POST Create New Store
  router.post("/", isLoggedIn, isAdmin, async (req, res, next) => {
    const { imgUrl, name, zipCode, address, city, state } = req.body;
    if (!(name, zipCode, address, city, state)) {
      res.status(400).send("Mandatory fields are missing for Store Creation");
    }
    const rows = await Store.findAll({
      where: {
        name: name
      }
    }).catch(next);
    if (rows && rows.length > 0) {
      return res.status(409).send({error: "Store with this name already exists. Please Change the Store Name"});
    }else if(rows && rows.length == 0){
      const store = await Store.create({
        imgUrl,
        name,
        zipCode,
        address,
        city,
        state          
      }).catch(next);
      if(store)
        return res.status(201).json(store);
    }
  });

  //Delete Store By ID
  router.delete("/:id", isLoggedIn, isAdmin, async (req, res, next) => {
    const rowsDeletedCount = await Store.destroy({
        limit: 1,
        where: { id: req.params.id }
        }).catch(next);
    if(rowsDeletedCount == 1)
      return res.status(200).json({message: "Store with ID "+req.params.id+" successfully deleted"});
    else if(rowsDeletedCount == 0)
      return res.status(404).send({error: "Resource not found"});
  });

  //PATCH Update Store
  router.patch("/:id", isLoggedIn, isAdminOrManager, async (req, res, next) => {
    let {name, zipCode, address, city, state} = req.body;
    // Store Manager can only update the store for which they are manager
    if(req.user.role!=="admin" && req.user.StoreId != req.params.id)
      return res.status(403).send({error: "Insufficient Privileges"});
    const [rowsUpdatedCount] = await Store.update( 
      {name, zipCode, address, city, state}, 
      { where: { id: req.params.id }
    }).catch(next);
    if(rowsUpdatedCount == 1)
      return res.status(200).json({message: "Store with ID "+req.params.id+" successfully updated"});
    else if(rowsUpdatedCount == 0)
      return res.status(404).send({error: "Resource not found"});
  });
  //GET Store Timings By Store ID for given dayOfWeek
  router.get("/:id/timings/:dayOfWeek", isLoggedIn, async (req, res, next) => {
    const storeTimings = await StoreTiming.findOne({
      attributes:['openingTime','closingTime'],
      where: {
      StoreId: req.params.id,
      dayOfWeek: req.params.dayOfWeek
      }
    }).catch(next);
    if(storeTimings)
      return res.status(200).json(storeTimings);
    else
      return res.status(404).send({error: "Store Timings not found for store with ID "+req.params.id+" for day: "+req.params.dayOfWeek});
  });

  //GET All Store Timings By Store ID
  router.get("/:id/timings", isLoggedIn, async (req, res, next) => {
    const storeTimings = await StoreTiming.findAll({
      attributes:['dayOfWeek','openingTime','closingTime'],
      where: {
      StoreId: req.params.id
      }
    }).catch(next);
    if(storeTimings)
      return res.status(200).json(storeTimings);
  });

  //PATCH update store timings by storeId and dayOfWeek
  router.patch("/:id/timings/:dayOfWeek", isLoggedIn, isAdminOrManager, async (req, res, next) => {
    let {openingTime, closingTime} = req.body
    const [rowsUpdatedCount] = await StoreTiming.update({ openingTime, closingTime }, {
        limit: 1,
        where: { StoreId: req.params.id, dayOfWeek: req.params.dayOfWeek }
        }).catch(next);
    if(rowsUpdatedCount == 1)
      return res.status(200).json({message: "Timings for Store with ID "+req.params.id+" successfully updated"});
    else
      return res.status(404).send({error: "Resource not found"});
  });

  //PATCH update store timings by storeId for all days of the week
  router.patch("/:id/timings", isLoggedIn, isAdminOrManager, async (req, res, next) => {
    let {openingTime, closingTime} = req.body
    const [rowsUpdatedCount] = await StoreTiming.update({ openingTime, closingTime }, {
        where: { StoreId: req.params.id }
    }).catch(next);
    if(rowsUpdatedCount > 0)
      return res.status(200).json({message: "Timings for Store with ID "+req.params.id+" successfully updated"});
    else
      return res.status(404).send({error: "Resource not found"});
  });

  //POST add product to storeProducts (StoreId and ProductId)
  router.post("/:id/products/:productId", isLoggedIn, isAdminOrManager, async (req, res, next) => {
    const storeId = req.params.id;
    const productId = req.params.productId;
    const { quantity=100 } = req.body;
    if (!( storeId, productId )) {
      res.status(400).send("All input is required");
    }
    const existingStoreProduct = await StoreProduct.findOne({
      where: {
        StoreId: storeId,
        ProductId: productId
      }
    }).catch(next);
    if (existingStoreProduct) {
      return res.status(409).send({error: "Product already exists in Store."});      
    }else{
      const storeProduct = await StoreProduct.create({
        StoreId: storeId,
        ProductId: productId,
        quantityInStock: quantity
      }).catch(next);
      if(storeProduct)
        return res.status(201).json(storeProduct);
    }
  });
  //DELETE product from storeProducts (StoreId and ProductId)
  router.delete("/:id/products/:productId", isLoggedIn, isAdmin, async (req, res, next) => {
    const rowsDeletedCount = await StoreProduct.destroy({
        limit: 1,
        where: { StoreId: req.params.id, ProductId: req.params.productId }
        }).catch(next);
    if(rowsDeletedCount == 1)
      return res.status(200).json({message: "Product with ID "+req.params.productId+" successfully deleted from Store "+req.params.id});
    else if(rowsDeletedCount == 0)
      return res.status(409).send({error: "Unable to remove product from the store"});
  });
  //PATCH - Update quantity of product at store (StoreId and ProductId)
  router.patch("/:id/products/:productId", isLoggedIn, isAdminOrManager, async (req, res, next) => {
    const storeId = req.params.id;
    const productId = req.params.productId;
    const {quantity} = req.body;
    if(!(storeId && productId && quantity)){
      res.status(400).send({message: "Mandatory inputs missing"});
    }
    const [rowsUpdatedCount] = await StoreProduct.update({ quantityInStock : quantity }, {
        limit: 1,
        where: { StoreId: storeId, ProductId: productId }
    }).catch(next);
    if(rowsUpdatedCount == 1)
      return res.status(200).json({message: "Quantity of Product with ID "+productId+" updated at store with ID "+storeId});
    else if(rowsUpdatedCount == 0)
      return res.status(409).send({message: "Unable to update resource"});
  });

  // Get products that are available in the store
  router.get("/:id/products", isLoggedIn, async (req, res, next) => {
    const results = await StoreProduct.findAll({
        where: { StoreId: req.params.id , quantityInStock:{[Op.gt]: 0 }},
        include:[{model: Product, required: true}] 
    }).catch(next);
    if(results && (results.length > 0)){
      let products = results.map((item) => ({quantityInStock: item.quantityInStock, Product: item.Product}));
      return res.status(200).json(products);
    }
    else if(results && (results.length == 0))
      return res.status(200).send(results);
  })
  
  // Get quantity of the product available in the store
  router.get("/:id/products/:productId", isLoggedIn, async (req, res, next) => {
    const quantity = await StoreProduct.findOne({
      attributes:['quantityInStock'],
      where: { StoreId: req.params.id, ProductId: req.params.productId }
    }).catch(next);
    if(quantity)
      return res.status(200).json(quantity);
    else
      return res.status(404).send({error:"Resource not found"});
  })
  module.exports = router;