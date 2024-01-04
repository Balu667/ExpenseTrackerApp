const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model("category", categorySchema)