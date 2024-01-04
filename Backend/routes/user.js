const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/user');
const { verifyToken } = require('../auth/auth');

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/logout", verifyToken, logoutUser)

module.exports = userRouter