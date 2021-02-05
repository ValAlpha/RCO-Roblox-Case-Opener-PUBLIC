const mongoose = require("mongoose")

const bannedServers = new mongoose.Schema({
    serverID: String, 
    reason: String, 
    bannedBy: String, 
    date: String
})

module.exports = mongoose.model("bannedServers", bannedServers)