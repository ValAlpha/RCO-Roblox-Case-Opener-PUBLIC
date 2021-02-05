const mongoose = require("mongoose")

const tradeSchema = new mongoose.Schema({
    traders: []
})

// {
//     itemID: String,
//     itemName: String,
//     amount: 0,
// }




module.exports = mongoose.model('trades', tradeSchema)