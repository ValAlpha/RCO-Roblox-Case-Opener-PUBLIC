const mongoose = require("mongoose")

const petSchema = new mongoose.Schema({
    petID: { type: String, default: "" },
    age: { type: String, default: "" },
    name: { type: String, default: "" },
    perMin: { type: Number, default: "" },
    lastCollected: { type: String, default: "" },
    petType: { type: String, default: "" },
    img: { type: String, default: "" }
})

module.exports = mongoose.model("Pet", petSchema)