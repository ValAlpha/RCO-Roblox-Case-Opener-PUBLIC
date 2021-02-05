const mongoose = require("mongoose")

const stats = new mongoose.Schema({

    dbID: String,
    servers: String, 
    profiles: String

})

module.exports = mongoose.model('stats', stats)