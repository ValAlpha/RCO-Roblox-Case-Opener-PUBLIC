const mongoose = require("mongoose")

const betatesterSchema = new mongoose.Schema({
    dbID: { type: String, default: "" },
    testers: [{
        userID: { type: String, default: "" },
        tag: { type: String, default: "" }
    }]


})

module.exports = mongoose.model("Beta Testers", betatesterSchema)