const mongoose = require("mongoose")

const subUser = new mongoose.Schema({
    userID: {type: String, default: ""},
    subs: [], 
    donations: [],
    currentSubEndDate: {type: String, default: ""},
    infinite: {type: Boolean, default: false}
})

module.exports = mongoose.model("subUser", subUser)