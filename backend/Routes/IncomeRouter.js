const express = require("express");
const { createExpCtrl, fetchAllIncCtrl ,fetchIncDetailsCtrl, updateIncCtrl, deleteIncCtrl} = require("../Controllers/incomeCtrl");
const ensureAuthenticated = require("../Middleware/Auth");

const incomeRoute= express.Router();

incomeRoute.post('/',ensureAuthenticated,createExpCtrl);
incomeRoute.get("/", ensureAuthenticated,fetchAllIncCtrl);
incomeRoute.put('/:id',ensureAuthenticated,updateIncCtrl);
incomeRoute.delete('/:id',ensureAuthenticated,deleteIncCtrl);
module.exports = incomeRoute;

