const mongoose = require("mongoose");

const achSchema = new mongoose.Schema({
    dbID: { type: String, default: "" },
    allCases: {
        tenCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 1000 },
        },

        fiftyCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 1000 },
        },

        oneHundredCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 2000 },
        },

        fiveHundredCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 5000 },
        },

        oneThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 10000 },
        },

        fiveThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 15000 },
        },

        oneHundredThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 100000 },
        },
    },

    noob: {

        tenCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 1000 },
        },

        fiftyCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 1000 },
        },

        oneHundredCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 2000 },
        },

        fiveHundredCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 5000 },
        },

        oneThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 10000 },
        },

        fiveThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 15000 },
        },

        oneHundredThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 100000 },
        }
    },

    copper: {

        tenCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 1000 },
        },

        fiftyCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 1000 },
        },

        oneHundredCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 2000 },
        },

        fiveHundredCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 5000 },
        },

        oneThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 10000 },
        },

        fiveThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 15000 },
        },

        oneHundredThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 100000 },
        },
    },

    bronze: {

        tenCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 1000 },
        },

        fiftyCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 1000 },
        },

        oneHundredCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 2000 },
        },

        fiveHundredCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 5000 },
        },

        oneThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 10000 },
        },

        fiveThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 15000 },
        },

        oneHundredThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 100000 },
        },
    },

    iron: {

        tenCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 1000 },
        },

        fiftyCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 1000 },
        },

        oneHundredCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 2000 },
        },

        fiveHundredCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 5000 },
        },

        oneThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 10000 },
        },

        fiveThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 15000 },
        },

        oneHundredThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 100000 },
        },
    },

    silver: {

        tenCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 1000 },
        },

        fiftyCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 1000 },
        },

        oneHundredCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 2000 },
        },

        fiveHundredCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 5000 },
        },

        oneThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 10000 },
        },

        fiveThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 15000 },
        },

        oneHundredThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 100000 },
        },
    },

    gold: {

        tenCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 1000 },
        },

        fiftyCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 1000 },
        },

        oneHundredCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 2000 },
        },

        fiveHundredCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 5000 },
        },

        oneThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 10000 },
        },

        fiveThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 15000 },
        },

        oneHundredThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 100000 },
        },
    },

    diamond: {

        tenCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 1000 },
        },

        fiftyCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 1000 },
        },

        oneHundredCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 2000 },
        },

        fiveHundredCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 5000 },
        },

        oneThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 10000 },
        },

        fiveThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 15000 },
        },

        oneHundredThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 100000 },
        },
    },

    ruby: {

        tenCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 1000 },
        },

        fiftyCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 1000 },
        },

        oneHundredCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 2000 },
        },

        fiveHundredCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 5000 },
        },

        oneThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 10000 },
        },

        fiveThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 15000 },
        },

        oneHundredThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 100000 },
        },
    },

    emerald: {

        tenCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 1000 },
        },

        fiftyCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 1000 },
        },

        oneHundredCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 2000 },
        },

        fiveHundredCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 5000 },
        },

        oneThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 10000 },
        },

        fiveThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 15000 },
        },

        oneHundredThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 100000 },
        },
    },

    amethyst: {

        tenCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 1000 },
        },

        fiftyCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 1000 },
        },

        oneHundredCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 2000 },
        },

        fiveHundredCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 5000 },
        },

        oneThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 10000 },
        },

        fiveThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 15000 },
        },

        oneHundredThousandCases: {
            completed: { type: Array, default: [] },
            reward: { type: Number, default: 100000 },
        },
    }
});

module.exports = mongoose.model("Achievements", achSchema);