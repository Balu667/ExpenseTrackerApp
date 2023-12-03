const express = require('express');
// const { registerUser, loginUser } = require('../controllers/userController');
// const userValidation = require("../validation/user")()

const router = express.Router();

// Registration route
router.post('/', userValidation.registerUser, registerUser);
router.post('/login', userValidation.loginUser, loginUser);

module.exports = router;