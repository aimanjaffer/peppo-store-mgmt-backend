require("dotenv").config();
const { Op } = require("sequelize");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const auth = require("./middleware/auth");
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

const Brand = require("./model/brand");
const Category = require("./model/category");
const Customer = require("./model/customer");
const Employee = require("./model/employee");
const Order = require("./model/order");
const OrderItem = require("./model/orderItem");
const Product = require("./model/product");
const Store = require("./model/store");

// Employee Signup
app.post("/employees/signup", async (req, res) => {
    try {
      const { name, email, password, role="employee", store_id } = req.body;
      if (!(email && password && name)) {
          console.log("Mandatory fields are missing");
        res.status(400).send("Mandatory fields are missing");
      }
      const rows = await Employee.findAll({
        where: {
          employee_email: email
        }
      });
      if (rows && rows.length > 0) {
        console.log(rows);
        return res.status(409).send("Employee with this email already Exist. Please Login");
      }
      encryptedPassword = await bcrypt.hash(password, 10);
      const employee = await Employee.create({
        employee_name: name,
        employee_email: email.toLowerCase(),
        employee_password: encryptedPassword,
        employee_role: role,
        store_id: store_id
      });
      const token = jwt.sign(
        { user_id: employee.id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      employee.auth_token = token;
      return res.status(201).json(employee);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });
  // POST - Employee Login  
  app.post("/employees/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      const employee = await Employee.findOne({
        where: {
          employee_email: email
        }
      });
      if (employee && (await bcrypt.compare(password, employee.employee_password))) {
        const token = jwt.sign(
          { user_id: employee.id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        employee.auth_token = token;
        return res.status(200).json(employee);
      }
      return res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  //PATCH Update Employee by ID
  app.patch("/employees/:id", auth, async (req, res) => {
    try {
      const [rowsUpdatedCount] = await Employee.update( req.body, {
          where: { id: req.params.id }
        });
      if(rowsUpdatedCount == 1)
        return res.status(200).json("Employee with ID "+req.params.id+" successfully updated");
      else
        return res.status(404).send("Resource not found");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  //Delete Employee By ID
  app.delete("/employees/:id", auth, async (req, res) => {
    try {
        const rowsDeletedCount = await Employee.destroy({
            limit: 1,
            where: { id: req.params.id }
            });
        if(rowsDeletedCount == 1)
          return res.status(200).json("Employee with ID "+req.params.id+" successfully deleted");
        else
          return res.status(404).send("Resource not found");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  //GET stores
  //shows only first 10 stores by default 
  app.get("/stores", auth, async (req, res) => {
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
  app.get("/stores/:id", auth, async (req, res) => {
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
  app.post("/stores", auth, async (req, res) => {
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
  app.delete("/stores/:id", auth, async (req, res) => {
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
  app.patch("/stores/:id", auth, async (req, res) => {
    try {
      const [rowsUpdatedCount] = await Store.update( req.body, {
          where: { id: req.params.id }
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

  //GET all products
  //Returns only first 10 products by default 
  app.get("/products", auth, async (req, res) => {
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
  app.get("/products/:id", auth, async (req, res) => {
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

  //GET Brands
  //Returns only first 10 Brands by default 
  app.get("/brands", auth, async (req, res) => {
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
  app.get("/brands/:id", auth, async (req, res) => {
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

  //GET Categories
  //Returns only first 10 categories by default 
  app.get("/categories", auth, async (req, res) => {
    let {offset=0, limit=10, ...query} = req.query;
    try{
      const categories = await Category.findAll({
        offset: parseInt(offset),
        limit: parseInt(limit),
        where: {
        [Op.and]: [
          query
        ]
      }
    });
      if(categories)
        return res.status(200).json(categories);
      else
      return res.status(404).send("Resource not found");
    }catch(err){
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  //GET Category by ID
  app.get("/categories/:id", auth, async (req, res) => {
    try{
      const category = await Category.findOne({ where: { id: req.params.id } });
      if(category)
        return res.status(200).json(category);
      else
      return res.status(404).send("Resource not found");
    }catch(err){
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  //GET Customers
  //Returns only first 10 Customers by default 
  app.get("/customers", auth, async (req, res) => {
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
  app.get("/customers/:id", auth, async (req, res) => {
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

  //GET Orders
  //Returns only first 10 Orders by default 
  app.get("/orders", auth, async (req, res) => {
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
  app.get("/orders/:id", auth, async (req, res) => {
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

  //GET Order Items
  //Returns only first 10 Order Items by default 
  app.get("/orderitems", auth, async (req, res) => {
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

module.exports = app;