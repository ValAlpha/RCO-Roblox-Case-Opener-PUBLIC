const mongoose = require("mongoose")

const subServers = new mongoose.Schema({

    serverID: {type: String, default: ""}, 
    subs: [],
    currentSubEndDate: {type: String, default: ""},
    infinite: {type: Boolean, default: false}

})

module.exports = mongoose.model("subServers", subServers)