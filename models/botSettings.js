const mongoose = require("mongoose")

const botSettings = new mongoose.Schema({

    ownerID: { type: String, default: DB_ID },
    globalDoubleMoney: { type: Boolean, default: false },
    globalHalfPrice: { type: Boolean, default: false },
    cases: {
        noob: {
            price: { type: Number, default: 10 },
            doubleMoney: { type: Boolean, default: false },
            halfPrice: { type: Boolean, default: false }
        },
        copper: {
            price: { type: Number, default: 50 },
            doubleMoney: { type: Boolean, default: false },
            halfPrice: { type: Boolean, default: false }
        },
        bronze: {
            price: { type: Number, default: 200 },
            doubleMoney: { type: Boolean, default: false },
            halfPrice: { type: Boolean, default: false }
        },
        iron: {
            price: { type: Number, default: 500 },
            doubleMoney: { type: Boolean, default: false },
            halfPrice: { type: Boolean, default: false }
        },
        silver: {
            price: { type: Number, default: 1000 },
            doubleMoney: { type: Boolean, default: false },
            halfPrice: { type: Boolean, default: false }
        },
        gold: {
            price: { type: Number, default: 1000 },
            doubleMoney: { type: Boolean, default: false },
            halfPrice: { type: Boolean, default: false }
        },
        diamond: {
            price: { type: Number, default: 1000 },
            doubleMoney: { type: Boolean, default: false },
            halfPrice: { type: Boolean, default: false }
        },
        ruby: {
            price: { type: Number, default: 1000 },
            doubleMoney: { type: Boolean, default: false },
            halfPrice: { type: Boolean, default: false }
        },
        emerald: {
            price: { type: Number, default: 1000 },
            doubleMoney: { type: Boolean, default: false },
            halfPrice: { type: Boolean, default: false }
        },
        amethyst: {
            price: { type: Number, default: 1000 },
            doubleMoney: { type: Boolean, default: false },
            halfPrice: { type: Boolean, default: false }
        }
    }

})

module.exports = mongoose.model("Bot settings", botSettings)