const mongoose = require("mongoose");

const inv = {
    name: String,
    itemID: String,
    amount: 0,
    itemWorth: 0,
    totalValue: 0,
    itemType: String,
    limited: Boolean,
    locked: { type: Boolean, default: false },
}

const pet = {
    type: String, 
    rarity: String, 
    coinBoost: Number,
    amount: Number,
    equipped: Boolean,
    emojiID: String,
    petID: String,
    imgLink: String
}

const profileSchema = new mongoose.Schema({
    id: { type: String, default: "" },
    tag: { type: String, default: "" },
    balance: { type: Number, default: 2000 },
    value: { type: Number, default: 0 },
    createdAt: { type: String },
    blockedUsers: [],
    inventory: [inv],
    pets: [],
    betaTester: { type: Boolean, default: false },
    defaultCrate: { type: String, default: "noob" },
    canPay: {type: String, default: ""},
    profileID: {type: String, default: ""},

    //Daily
    daily: { type: String, default: "" },
    spins: { type: Number, default: 0 },

    //rob & swap
    rob: {type: String, default: ""},
    swap: {type: String, default: ""},

    //Trading
    isTrading: { type: Boolean, default: false },
    tradeCount: {type: Number, default: 0},
    tempStorage: [inv],
    accepted: { type: Boolean, default: false },
    disableTrades: { type: Boolean, default: false },

    //Upgrades
    invSize: { type: Number, default: 100 },
    caseMultiplier: { type: Number, default: 0 },

    //achievement stuff
    casesOpened: { type: Number, default: 0 },
    noobOpened: { type: Number, default: 0 },
    bronzeOpened: { type: Number, default: 0 },
    silverOpened: { type: Number, default: 0 },
    goldOpened: { type: Number, default: 0 },
    epicOpened: { type: Number, default: 0 },

    //Rebirth stuff
    rebirthLevel: { type: Number, default: 0 },
    rebirthTokens: { type: Number, default: 0 },
    caseDiscount: { type: Number, default: 0 },
    invSizeUpgradable: {type: Boolean, default: true},
    caseDiscountUpgradable: {type: Boolean, default: true},
    multiCaseUnlocked: {type: Boolean, default: false},
    invSizeCost: {type: Number, default: 1}, 
    caseDiscountCost: {type: Number, default: 1},

    //Clan Stuff
    currentClanID: {type: String, default: ""},
    hasHadClan: {type: Boolean, default: false},
    clanInvites: {type: Array, default: []},

    saleBonus: {type: Number, default: 0},

    pumpkinBadge: {type: Boolean, default: false}
    
});

module.exports = mongoose.model("Profile", profileSchema);
