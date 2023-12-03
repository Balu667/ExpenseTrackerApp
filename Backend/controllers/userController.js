const schema = require("../model/dbConnection")();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { ObjectId } = require('bson');
const { default: mongoose } = require("mongoose");

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const newUser = new schema.userModel({
      fullName,
      email,
      password,
    });

    await newUser.save();

    res.status(201).json({ staus: 1, message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ status: 0, message: "Error registering user" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await schema.userModel.findOne(
      { email },
      { _id: 1, password: 1, email: 1 }
    );

    if (!user || user.password !== password) {
      return res.status(401).json({ staus: 1, message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, "ticketsQ", {
      expiresIn: "1h",
    });

    res.json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ status: 0, message: "Error logging in" });
  }
};

const insertProduct = async (req, res) => {
  try {
    const productData = req.body;
    if (req.files) {
      const imageName = req.files[0].originalname;
      const imagePath = `/images/${productData.createdBy}/${imageName}`;
      const destinationPath = path.join(__dirname, `../public${imagePath}`);
      const folderPath = path.join(
        __dirname,
        `../public/images/${productData.createdBy}`
      );
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      fs.writeFileSync(destinationPath, req.files[0].buffer);
      const newProduct = new schema.productModel({
        ...productData,
        productImagePath: destinationPath,
        productImageName: imageName,
      });
  
      await newProduct.save();
     return res.status(201).json({ staus: 1, message: "Product created successfully" });
    }
    res.status(500).json({ status: 0, message: "Invalid request" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ status: 0, message: "Error logging in" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productData = req.body;

    let existProduct = await schema.productModel.findOne(
        { _id: new ObjectId(productData.id) },
      );

      if(existProduct != null){
        res.status(404).json({ staus: 1, message: "Product not found" });
      }

      if (req.files) {
        const imageName = req.files[0].originalname;
        const imagePath = `/images/${productData.createdBy}/${imageName}`;
        const destinationPath = path.join(__dirname, `../public${imagePath}`);
        const folderPath = path.join(
          __dirname,
          `../public/images/${productData.createdBy}`
        );
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }
        fs.writeFileSync(destinationPath, req.files[0].buffer);
        const newProduct = new schema.productModel({
          ...productData,
          productImagePath: destinationPath,
          productImageName: imageName,
        });
    
        await newProduct.save();
      return  res.status(201).json({ staus: 1, message: "Product updated successfully" });
      }

    res.status(500).json({ staus: 0, message: "Invalid request" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ status: 0, message: "Error logging in" });
  }
};

const deleteProduct = async (req, res) => {
    try {
      const productData = req.body;
  
      let existProduct = await schema.productModel.findOne(
          { _id: new mongoose.Types.ObjectId(productData.id) },
        );
  
        if(existProduct != null){
          res.status(404).json({ staus: 0, message: "Invalid data" });
        }
       await schema.productModel.deleteOne({_id: new mongoose.Types.ObjectId(productData.id) })
  
      res.status(500).json({ staus: 0, message: "Invalid request" });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ status: 0, message: "Error logging in" });
    }
  };

module.exports = {
  registerUser,
  loginUser,
  insertProduct,
  updateProduct,
  deleteProduct
};
