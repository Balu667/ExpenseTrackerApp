const MonthlyTracker = require("../schema/monthlyTracker")

const setBudget = async (req, res) => {
    const { month, year, budgetLimit, userId } = req.body;
    let budgetCreated, checkExist;
    try {
        checkExist = await MonthlyTracker.findOne({ userId: userId, month: month, year: year })
        if (checkExist == null) {
            budgetCreated = await MonthlyTracker.create({ userId: userId, month: month, year: year, budgetLimit: budgetLimit })
            if (budgetCreated) {

                return res.send({ status: 1, response: `Budget added for ${month}/${year}` });
            }
        }
        budgetCreated = await MonthlyTracker.updateOne({ _id: checkExist._id }, { budgetLimit: budgetLimit })
        if (budgetCreated) {

            return res.send({ status: 1, response: `Budget added for ${month}/${year}` });
        }
        return res.send({ status: 0, response: "Invalid request" });
    } catch (error) {
        return res.send({ status: 0, response: error.message });
    }
};

const addExpense = async (req, res) => {
    const { date, amount, category, userId } = req.body;
    let budgetExist, createExpense, updateExpense;
    try {
        let month = new Date(date).toLocaleString('en-US', { month: 'long' })
        let year = new Date(date).getFullYear()
        budgetExist = await MonthlyTracker.findOne({ userId: userId, month: month, year: year })
        if (budgetExist == null) {
            createExpense = await MonthlyTracker.create({ userId: userId, month: month, year: year, expenses: { date: date, amount: amount, category: category } })

            return res.send({ status: 1, response: "Expense added successfully" })
        }

        updateExpense = await MonthlyTracker.updateOne({ _id: budgetExist._id }, { $push: { expenses: { date: date, amount: amount, category: category } } })
        if (updateExpense) {

            return res.send({ status: 1, response: `Expense added successfully` });
        }
        return res.send({ status: 0, response: "Invalid request" });
    } catch (error) {
        return res.send({ status: 0, response: error.message });
    }
};

const updateExpense = async (req, res) => {
    const { date, amount, category, expenseId } = req.body;
    let updateExpense;
    try {
        updateExpense = await MonthlyTracker.updateOne({ expenses: { $elemMatch: { _id: expenseId } } }, {
            $set: {
                "expenses.$": {
                    _id: expenseId,
                    date: date,
                    amount: amount,
                    category: category
                }
            }
        })
        if (updateExpense) {

            return res.send({ status: 1, response: `Expense updated successfully` });
        }
        return res.send({ status: 0, response: "Invalid request" });
    } catch (error) {
        return res.send({ status: 0, response: error.message });
    }
};

const updateBudgetById = async (req, res) => {
    const { budgetLimit, budgetId } = req.body;
    let updateBudget
    try {
        updateBudget = await MonthlyTracker.updateOne({ _id: budgetId }, { budgetLimit: budgetLimit })
        if (updateBudget) {

            return res.send({ status: 1, response: `Budget updated successfully` });
        }
        return res.send({ status: 0, response: "Invalid request" });
    } catch (error) {
        return res.send({ status: 0, response: error.message });
    }
};

const getExpensesByMonth = async (req, res) => {
    const { userId, month, year } = req.body;
    let expense;
    try {
        expense = await MonthlyTracker.find({ userId: userId, month: month, year: year })
        return res.send({ status: 1, data: JSON.stringify(expense) });
    } catch (error) {
        return res.send({ status: 0, response: error.message });
    }
};

const getExpensesByUserId = async (req, res) => {
    const { month, year, userId } = req.body;
    let expense;
    try {
        expense = await MonthlyTracker.find({ userId: userId })
        return res.send({ status: 1, data: JSON.stringify(expense) });
    } catch (error) {
        return res.send({ status: 0, response: error.message });
    }
};


const deleteExpense = async (req, res) => {
    const { expenseId, userId, month, year } = req.body;
    let budgetExist, deleteExpense;
    try {
        budgetExist = await MonthlyTracker.findOne({ userId: userId, month: month, year: year })
        if (budgetExist == null) {

            return res.send({ status: 0, response: "No expenses found" })
        }
        deleteExpense = await MonthlyTracker.findByIdAndUpdate({ _id: budgetExist._id }, { $pull: { expenses: { _id: expenseId } } })
        if (deleteExpense) {

            return res.send({ status: 1, response: "Expense deleted" });
        }

        return res.send({ status: 1, response: "Invalid request" });
    } catch (error) {
        return res.send({ status: 0, response: error.message });
    }
};


module.exports = { setBudget, addExpense, getExpensesByMonth, deleteExpense, updateExpense, getExpensesByUserId, updateBudgetById }