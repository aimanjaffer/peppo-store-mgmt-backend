const express = require('express');
const router = express.Router();
const Employee = require("../model/employee");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const isLoggedIn = require("../middleware/isLoggedInUser");
const isAdmin = require("../middleware/isAdmin");
const isAdminOrManager = require("../middleware/isAdminOrManager");
// Employee Signup
router.post("/signup", async (req, res) => {
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
        StoreId: store_id
      });
      const token = jwt.sign(
        { user_id: employee.id, email, role, StoreId:store_id },
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
  router.post("/login", async (req, res) => {
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
          { user_id: employee.id, email, role:employee.employee_role, StoreId:employee.StoreId },
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

  //GET Employees
  //shows only first 10 employees by default 
  router.get("/", isLoggedIn, async (req, res) => {
    let {offset=0, limit=10, ...query} = req.query;
    try{
        const employees = await Employee.findAll({
        offset: parseInt(offset),
        limit: parseInt(limit),
        attributes: { exclude: ['employee_password'] },
            where: {
            [Op.and]: [
            query
            ]
        }
        });
        if(employees)
            return res.status(200).json(employees);
        else
            return res.status(404).send("Resource not found");
    }catch(err){
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
    });

  //GET Employee by ID
  router.get("/:id", isLoggedIn, async (req, res) => {
    try{
      const employee = await Employee.findOne({
        attributes: { exclude: ['employee_password'] },
        where: { id: req.params.id } 
    });
      if(employee)
        return res.status(200).json(employee);
      else
        return res.status(404).send("Resource not found");
    }catch(err){
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  //GET all employees by storeId
  router.get("/store/:id", isLoggedIn, async (req, res) => {
    try{
      const employees = await Employee.findAll({
        attributes: { exclude: ['employee_password'] },
        where: { StoreId: req.params.id } 
    });
      if(employees)
        return res.status(200).json(employees);
      else
        return res.status(404).send("Resource not found");
    }catch(err){
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  });

  //PATCH Update Employee by ID
  router.patch("/:id", isLoggedIn, isAdminOrManager, async (req, res) => {
    try {
      let {employee_name, employee_role, employee_phone, employee_email, StoreId} = req.body;
      if(req.user.role !== "admin" && (employee_role || StoreId)){
        console.log("Only Administrators can update Employee's Role / Store Id");
        return res.status(403).send("Insufficient Privileges");
      }
      const [rowsUpdatedCount] = await Employee.update( 
        {employee_name, employee_role, employee_phone, employee_email, StoreId}, {
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
  router.delete("/:id", isLoggedIn, isAdmin, async (req, res) => {
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

  module.exports = router;