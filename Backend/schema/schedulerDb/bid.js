let mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

//User Schema
let productSchema = new mongoose.Schema({
    productId: {
        type: ObjectId,
        ref: "product"
    },
    bidAmount: {
        type: Number,
        required: true,
    },
    bidderId: {
        type: ObjectId,
        ref: "user"
    },
    placedTime: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true, versionKey: false });


module.exports = productSchema