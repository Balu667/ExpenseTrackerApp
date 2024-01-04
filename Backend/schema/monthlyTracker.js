const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const monthlyTrackSchema = mongoose.Schema({
    userId: {
        type: ObjectId,
        require: true
    },
    month: {
        type: String
    },
    year: {
        type: Number
    },
    budgetLimit: {
        type: Number
    },
    expenses: [{
        date: {
            type: Date
        },
        amount: {
            type: Number
        },
        category: {
            type: String
        }
    }
    ]
}, {
    timestamps: true,
    versionKey: false
})


module.exports = mongoose.model("monthlyTrack", monthlyTrackSchema)