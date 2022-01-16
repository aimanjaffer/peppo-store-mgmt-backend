const express = require('express');
const router = express.Router();
const Employee = require("../../model/employee");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const isLoggedIn = require("../../middleware/isLoggedInUser");
const isAdmin = require("../../middleware/isAdmin");
const isAdminOrManager = require("../../middleware/isAdminOrManager");
// Employee Signup
router.post("/signup", async (req, res, next) => {
      const { name, email, password, role="employee", storeId } = req.body;
      if (!(email && password && name)) {
        res.status(400).send({message: "Mandatory fields are missing"});
      }
      const rows = await Employee.findAll({
        where: {
          email: email
        }
      }).catch(next);
      if (rows && rows.length > 0) {
        return res.status(409).send({message: "Employee with this email already exists. Please Login"});
      }
      encryptedPassword = await bcrypt.hash(password, 10).catch(next);
      const employee = await Employee.create({
        name: name,
        email: email.toLowerCase(),
        password: encryptedPassword,
        role: role,
        StoreId: storeId
      }).catch(next);
      const token = jwt.sign(
        { user_id: employee.id, email, role, StoreId:storeId },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      employee.authToken = token;
      return res.status(201).json(employee);
  });
  // POST - Employee Login  
  router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send({message: "All input is required"});
    }
    const employee = await Employee.findOne({
      where: {
        email: email
      }
    }).catch(next);
    if (employee && (await bcrypt.compare(password, employee.password).catch(next))) {
      const token = jwt.sign(
        { user_id: employee.id, email, role:employee.role, StoreId:employee.StoreId },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      employee.authToken = token;
      return res.status(200).json(employee);
    }
    return res.status(401).json({message:"Invalid Credentials"});
  });

  //GET Employees
  //shows only first 10 employees by default 
  router.get("/", isLoggedIn, async (req, res, next) => {
    let {offset=0, limit=10, ...query} = req.query;
    const employees = await Employee.findAll({
    offset: parseInt(offset),
    limit: parseInt(limit),
    attributes: { exclude: ['password'] },
        where: {
        [Op.and]: [
        query
        ]
    }
    }).catch(next);
    if(employees)
        return res.status(200).json(employees);
    });

  //GET Employee by ID
  router.get("/:id", isLoggedIn, async (req, res, next) => {
    const employee = await Employee.findOne({
      attributes: { exclude: ['password'] },
      where: { id: req.params.id } 
    }).catch(next);
    if(employee)
      return res.status(200).json(employee);
    else
      return res.status(404).send({message: "Resource not found"});
  });

  //GET all employees by storeId
  router.get("/store/:id", isLoggedIn, async (req, res, next) => {
    const employees = await Employee.findAll({
      attributes: { exclude: ['password'] },
      where: { StoreId: req.params.id } 
    }).catch(next);
    if(employees)
      return res.status(200).json(employees);
  });

  //PATCH Update Employee by ID
  router.patch("/:id", isLoggedIn, isAdminOrManager, async (req, res, next) => {
    let {name, role, phone, email, StoreId} = req.body;
    if(req.user.role !== "admin" && (role || StoreId)){
      console.log("Only Administrators can update Employee's Role / Store Id");
      return res.status(403).send({message: "Insufficient Privileges"});
    }
    const [rowsUpdatedCount] = await Employee.update( 
      {name, role, phone, email, StoreId}, {
        where: { id: req.params.id }
      }).catch(next);
    if(rowsUpdatedCount == 1)
      return res.status(200).json("Employee with ID "+req.params.id+" successfully updated");
    else
      return res.status(404).send({message: "Resource not found"});
  });

  //Delete Employee By ID
  router.delete("/:id", isLoggedIn, isAdmin, async (req, res, next) => {
    const rowsDeletedCount = await Employee.destroy({
        limit: 1,
        where: { id: req.params.id }
    }).catch(next);
    if(rowsDeletedCount == 1)
      return res.status(200).json("Employee with ID "+req.params.id+" successfully deleted");
    else
      return res.status(404).send({message: "Resource not found"});
  });

  module.exports = router;