const mongoose = require("mongoose")

const bannedUsers = new mongoose.Schema({

    userID: String, 
    reason: String, 
    bannedBy: String,
    date: String

})

module.exports = mongoose.model("bannedUsers", bannedUsers)