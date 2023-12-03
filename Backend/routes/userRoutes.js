const express = require('express');
const { registerUser, loginUser, insertProduct, updateProduct, deleteProduct } = require('../controllers/userController');
const userValidation = require("../validation/user")()

const router = express.Router();

// Registration route
router.post('/register', userValidation.registerUser, registerUser);
router.post('/login', userValidation.loginUser, loginUser);
router.post('/insertProduct', userValidation.insertProduct, insertProduct);
router.post('/updateProduct', userValidation.updateProduct, updateProduct);
router.post('/deleteProduct', userValidation.deleteProduct, deleteProduct);
router.post('/productDetails')

module.exports = router;