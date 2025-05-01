putconst express = require("express");

const { createExpCtrl, fetchAllExpCtrl, fetchExpDetailsCtrl, updateExpCtrl, deleteExpCtrl } = require("../Controllers/expenseCtrl");
const ensureAuthenticated = require("../Middleware/Auth");

const expenseRoute= express.Router();

expenseRoute.post('/',ensureAuthenticated,createExpCtrl);
expenseRoute.get('/',ensureAuthenticated,fetchAllExpCtrl);
expenseRoute.get('/:id',ensureAuthenticated,fetchExpDetailsCtrl);
expenseRoute.put('/:id',ensureAuthenticated,updateExpCtrl);
expenseRoute.delete('/:id',ensureAuthenticated,deleteExpCtrl);

module.exports = expenseRoute;

