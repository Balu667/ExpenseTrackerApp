let mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

//User Schema
let productSchema = new mongoose.Schema({
    name: {
       type: String,
       required: true,
       trime: true
    },
    productImageName: {
        type: String,
        required: true,
        trim: true,
    },
    productImagePath: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        
    },
    minBidAmount: {
        type: Number,
        required: true,
        trim: true
    },
    // type: {
    //    type: Number,
    //    required: true
    // },

    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    createdBy: {
        type: ObjectId,
        ref: "user"
    },
    status: {
        type: Number,
        default: 0      // 0 - not started , 2 - going, 1 - completed
    }
}, { timestamps: true, versionKey: false });


module.exports = productSchema