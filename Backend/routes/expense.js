const express = require('express');
const { verifyToken } = require('../auth/auth');
const { createCategory, getAllCategory } = require('../controllers/category');
const { setBudget, addExpense, getExpensesByMonth, deleteExpense, updateExpense, getExpensesByUserId, updateBudgetById } = require('../controllers/monthlyTracker');

const expenseRouter = express.Router()

expenseRouter.post("/addCategory", createCategory)
expenseRouter.get("/getAllCategory", getAllCategory)
expenseRouter.post("/setBudget", verifyToken, setBudget)
expenseRouter.post("/updateBudgetById", verifyToken, updateBudgetById)
expenseRouter.post("/getExpensesByUserId", verifyToken, getExpensesByUserId)
expenseRouter.post("/addExpense", verifyToken, addExpense)
expenseRouter.post("/updateExpense", verifyToken, updateExpense)
expenseRouter.post("/getByMonth", verifyToken, getExpensesByMonth)
expenseRouter.post("/deleteExpense", verifyToken, deleteExpense)

module.exports = expenseRouter