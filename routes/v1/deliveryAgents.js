const express = require('express');
const router = express.Router();
const DeliveryAgent = require("../../model/deliveryAgent");
const { Op } = require("sequelize");
const isLoggedIn = require("../../middleware/isLoggedInUser");
const isAdminOrManager = require("../../middleware/isAdminOrManager")
  //GET Delivery Agents
  //Returns only first 10 Delivery Agents by default 
  router.get("/", isLoggedIn, async (req, res, next) => {
    let {offset=0, limit=10, ...query} = req.query;
    const deliveryAgents = await DeliveryAgent.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      where: {
      [Op.and]: [
        query
      ]
    }
  }).catch(next);
    if(deliveryAgents)
      return res.status(200).json(deliveryAgents);
  });

  // POST - New delivery agent  
  router.post("/", isLoggedIn, isAdminOrManager, async (req, res, next) => {
    const { name, phone, email } = req.body;
    if (!( name, phone, email)) {
      res.status(400).send({message: "All input is required"});
    }
    const existingDeliveryAgent = await DeliveryAgent.findOne({
      where: {
        email: email
      }
    }).catch(next);
    if (existingDeliveryAgent) {
      return res.status(409).send({message: "Delivery Agent with this email already exists."});      
    }else{
      const newDeliveryAgent = await DeliveryAgent.create({
        name: name,
        email: email.toLowerCase(),
        phone: phone
      }).catch(next);
      return res.status(201).json(newDeliveryAgent);
    }
  });

// GET - Delivery agent by ID  
router.get("/:id", isLoggedIn, async (req, res, next) => {
  const existingDeliveryAgent = await DeliveryAgent.findOne({
    where: {
      id: id
    }
  }).catch(next);
  if (existingDeliveryAgent) {
    return res.status(200).send(existingDeliveryAgent);      
  }else{
    return res.status(404).json({message: "Resource not found"});
  }
});