"use strict";
/** Dependency Injection */
const express = require("express") // $ npm install express
require("./model/dbConnection")();
const multer = require("multer")


const app = express(); // Initializing ExpressJS
const server = require("http").createServer(app);
const userRoutes = require("./routes/userRoutes")

app.use(express.json())
app.use(multer().any())
app.use('/api', userRoutes);
/** HTTP Server Instance */
try {
    server.listen(5000, () => {
        console.log("Server turned on port", 5000);
    });
} catch (ex) {
    console.log("TCL: ex", ex)
}
/** /HTTP Server Instance */