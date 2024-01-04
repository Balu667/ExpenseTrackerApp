const express = require('express')
const mongoose = require("mongoose")
const cors = require("cors")
const userRouter = require('./routes/user')
const expenseRouter = require('./routes/expense')
require("dotenv").config()

const app = express()

app.use(express.json())
app.use(cors({ origin: "*" }))

mongoose.connect(process.env.DB_URL)
    .then(() => console.log("MongoDb connected successfully"))
    .catch((err) => console.log(`Error connecting mongo ${err}`))

app.use("/user", userRouter)
app.use("/expense", expenseRouter)

app.listen(5000, () => {
    console.log(`Server started on port`);
});