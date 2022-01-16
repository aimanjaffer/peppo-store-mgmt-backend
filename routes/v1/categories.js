const express = require('express');
const router = express.Router();
const Category = require("../../model/category");
const { Op } = require("sequelize");
const isLoggedIn = require("../../middleware/isLoggedInUser");

  //GET Categories
  //Returns only first 10 categories by default 
  router.get("/", isLoggedIn, async (req, res, next) => {
    let {offset=0, limit=10, ...query} = req.query;
    const categories = await Category.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      where: {
      [Op.and]: [
        query
      ]
    }
    }).catch(next);
    if(categories)
      return res.status(200).json(categories);
  });

  //GET Category by ID
  router.get("/:id", isLoggedIn, async (req, res, next) => {
    const category = await Category.findOne({ where: { id: req.params.id } }).catch(next);
    if(category)
      return res.status(200).json(category);
    else
    return res.status(404).send("Resource not found");
  });

  module.exports = router;