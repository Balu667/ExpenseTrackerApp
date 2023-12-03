const { default: mongoose } = require("mongoose");


/** MongoDB Connection */

let options, mongoose1, mongoose2, dataModels

options = {
    connectTimeoutMS: 30000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

mongoose1 = mongoose.createConnection("mongodb://localhost:27017/tapi", options)
mongoose2 = mongoose.createConnection("mongodb://localhost:27017/auction", options)

module.exports = function () {
    dataModels = {}
    dataModels.userModel = mongoose1.model('user', require("../schema/apiDb/user"));
    dataModels.productModel = mongoose2.model("product", require("../schema/schedulerDb/product"))
    dataModels.bidModel = mongoose2.model("bid", require("../schema/schedulerDb/bid"))

    return dataModels
}




