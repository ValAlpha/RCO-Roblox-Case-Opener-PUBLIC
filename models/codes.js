const mongoose = require("mongoose")


const codesSchema = new mongoose.Schema({

    dbID: { type: String, default: "" },
    codes: [{
        code: { type: String, default: "" },
        reward: { type: Number, default: 0 },
        type: { type: String, default: "" },
        item: {
            name: { type: String, default: "" },
            itemID: { type: String, default: "" },
            amount: { type: Number, default: 0 },
            itemWorth: { type: Number, default: 0 },
            totalValue: { type: Number, default: 0 },
            itemType: { type: String, default: "" },
            limited: { type: Boolean, default: false },
            locked: { type: Boolean, default: false },
        },
        claimed: { type: Array, default: [] }
    }]

})

module.exports = mongoose.model("codes", codesSchema)