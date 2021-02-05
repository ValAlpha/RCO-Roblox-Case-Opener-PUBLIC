const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const { stripIndents, stripIndent } = require("common-tags");
const moment = require("moment");
require("moment-duration-format");
const toDecimal = require("to-decimal")
const { abbreviateNumber } = require("js-abbreviation-number")

//Imported Functions
const getNoobItems = require("../../functions/getItems/noob");
const getCopperItems = require("../../functions/getItems/copper")
const getBronzeItems = require("../../functions/getItems/bronze")
const getIronItems = require("../../functions/getItems/iron")
const getSilverItems = require("../../functions/getItems/silver")
const getGoldItems = require("../../functions/getItems/gold")
const getDiamondItems = require("../../functions/getItems/diamond")
const getRubyItems = require("../../functions/getItems/ruby")
const getEmeraldItems = require("../../functions/getItems/emerald")
const getAmethystItems = require("../../functions/getItems/amethyst")

const caseHex = require("../../utils/colours").caseHex

module.exports = class open extends Command {
    constructor(client) {
        super(client, {
            name: "open",
            description: "Open cases",
            group: "main",
            memberName: "main",
            aliases: ["o"],
            throttling: {
                duration: 5,
                usages: 2,
            },
            args: [{
                type: "string",
                prompt: "How many cases?",
                key: "amount",
                default: 1,
                parse: (string) => {
                    let num = parseInt(string);
                    if (isNaN(num)) {
                        if (string.toLowerCase() !== "max") return 1;
                        return "max";
                    } else {
                        if (num >= 10) return 10;
                        return num;
                    }
                }
            }]
        });
    }

    async run(msg, { amount }) {
        const noItemEmbed = new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`I was unable to grab the item info, please try again later.`)
            .setColor("RED")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))

        const reportError = (content, channelID = "703176851467796582") => {
            let ch = this.client.channels.cache.get(channelID);
            if (ch) return ch.send(
                new MessageEmbed()
                    .setAuthor(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(content)
                    .setColor(`RED`)
                    .setTimestamp()
            ).catch(() => console.log(`I was unable to send to the log channel:\n`, content))
        }
        let p = await this.client.dbs.profile.findOne({ id: msg.author.id });
        let BS = await this.client.dbs.botsettings.findOne({ ownerID: DB_ID });

        //!Temp
        const pumpkinEmoji = this.client.emojis.cache.get("762102187651235870")
        let moneyEmoji = this.client.emojis.cache.get("696719071009570848"),
            betaEmoji = this.client.emojis.cache.get("702063612037955584"),
            createdAt = moment().format("MMMM Do YYYY, h:mm:ss a");

        if (!BS) return msg.say(`Oops, There's an error connecting with the database. The devs have been notified`).then(reportError(`The BotSettings database is missing!!`));

        if (!p) p = await new this.client.dbs.profile({
            id: msg.author.id,
            tag: msg.author.tag,
            createdAt,
            betaTester: false,
        }).save().catch(() => { });





        let item,
            items,
            amountOpened = 1,
            crate = p.defaultCrate;

        //!Beta Test stuffs

        let BT = await this.client.dbs.betatesters.findOne({ dbID: this.client.user.id });
        let betaTesters = BT.testers.map(c => c.userID);


        const VIP = async (userID) => {
            let res = await require("superagent").get(`${process.env.CLIENT_IP}:${process.env.CLIENT_PORT}/members/${userID}/vip`).catch((err) => console.log(err));
            if (!res) return;
            if (res.status !== 200) return;
            if (res.body.status !== true) return;
            return res.body.tier;
        }

        let isVip = await VIP(msg.author.id)
        let vipEmoji = ``

        isVip > 0 ? vipEmoji = this.client.emojis.cache.get("767369283117514772") : ``


        const MOD = async (userID) => {
            let res = await require("superagent").get(`${process.env.CLIENT_IP}:${process.env.CLIENT_PORT}/members/${userID}/mod`).catch((err) => console.log(err));
            if (!res) return 0;
            if (res.status !== 200) return 0;
            if (res.body.status !== true) return 0;
            return res.body.mod;
        }
        let isMod = await MOD(msg.author.id)

        // ----- NOOB CASE ----

        if (crate.toLowerCase() === "noob") {

            let caseCost = BS.cases[crate].price
            let perc = toDecimal(p.caseDiscount)
            let sum = Math.floor(caseCost - (perc * caseCost))

            if (amount === 'max') {

                if (p.multiCaseUnlocked === false) return msg.say(new MessageEmbed()
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`You need to unlock this via 20 rebirth tokens first!`)
                    .setColor("RANDOM")
                    .setTimestamp()
                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                let totalCanBuy = Math.floor(p.balance / sum)
                let amountToBuy = totalCanBuy <= 10 ? totalCanBuy : 10
                amountOpened = amountToBuy

                if (amountToBuy < 1) return msg.say(new MessageEmbed()
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${crate} cases cost ${abbreviateNumber(sum, 2)} and you only have ${abbreviateNumber(p.balance, 2)}`)
                    .setColor("RANDOM")
                    .setTimestamp()
                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                items = getNoobItems.getAmountItems(amountToBuy)
                if (items.items.length < 2) item = getNoobItems.getNoobItems()

                p.balance -= (sum * amountToBuy)

            } else if (amount > 1) {

                if (p.multiCaseUnlocked === false) return msg.say(new MessageEmbed()
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`You need to unlock this via 20 rebirth tokens first!`)
                    .setColor("RANDOM")
                    .setTimestamp()
                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                let cost = sum * amount
                let canBuy = p.balance / sum
                let amountToBuy = amount <= 10 ? amount : 10
                amountOpened = amountToBuy



                if (p.balance < cost) return msg.say(new MessageEmbed()
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`You only have enough for ${canBuy > 10 ? `10` : canBuy}`)
                    .setColor("RED")
                    .setTimestamp()
                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                items = getNoobItems.getAmountItems(amountToBuy)
                p.balance -= (sum * amountToBuy)


            } else {

                let sum = Math.floor(caseCost - (perc * caseCost))

                if (p.balance < sum) {
                    return msg.say(new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setDescription(`${crate} cases cost ${abbreviateNumber(sum, 2)} and you only have ${p.balance}`)
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))
                } else {

                    p.balance -= sum;

                    item = getNoobItems.getNoobItems()
                    if (!item) return msg.say(noItemEmbed).catch(() => { });
                }
            }

        } else


            // ----- COPPER CASE ----

            if (crate.toLowerCase() === "copper") {

                let caseCost = BS.cases[crate].price
                let perc = toDecimal(p.caseDiscount)
                let sum = Math.floor(caseCost - (perc * caseCost))

                if (amount === 'max') {

                    if (p.multiCaseUnlocked === false) return msg.say(new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setDescription(`You need to unlock this via 20 rebirth tokens first!`)
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                    let totalCanBuy = Math.floor(p.balance / sum)
                    let amountToBuy = totalCanBuy <= 10 ? totalCanBuy : 10
                    amountOpened = amountToBuy
                    if (amountToBuy < 1) return msg.say(new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setDescription(`${crate} cases cost ${abbreviateNumber(sum, 2)} and you only have ${abbreviateNumber(p.balance, 2)}`)
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                    items = getCopperItems.getAmountItems(amountToBuy)

                    if (items.items.length < 2) item = getCopperItems.getCopperItems()

                    p.balance -= (sum * amountToBuy)

                } else if (amount > 1) {

                    if (p.multiCaseUnlocked === false) return msg.say(new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setDescription(`You need to unlock this via 20 rebirth tokens first!`)
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                    let cost = sum * amount
                    let canBuy = p.balance / sum
                    let amountToBuy = amount <= 10 ? amount : 10
                    amountOpened = amountToBuy


                    if (p.balance < cost) return msg.say(new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setDescription(`You only have enough for ${canBuy > 10 ? `10` : canBuy}`)
                        .setColor("RED")
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))


                    items = getCopperItems.getAmountItems(amountToBuy)
                    p.balance -= (sum * amountToBuy)


                } else {

                    let sum = Math.floor(caseCost - (perc * caseCost))

                    if (p.balance < sum) {
                        return msg.say(new MessageEmbed()
                            .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                            .setDescription(`${crate} cases cost ${abbreviateNumber(sum, 2)} and you only have ${p.balance}`)
                            .setColor("RANDOM")
                            .setTimestamp()
                            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))
                    } else {

                        p.balance -= sum;

                        item = getCopperItems.getCopperItems()
                        if (!item) return msg.say(noItemEmbed).catch(() => { });
                    }
                }
            } else

                // ----- BRONZE CASE ----

                if (crate.toLowerCase() === "bronze") {

                    let caseCost = BS.cases[crate].price
                    let perc = toDecimal(p.caseDiscount)
                    let sum = Math.floor(caseCost - (perc * caseCost))

                    if (amount === 'max') {

                        if (p.multiCaseUnlocked === false) return msg.say(new MessageEmbed()
                            .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                            .setDescription(`You need to unlock this via 20 rebirth tokens first!`)
                            .setColor("RANDOM")
                            .setTimestamp()
                            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))
                        let totalCanBuy = Math.floor(p.balance / sum)
                        let amountToBuy = totalCanBuy <= 10 ? totalCanBuy : 10
                        amountOpened = amountToBuy
                        if (amountToBuy < 1) return msg.say(new MessageEmbed()
                            .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                            .setDescription(`${crate} cases cost ${abbreviateNumber(sum, 2)} and you only have ${abbreviateNumber(p.balance, 2)}`)
                            .setColor("RANDOM")
                            .setTimestamp()
                            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                        items = getBronzeItems.getAmountItems(amountToBuy)
                        if (items.items.length < 2) item = getBronzeItems.getBronzeItems()
                        p.balance -= (sum * amountToBuy)

                    } else if (amount > 1) {

                        if (p.multiCaseUnlocked === false) return msg.say(new MessageEmbed()
                            .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                            .setDescription(`You need to unlock this via 20 rebirth tokens first!`)
                            .setColor("RANDOM")
                            .setTimestamp()
                            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                        let cost = sum * amount
                        let canBuy = p.balance / sum
                        let amountToBuy = amount <= 10 ? amount : 10
                        amountOpened = amountToBuy


                        if (p.balance < cost) return msg.say(new MessageEmbed()
                            .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                            .setDescription(`You only have enough for ${canBuy > 10 ? `10` : canBuy}`)
                            .setColor("RED")
                            .setTimestamp()
                            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))


                        items = getBronzeItems.getAmountItems(amountToBuy)
                        p.balance -= (sum * amountToBuy)


                    } else {

                        let sum = Math.floor(caseCost - (perc * caseCost))

                        if (p.balance < sum) {
                            return msg.say(new MessageEmbed()
                                .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                .setDescription(`${crate} cases cost ${abbreviateNumber(sum, 2)} and you only have ${p.balance}`)
                                .setColor("RANDOM")
                                .setTimestamp()
                                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))
                        } else {

                            p.balance -= sum;

                            item = getBronzeItems.getBronzeItems()
                            if (!item) return msg.say(noItemEmbed).catch(() => { });
                        }
                    }
                } else

                    // ----- IRON CASE ----

                    if (crate.toLowerCase() === "iron") {

                        let caseCost = BS.cases[crate].price
                        let perc = toDecimal(p.caseDiscount)
                        let sum = Math.floor(caseCost - (perc * caseCost))

                        if (amount === 'max') {

                            if (p.multiCaseUnlocked === false) return msg.say(new MessageEmbed()
                                .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                .setDescription(`You need to unlock this via 20 rebirth tokens first!`)
                                .setColor("RANDOM")
                                .setTimestamp()
                                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))
                            let totalCanBuy = Math.floor(p.balance / sum)
                            let amountToBuy = totalCanBuy <= 10 ? totalCanBuy : 10
                            amountOpened = amountToBuy
                            if (amountToBuy < 1) return msg.say(new MessageEmbed()
                                .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                .setDescription(`${crate} cases cost ${abbreviateNumber(sum, 2)} and you only have ${abbreviateNumber(p.balance, 2)}`)
                                .setColor("RANDOM")
                                .setTimestamp()
                                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                            items = getIronItems.getAmountItems(amountToBuy)
                            if (items.items.length < 2) item = getIronItems.getIronItems()
                            p.balance -= (sum * amountToBuy)

                        } else if (amount > 1) {

                            if (p.multiCaseUnlocked === false) return msg.say(new MessageEmbed()
                                .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                .setDescription(`You need to unlock this via 20 rebirth tokens first!`)
                                .setColor("RANDOM")
                                .setTimestamp()
                                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                            let cost = sum * amount
                            let canBuy = p.balance / sum
                            let amountToBuy = amount <= 10 ? amount : 10
                            amountOpened = amountToBuy


                            if (p.balance < cost) return msg.say(new MessageEmbed()
                                .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                .setDescription(`You only have enough for ${canBuy > 10 ? `10` : canBuy}`)
                                .setColor("RED")
                                .setTimestamp()
                                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))


                            items = getIronItems.getAmountItems(amountToBuy)
                            p.balance -= (sum * amountToBuy)


                        } else {

                            let sum = Math.floor(caseCost - (perc * caseCost))

                            if (p.balance < sum) {
                                return msg.say(new MessageEmbed()
                                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                    .setDescription(`${crate} cases cost ${abbreviateNumber(sum, 2)} and you only have ${p.balance}`)
                                    .setColor("RANDOM")
                                    .setTimestamp()
                                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))
                            } else {

                                p.balance -= sum;

                                item = getIronItems.getIronItems()
                                if (!item) return msg.say(noItemEmbed).catch(() => { });
                            }
                        }
                    } else

                        // ----- SILVER CASE ----

                        if (crate.toLowerCase() === "silver") {

                            let caseCost = BS.cases[crate].price
                            let perc = toDecimal(p.caseDiscount)
                            let sum = Math.floor(caseCost - (perc * caseCost))

                            if (amount === 'max') {

                                if (p.multiCaseUnlocked === false) return msg.say(new MessageEmbed()
                                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                    .setDescription(`You need to unlock this via 20 rebirth tokens first!`)
                                    .setColor("RANDOM")
                                    .setTimestamp()
                                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                                let totalCanBuy = Math.floor(p.balance / sum)
                                let amountToBuy = totalCanBuy <= 10 ? totalCanBuy : 10
                                amountOpened = amountToBuy
                                if (amountToBuy < 1) return msg.say(new MessageEmbed()
                                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                    .setDescription(`${crate} cases cost ${abbreviateNumber(sum, 2)} and you only have ${abbreviateNumber(p.balance, 2)}`)
                                    .setColor("RANDOM")
                                    .setTimestamp()
                                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                                items = getSilverItems.getAmountItems(amountToBuy)
                                if (items.items.length < 2) item = getSilverItems.getSilverItems()
                                p.balance -= (sum * amountToBuy)

                            } else if (amount > 1) {

                                if (p.multiCaseUnlocked === false) return msg.say(new MessageEmbed()
                                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                    .setDescription(`You need to unlock this via 20 rebirth tokens first!`)
                                    .setColor("RANDOM")
                                    .setTimestamp()
                                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                                let cost = sum * amount
                                let canBuy = p.balance / sum
                                let amountToBuy = amount <= 10 ? amount : 10
                                amountOpened = amountToBuy


                                if (p.balance < cost) return msg.say(new MessageEmbed()
                                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                    .setDescription(`You only have enough for ${canBuy > 10 ? `10` : canBuy}`)
                                    .setColor("RED")
                                    .setTimestamp()
                                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))


                                items = getSilverItems.getAmountItems(amountToBuy)
                                p.balance -= (sum * amountToBuy)


                            } else {

                                let sum = Math.floor(caseCost - (perc * caseCost))

                                if (p.balance < sum) {
                                    return msg.say(new MessageEmbed()
                                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                        .setDescription(`${crate} cases cost ${abbreviateNumber(sum, 2)} and you only have ${p.balance}`)
                                        .setColor("RANDOM")
                                        .setTimestamp()
                                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))
                                } else {

                                    p.balance -= sum;

                                    item = getSilverItems.getSilverItems()
                                    if (!item) return msg.say(noItemEmbed).catch(() => { });
                                }
                            }
                        } else

                            // ----- GOLD CASE ----

                            if (crate.toLowerCase() === "gold") {

                                let caseCost = BS.cases[crate].price
                                let perc = toDecimal(p.caseDiscount)
                                let sum = Math.floor(caseCost - (perc * caseCost))

                                if (amount === 'max') {

                                    if (p.multiCaseUnlocked === false) return msg.say(new MessageEmbed()
                                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                        .setDescription(`You need to unlock this via 20 rebirth tokens first!`)
                                        .setColor("RANDOM")
                                        .setTimestamp()
                                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                                    let totalCanBuy = Math.floor(p.balance / sum)
                                    let amountToBuy = totalCanBuy <= 10 ? totalCanBuy : 10
                                    amountOpened = amountToBuy
                                    if (amountToBuy < 1) return msg.say(new MessageEmbed()
                                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                        .setDescription(`${crate} cases cost ${abbreviateNumber(sum, 2)} and you only have ${abbreviateNumber(p.balance, 2)}`)
                                        .setColor("RANDOM")
                                        .setTimestamp()
                                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                                    items = getGoldItems.getAmountItems(amountToBuy)
                                    if (items.items.length < 2) item = getGoldItems.getGoldItems()
                                    p.balance -= (sum * amountToBuy)

                                } else if (amount > 1) {

                                    if (p.multiCaseUnlocked === false) return msg.say(new MessageEmbed()
                                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                        .setDescription(`You need to unlock this via 20 rebirth tokens first!`)
                                        .setColor("RANDOM")
                                        .setTimestamp()
                                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                                    let cost = sum * amount
                                    let canBuy = p.balance / sum
                                    let amountToBuy = amount <= 10 ? amount : 10
                                    amountOpened = amountToBuy


                                    if (p.balance < cost) return msg.say(new MessageEmbed()
                                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                        .setDescription(`You only have enough for ${canBuy > 10 ? `10` : canBuy}`)
                                        .setColor("RED")
                                        .setTimestamp()
                                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))


                                    items = getGoldItems.getAmountItems(amountToBuy)
                                    p.balance -= (sum * amountToBuy)


                                } else {

                                    let sum = Math.floor(caseCost - (perc * caseCost))

                                    if (p.balance < sum) {
                                        return msg.say(new MessageEmbed()
                                            .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                            .setDescription(`${crate} cases cost ${abbreviateNumber(sum, 2)} and you only have ${p.balance}`)
                                            .setColor("RANDOM")
                                            .setTimestamp()
                                            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))
                                    } else {

                                        p.balance -= sum;

                                        item = getGoldItems.getGoldItems()
                                        if (!item) return msg.say(noItemEmbed).catch(() => { });
                                    }
                                }

                            } else

                                // ----- DIAMOND CASE ----

                                if (crate.toLowerCase() === "diamond") {

                                    let caseCost = BS.cases[crate].price
                                    let perc = toDecimal(p.caseDiscount)
                                    let sum = Math.floor(caseCost - (perc * caseCost))

                                    if (amount === 'max') {

                                        if (p.multiCaseUnlocked === false) return msg.say(new MessageEmbed()
                                            .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                            .setDescription(`You need to unlock this via 20 rebirth tokens first!`)
                                            .setColor("RANDOM")
                                            .setTimestamp()
                                            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                                        let totalCanBuy = Math.floor(p.balance / sum)
                                        let amountToBuy = totalCanBuy <= 10 ? totalCanBuy : 10
                                        amountOpened = amountToBuy
                                        if (amountToBuy < 1) return msg.say(new MessageEmbed()
                                            .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                            .setDescription(`${crate} cases cost ${abbreviateNumber(sum, 2)} and you only have ${abbreviateNumber(p.balance, 2)}`)
                                            .setColor("RANDOM")
                                            .setTimestamp()
                                            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                                        items = getDiamondItems.getAmountItems(amountToBuy)
                                        if (items.items.length < 2) item = getDiamondItems.getDiamondItems()
                                        p.balance -= (sum * amountToBuy)

                                    } else if (amount > 1) {

                                        if (p.multiCaseUnlocked === false) return msg.say(new MessageEmbed()
                                            .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                            .setDescription(`You need to unlock this via 20 rebirth tokens first!`)
                                            .setColor("RANDOM")
                                            .setTimestamp()
                                            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                                        let cost = sum * amount
                                        let canBuy = p.balance / sum
                                        let amountToBuy = amount <= 10 ? amount : 10
                                        amountOpened = amountToBuy


                                        if (p.balance < cost) return msg.say(new MessageEmbed()
                                            .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                            .setDescription(`You only have enough for ${canBuy > 10 ? `10` : canBuy}`)
                                            .setColor("RED")
                                            .setTimestamp()
                                            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))


                                        items = getDiamondItems.getAmountItems(amountToBuy)
                                        p.balance -= (sum * amountToBuy)


                                    } else {

                                        let sum = Math.floor(caseCost - (perc * caseCost))

                                        if (p.balance < sum) {
                                            return msg.say(new MessageEmbed()
                                                .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                                .setDescription(`${crate} cases cost ${abbreviateNumber(sum, 2)} and you only have ${p.balance}`)
                                                .setColor("RANDOM")
                                                .setTimestamp()
                                                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))
                                        } else {

                                            p.balance -= sum;

                                            item = getDiamondItems.getDiamondItems()
                                            if (!item) return msg.say(noItemEmbed).catch(() => { });
                                        }
                                    }

                                } else

                                    //RUBY CASE

                                    if (crate.toLowerCase() === "ruby") {

                                        let caseCost = BS.cases[crate].price
                                        let perc = toDecimal(p.caseDiscount)
                                        let sum = Math.floor(caseCost - (perc * caseCost))

                                        if (amount === 'max') {

                                            if (p.multiCaseUnlocked === false) return msg.say(new MessageEmbed()
                                                .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                                .setDescription(`You need to unlock this via 20 rebirth tokens first!`)
                                                .setColor("RANDOM")
                                                .setTimestamp()
                                                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                                            let totalCanBuy = Math.floor(p.balance / sum)
                                            let amountToBuy = totalCanBuy <= 10 ? totalCanBuy : 10
                                            amountOpened = amountToBuy
                                            if (amountToBuy < 1) return msg.say(new MessageEmbed()
                                                .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                                .setDescription(`${crate} cases cost ${abbreviateNumber(sum, 2)} and you only have ${abbreviateNumber(p.balance, 2)}`)
                                                .setColor("RANDOM")
                                                .setTimestamp()
                                                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                                            items = getRubyItems.getAmountItems(amountToBuy)

                                            if (items.items.length < 2) item = getRubyItems.getRubyItems()

                                            p.balance -= (sum * amountToBuy)

                                        } else if (amount > 1) {

                                            if (p.multiCaseUnlocked === false) return msg.say(new MessageEmbed()
                                                .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                                .setDescription(`You need to unlock this via 20 rebirth tokens first!`)
                                                .setColor("RANDOM")
                                                .setTimestamp()
                                                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                                            let cost = sum * amount
                                            let canBuy = p.balance / sum
                                            let amountToBuy = amount <= 10 ? amount : 10
                                            amountOpened = amountToBuy


                                            if (p.balance < cost) return msg.say(new MessageEmbed()
                                                .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                                .setDescription(`You only have enough for ${canBuy > 10 ? `10` : canBuy}`)
                                                .setColor("RED")
                                                .setTimestamp()
                                                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))


                                            items = getRubyItems.getAmountItems(amountToBuy)
                                            p.balance -= (sum * amountToBuy)


                                        } else {

                                            let sum = Math.floor(caseCost - (perc * caseCost))

                                            if (p.balance < sum) {
                                                return msg.say(new MessageEmbed()
                                                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                                    .setDescription(`${crate} cases cost ${abbreviateNumber(sum, 2)} and you only have ${p.balance}`)
                                                    .setColor("RANDOM")
                                                    .setTimestamp()
                                                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))
                                            } else {

                                                p.balance -= sum;

                                                item = getRubyItems.getRubyItems()
                                                if (!item) return msg.say(noItemEmbed).catch(() => { });
                                            }
                                        }

                                    } else

                                        //EMERALD CASe

                                        if (crate.toLowerCase() === "emerald") {

                                            let caseCost = BS.cases[crate].price
                                            let perc = toDecimal(p.caseDiscount)
                                            let sum = Math.floor(caseCost - (perc * caseCost))

                                            if (amount === 'max') {

                                                if (p.multiCaseUnlocked === false) return msg.say(new MessageEmbed()
                                                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                                    .setDescription(`You need to unlock this via 20 rebirth tokens first!`)
                                                    .setColor("RANDOM")
                                                    .setTimestamp()
                                                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                                                let totalCanBuy = Math.floor(p.balance / sum)
                                                let amountToBuy = totalCanBuy <= 10 ? totalCanBuy : 10
                                                amountOpened = amountToBuy
                                                if (amountToBuy < 1) return msg.say(new MessageEmbed()
                                                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                                    .setDescription(`${crate} cases cost ${abbreviateNumber(sum, 2)} and you only have ${abbreviateNumber(p.balance, 2)}`)
                                                    .setColor("RANDOM")
                                                    .setTimestamp()
                                                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                                                items = getEmeraldItems.getAmountItems(amountToBuy)
                                                if (items.items.length < 2) item = getEmeraldItems.getEmeraldItems()
                                                p.balance -= (sum * amountToBuy)

                                            } else if (amount > 1) {

                                                if (p.multiCaseUnlocked === false) return msg.say(new MessageEmbed()
                                                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                                    .setDescription(`You need to unlock this via 20 rebirth tokens first!`)
                                                    .setColor("RANDOM")
                                                    .setTimestamp()
                                                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                                                let cost = sum * amount
                                                let canBuy = p.balance / sum
                                                let amountToBuy = amount <= 10 ? amount : 10
                                                amountOpened = amountToBuy


                                                if (p.balance < cost) return msg.say(new MessageEmbed()
                                                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                                    .setDescription(`You only have enough for ${canBuy > 10 ? `10` : canBuy}`)
                                                    .setColor("RED")
                                                    .setTimestamp()
                                                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))


                                                items = getEmeraldItems.getAmountItems(amountToBuy)
                                                p.balance -= (sum * amountToBuy)


                                            } else {

                                                let sum = Math.floor(caseCost - (perc * caseCost))

                                                if (p.balance < sum) {
                                                    return msg.say(new MessageEmbed()
                                                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                                        .setDescription(`${crate} cases cost ${abbreviateNumber(sum, 2)} and you only have ${p.balance}`)
                                                        .setColor("RANDOM")
                                                        .setTimestamp()
                                                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))
                                                } else {

                                                    p.balance -= sum;

                                                    item = getEmeraldItems.getEmeraldItems()
                                                    if (!item) return msg.say(noItemEmbed).catch(() => { });
                                                }
                                            }

                                        } else

                                            //AMETHYST CASE

                                            if (crate.toLowerCase() === "amethyst") {

                                                let caseCost = BS.cases[crate].price
                                                let perc = toDecimal(p.caseDiscount)
                                                let sum = Math.floor(caseCost - (perc * caseCost))

                                                if (amount === 'max') {

                                                    if (p.multiCaseUnlocked === false) return msg.say(new MessageEmbed()
                                                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                                        .setDescription(`You need to unlock this via 20 rebirth tokens first!`)
                                                        .setColor("RANDOM")
                                                        .setTimestamp()
                                                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                                                    let totalCanBuy = Math.floor(p.balance / sum)
                                                    let amountToBuy = totalCanBuy <= 10 ? totalCanBuy : 10
                                                    amountOpened = amountToBuy
                                                    if (amountToBuy < 1) return msg.say(new MessageEmbed()
                                                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                                        .setDescription(`${crate} cases cost ${abbreviateNumber(sum, 2)} and you only have ${abbreviateNumber(p.balance, 2)}`)
                                                        .setColor("RANDOM")
                                                        .setTimestamp()
                                                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                                                    items = getAmethystItems.getAmountItems(amountToBuy)
                                                    if (items.items.length < 2) item = getAmethystItems.getAmethystItems()
                                                    p.balance -= (sum * amountToBuy)

                                                } else if (amount > 1) {

                                                    if (p.multiCaseUnlocked === false) return msg.say(new MessageEmbed()
                                                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                                        .setDescription(`You need to unlock this via 20 rebirth tokens first!`)
                                                        .setColor("RANDOM")
                                                        .setTimestamp()
                                                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

                                                    let cost = sum * amount
                                                    let canBuy = p.balance / sum
                                                    let amountToBuy = amount <= 10 ? amount : 10
                                                    amountOpened = amountToBuy


                                                    if (p.balance < cost) return msg.say(new MessageEmbed()
                                                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                                        .setDescription(`You only have enough for ${canBuy > 10 ? `10` : canBuy}`)
                                                        .setColor("RED")
                                                        .setTimestamp()
                                                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))


                                                    items = getAmethystItems.getAmountItems(amountToBuy)
                                                    p.balance -= (sum * amountToBuy)


                                                } else {

                                                    let sum = Math.floor(caseCost - (perc * caseCost))

                                                    if (p.balance < sum) {
                                                        return msg.say(new MessageEmbed()
                                                            .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                                                            .setDescription(`${crate} cases cost ${abbreviateNumber(sum, 2)} and you only have ${p.balance}`)
                                                            .setColor("RANDOM")
                                                            .setTimestamp()
                                                            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))
                                                    } else {

                                                        p.balance -= sum;

                                                        item = getAmethystItems.getAmethystItems()
                                                        if (!item) return msg.say(noItemEmbed).catch(() => { });
                                                    }
                                                }
                                            }



        if (p && p.inventory.length + amountOpened > p.invSize) return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
            .setDescription(stripIndent`You can only have ${p.invSize} unique items in your inventory. ${p.invSize - p.invSize.length === 0 ? `You have no` : `You have ${p.invSize - p.inventory.length}`} slots left\n\n Go sell something or upgrade your inventory size!`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))).catch(() => { });

        let multiplierAmount = p.caseMultiplier;

        let btAmount = 1


        let amountToAdd = btAmount + multiplierAmount

        const saveFunction = async () => {
            if (!p) {
                new this.client.dbs.profile({
                    id: msg.author.id,
                    tag: msg.author.tag,
                    value: Math.floor(item.data.PriceInRobux * amountToAdd),
                    createdAt,
                    inventory: [{
                        name: item.data.Name,
                        itemID: item.data.AssetId,
                        amount: amountToAdd,
                        itemWorth: item.data.PriceInRobux,
                        totalValue: Math.floor(item.data.PriceInRobux * amountToAdd),
                        itemType: item.type,
                        limited: item.isLimited || item.IsLimitedUnique,
                    },],
                })
                    .save()
                    .catch((err) => console.log(err));
            } else {
                if (p.inventory.length === 0) {
                    p.tag !== msg.author.id ? p.tag = msg.author.tag : p.tag
                    let val = Math.floor(item.data.PriceInRobux * amountToAdd);
                    p.value = Math.floor(p.value + val);
                    p.inventory.push({
                        name: item.data.Name,
                        itemID: item.data.AssetId,
                        amount: amountToAdd,
                        itemWorth: item.data.PriceInRobux,
                        totalValue: Math.floor(item.data.PriceInRobux * amountToAdd),
                        itemType: item.type,
                        limited: item.isLimited || item.IsLimitedUnique,
                    });
                } else {
                    let find = p.inventory.find(c => c.itemID === item.data.AssetId);
                    if (!find) {
                        p.tag !== msg.author.id ? p.tag = msg.author.tag : p.tag
                        p.value += Math.floor(item.data.PriceInRobux * amountToAdd);
                        p.inventory.push({
                            name: item.data.Name,
                            itemID: item.data.AssetId,
                            amount: amountToAdd,
                            itemWorth: item.data.PriceInRobux,
                            totalValue: Math.floor(item.data.PriceInRobux * amountToAdd),
                            itemType: item.type,
                            limited: item.isLimited || item.IsLimitedUnique,
                        });
                    } else {
                        p.tag !== msg.author.id ? p.tag = msg.author.tag : p.tag
                        p.inventory = p.inventory.filter(c => c.itemID !== item.data.AssetId);
                        find.amount = find.amount + amountToAdd;
                        find.totalValue = item.data.PriceInRobux * find.amount;
                        p.inventory.push(find);
                        p.value += Math.floor(item.data.PriceInRobux * amountToAdd);
                    }
                }

                p.save().catch((err) => console.log(err));
            }
        };

        const multiSaveFunction = async () => {

            let totalValue = 0
            items.items.forEach(item => {
                totalValue += item.itemWorth
            })

            if (!p) {
                new this.client.dbs.profile({
                    id: msg.author.id,
                    value: totalValue,
                    createdAt,
                    inventory: items.items,
                })
                    .save()
                    .catch((err) => console.log(err));
            } else {
                if (p.inventory.length === 0) {
                    let val = Math.floor(totalValue * amountToAdd);
                    p.value = Math.floor(p.value + val);
                    items.items.forEach(item => {
                        p.inventory.push({
                            name: item.name,
                            itemID: item.itemID,
                            amount: amountToAdd,
                            itemWorth: item.itemWorth,
                            totalValue: Math.floor(item.itemWorth * amountToAdd),
                            itemType: item.itemType,
                            limited: item.limited
                        })
                    })
                } else {
                    items.items.forEach(item => {
                        let find = p.inventory.find(i => i.itemID === item.itemID)

                        if (!find) {
                            p.value += Math.floor(item.itemWorth * amountToAdd);
                            p.inventory.push({
                                name: item.name,
                                itemID: item.itemID,
                                amount: amountToAdd,
                                itemWorth: item.itemWorth,
                                totalValue: Math.floor(item.itemWorth * amountToAdd),
                                itemType: item.itemType,
                                limited: item.limited,
                            })

                        } else {
                            p.inventory = p.inventory.filter(c => c.itemID !== item.itemID);
                            find.amount = find.amount + amountToAdd;
                            find.totalValue = item.itemWorth * find.amount;
                            p.inventory.push(find);
                            p.value += Math.floor(item.itemWorth * amountToAdd);
                        }
                    })
                }
            }

        };


        //!Achievement stuff

        p.casesOpened = Math.floor(p.casesOpened + amountOpened);

        const AC = await this.client.dbs.achievements.findOne({ dbID: this.client.user.id });
        let allAchMsg = ``
        if (!AC) return reportError(`The Achievements database is missing!!`)

        // Cases opened: 10

        if (p.casesOpened >= 10 && !AC.allCases.tenCases.completed.includes(msg.author.id)) {

            allAchMsg = `- **Any 10 cases opened!**`

            AC.allCases.tenCases.completed.push(msg.author.id);

        } else

            // Cases opened: 50

            if (p.casesOpened >= 50 && !AC.allCases.fiftyCases.completed.includes(msg.author.id)) {
                allAchMsg = `- **Any 50 cases opened!**`

                AC.allCases.fiftyCases.completed.push(msg.author.id);

            } else

                // Cases opened: 100

                if (p.casesOpened >= 100 && !AC.allCases.oneHundredCases.completed.includes(msg.author.id)) {
                    allAchMsg = `- **Any 100 cases opened!**`

                    AC.allCases.oneHundredCases.completed.push(msg.author.id);

                } else

                    // Cases opened: 500

                    if (p.casesOpened >= 500 && !AC.allCases.fiveHundredCases.completed.includes(msg.author.id)) {
                        allAchMsg = `- **Any 500 cases opened!**`

                        AC.allCases.fiveHundredCases.completed.push(msg.author.id);

                    } else

                        // Cases opened: 1000

                        if (p.casesOpened >= 1000 && !AC.allCases.oneThousandCases.completed.includes(msg.author.id)) {
                            allAchMsg = `- **Any 1000 cases opened!**`

                            AC.allCases.oneThousandCases.completed.push(msg.author.id);

                        } else

                            // Cases opened: 5000

                            if (p.casesOpened >= 5000 && !AC.allCases.fiveThousandCases.completed.includes(msg.author.id)) {
                                allAchMsg = `- **Any 5000 cases opened!**`

                                AC.allCases.fiveThousandCases.completed.push(msg.author.id);
                            } else

                                // Cases opened: 100000

                                if (p.casesOpened >= 100000 && !AC.allCases.oneHundredThousandCases.completed.includes(msg.author.id)) {
                                    allAchMsg = `- **Any 100000 cases opened!**`

                                    AC.allCases.oneHundredThousandCases.completed.push(msg.author.id);
                                }


        if (crate.toLowerCase() === "noob") {

            p.noobOpened = Math.floor(p.noobOpened + amountOpened)

            let AchMsg = ``

            if (p.noobOpened >= 10 && !AC.noob.tenCases.completed.includes(msg.author.id)) {

                AchMsg = `- **10 noob cases opened!**`
                AC.noob.tenCases.completed.push(msg.author.id);

            } else if (p.noobOpened >= 50 && !AC.noob.fiftyCases.completed.includes(msg.author.id)) {

                AchMsg = `- **50 noob cases opened!**`
                AC.noob.fiftyCases.completed.push(msg.author.id);

            } else if (p.noobOpened >= 100 && !AC.noob.oneHundredCases.completed.includes(msg.author.id)) {

                AchMsg = `- **100 noob cases opened!**`
                AC.noob.oneHundredCases.completed.push(msg.author.id);

            } else if (p.noobOpened >= 500 && !AC.noob.fiveHundredCases.completed.includes(msg.author.id)) {

                AchMsg = `- **500 noob cases opened!**`
                AC.noob.fiveHundredCases.completed.push(msg.author.id);

            } else if (p.noobOpened >= 1000 && !AC.noob.oneThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **1000 noob cases opened!**`
                AC.noob.oneThousandCases.completed.push(msg.author.id);

            } else if (p.noobOpened >= 5000 && !AC.noob.fiveThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **5000 noob cases opened!**`
                AC.noob.fiveThousandCases.completed.push(msg.author.id);

            } else if (p.noobOpened >= 100000 && !AC.noob.oneHundredThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **100000 noob cases opened!**`
                AC.noob.oneHundredThousandCases.completed.push(msg.author.id);

            }


            if (items && items.items.length > 1) {

                let mappedItems = items.items.map(item => `- [${item.name}](https://www.roblox.com/catalog/${item.itemID}) ${abbreviateNumber(item.itemWorth, 2)} ${moneyEmoji}`).join(`\n`)

                let totalValue = 0
                items.items.forEach(item => totalValue += item.itemWorth)

                msg.say(
                    new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`You opened ${items.items.length} ${crate} cases`)
                        .setDescription(stripIndent`
                    • Items: 
                    ${mappedItems}
                    
                    • Total Value: ${abbreviateNumber(totalValue, 2)} ${moneyEmoji}
                    
                    • Balance: ${abbreviateNumber(p.balance, 2)} ${moneyEmoji}
                    ${!allAchMsg && !AchMsg ? `` : `__**Achievement(s)**__ \n ${allAchMsg}\n ${AchMsg}`}
                    ${vipEmoji} ${betaTesters.includes(msg.author.id) ? betaEmoji : ""} ${this.client.isOwner(msg.author.id) ? this.client.emojis.cache.get("743658003001245736") : ``} ${isMod !== 0 ? this.client.emojis.cache.get("763584614237077524") : ``} ${p.pumpkinBadge === true ? `${pumpkinEmoji}` : ``}`)
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                )

                multiSaveFunction()
                p.save().catch((err) => console.log(err));


            } else {
                let checkLimited = item.isLimited || item.IsLimitedUnique;

                saveFunction();

                msg.say(
                    new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`You opened a ${crate} case!`)
                        .setDescription(stripIndents`
                        • Item: **${item.data.Name}** X **${amountToAdd}**
                        • Item ID: **${item.data.AssetId}**
                        • Item value: **${abbreviateNumber(Math.round(item.data.PriceInRobux), 2)}**${moneyEmoji}
                        • Total value: **${abbreviateNumber(Math.round(amountToAdd * item.data.PriceInRobux), 2)}**${moneyEmoji}
                        • Type: **${item.type}**
                        ${checkLimited ? `‣✨Limited✨` : ``}
                        ${!allAchMsg && !AchMsg ? `` : `__**Achievement(s)**__ \n ${allAchMsg}\n ${AchMsg}`}
                        [Item Link](https://www.roblox.com/catalog/${item.data.AssetId})

                        • Balance: ${abbreviateNumber(p.balance, 2)} ${moneyEmoji}
                        ${vipEmoji} ${betaTesters.includes(msg.author.id) ? betaEmoji : ""} ${this.client.isOwner(msg.author.id) ? this.client.emojis.cache.get("743658003001245736") : ``} ${isMod !== 0 ? this.client.emojis.cache.get("763584614237077524") : ``} ${p.pumpkinBadge === true ? `${pumpkinEmoji}` : ``}`)
                        .setThumbnail(item.img)
                        .setColor(`${caseHex[crate]}`)
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                )
                    .catch((err) => { });

            }
        } else if (crate.toLowerCase() === "copper") {

            p.noobOpened = Math.floor(p.noobOpened + amountOpened)

            let AchMsg = ``

            if (p.copperOpened >= 10 && !AC.copper.tenCases.completed.includes(msg.author.id)) {

                AchMsg = `- **10 copper cases opened!**`
                AC.copper.tenCases.completed.push(msg.author.id);

            } else if (p.copperOpened >= 50 && !AC.copper.fiftyCases.completed.includes(msg.author.id)) {

                AchMsg = `- **50 copper cases opened!**`
                AC.copper.fiftyCases.completed.push(msg.author.id);

            } else if (p.copperOpened >= 100 && !AC.copper.oneHundredCases.completed.includes(msg.author.id)) {

                AchMsg = `- **100 copper cases opened!**`
                AC.copper.oneHundredCases.completed.push(msg.author.id);

            } else if (p.copperOpened >= 500 && !AC.copper.fiveHundredCases.completed.includes(msg.author.id)) {

                AchMsg = `- **500 copper cases opened!**`
                AC.copper.fiveHundredCases.completed.push(msg.author.id);

            } else if (p.copperOpened >= 1000 && !AC.copper.oneThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **1000 copper cases opened!**`
                AC.copper.oneThousandCases.completed.push(msg.author.id);

            } else if (p.copperOpened >= 5000 && !AC.copper.fiveThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **5000 copper cases opened!**`
                AC.copper.fiveThousandCases.completed.push(msg.author.id);

            } else if (p.copperOpened >= 100000 && !AC.copper.oneHundredThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **100000 copper cases opened!**`
                AC.copper.oneHundredThousandCases.completed.push(msg.author.id);

            }


            if (items && items.items.length > 1) {

                let mappedItems = items.items.map(item => `- [${item.name}](https://www.roblox.com/catalog/${item.itemID}) ${abbreviateNumber(item.itemWorth, 2)} ${moneyEmoji}`).join(`\n`)

                let totalValue = 0
                items.items.forEach(item => totalValue += item.itemWorth)

                msg.say(
                    new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`You opened ${items.items.length} ${crate} cases`)
                        .setDescription(stripIndent`
                    • Items: 
                    ${mappedItems}
                    
                    • Total Value: ${abbreviateNumber(totalValue, 2)} ${moneyEmoji}
                    
                    • Balance: ${abbreviateNumber(p.balance, 2)} ${moneyEmoji}
                    ${!allAchMsg && !AchMsg ? `` : `__**Achievement(s)**__ \n ${allAchMsg}\n ${AchMsg}`}
                    ${vipEmoji} ${betaTesters.includes(msg.author.id) ? betaEmoji : ""} ${this.client.isOwner(msg.author.id) ? this.client.emojis.cache.get("743658003001245736") : ``} ${isMod !== 0 ? this.client.emojis.cache.get("763584614237077524") : ``} ${p.pumpkinBadge === true ? `${pumpkinEmoji}` : ``}`)
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                )

                multiSaveFunction()
                p.save().catch((err) => console.log(err));


            } else {
                let checkLimited = item.isLimited || item.IsLimitedUnique;

                saveFunction();

                msg.say(
                    new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`You opened a ${crate} case!`)
                        .setDescription(stripIndents`
                        • Item: **${item.data.Name}** X **${amountToAdd}**
                        • Item ID: **${item.data.AssetId}**
                        • Item value: **${abbreviateNumber(Math.round(item.data.PriceInRobux), 2)}**${moneyEmoji}
                        • Total value: **${abbreviateNumber(Math.round(amountToAdd * item.data.PriceInRobux), 2)}**${moneyEmoji}
                        • Type: **${item.type}**
                        ${checkLimited ? `‣✨Limited✨` : ``}
                        ${!allAchMsg && !AchMsg ? `` : `__**Achievement(s)**__ \n ${allAchMsg}\n ${AchMsg}`}
                        [Item Link](https://www.roblox.com/catalog/${item.data.AssetId})

                        • Balance: ${abbreviateNumber(p.balance, 2)} ${moneyEmoji}
                        ${vipEmoji} ${betaTesters.includes(msg.author.id) ? betaEmoji : ""} ${this.client.isOwner(msg.author.id) ? this.client.emojis.cache.get("743658003001245736") : ``} ${isMod !== 0 ? this.client.emojis.cache.get("763584614237077524") : ``} ${p.pumpkinBadge === true ? `${pumpkinEmoji}` : ``}`)
                        .setThumbnail(item.img)
                        .setColor(`${caseHex[crate]}`)
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                )
                    .catch((err) => { });

            }
        } else if (crate.toLowerCase() === "bronze") {

            p.bronzeOpened = Math.floor(p.bronzeOpened + amountOpened)

            let AchMsg = ``

            if (p.bronzeOpened >= 10 && !AC.bronze.tenCases.completed.includes(msg.author.id)) {

                AchMsg = `- **10 bronze cases opened!**`
                AC.bronze.tenCases.completed.push(msg.author.id);

            } else if (p.bronzeOpened >= 50 && !AC.bronze.fiftyCases.completed.includes(msg.author.id)) {

                AchMsg = `- **50 bronze cases opened!**`
                AC.bronze.fiftyCases.completed.push(msg.author.id);

            } else if (p.bronzeOpened >= 100 && !AC.bronze.oneHundredCases.completed.includes(msg.author.id)) {

                AchMsg = `- **100 bronze cases opened!**`
                AC.bronze.oneHundredCases.completed.push(msg.author.id);

            } else if (p.bronzeOpened >= 500 && !AC.bronze.fiveHundredCases.completed.includes(msg.author.id)) {

                AchMsg = `- **500 bronze cases opened!**`
                AC.bronze.fiveHundredCases.completed.push(msg.author.id);

            } else if (p.bronzeOpened >= 1000 && !AC.bronze.oneThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **1000 bronze cases opened!**`
                AC.bronze.oneThousandCases.completed.push(msg.author.id);

            } else if (p.bronzeOpened >= 5000 && !AC.bronze.fiveThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **5000 bronze cases opened!**`
                AC.bronze.fiveThousandCases.completed.push(msg.author.id);

            } else if (p.bronzeOpened >= 100000 && !AC.bronze.oneHundredThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **100000 bronze cases opened!**`
                AC.bronze.oneHundredThousandCases.completed.push(msg.author.id);

            }

            if (items && items.items.length > 1) {

                let mappedItems = items.items.map(item => `- [${item.name}](https://www.roblox.com/catalog/${item.itemID}) ${abbreviateNumber(item.itemWorth, 2)} ${moneyEmoji}`).join(`\n`)

                let totalValue = 0
                items.items.forEach(item => totalValue += item.itemWorth)

                msg.say(
                    new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`You opened ${items.items.length} ${crate} cases`)
                        .setDescription(stripIndent`
                    • Items: 
                    ${mappedItems}
                    
                    • Total Value: ${abbreviateNumber(totalValue, 2)} ${moneyEmoji}
                    
                    • Balance: ${abbreviateNumber(p.balance, 2)} ${moneyEmoji}
                    ${!allAchMsg && !AchMsg ? `` : `__**Achievement(s)**__ \n ${allAchMsg}\n ${AchMsg}`}
                    ${vipEmoji} ${betaTesters.includes(msg.author.id) ? betaEmoji : ""} ${this.client.isOwner(msg.author.id) ? this.client.emojis.cache.get("743658003001245736") : ``} ${isMod !== 0 ? this.client.emojis.cache.get("763584614237077524") : ``} ${p.pumpkinBadge === true ? `${pumpkinEmoji}` : ``}`)
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                )

                multiSaveFunction()
                p.save().catch((err) => console.log(err));


            } else {
                let checkLimited = item.isLimited || item.IsLimitedUnique;
                saveFunction();

                msg.say(
                    new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`You opened a ${crate} case!`)
                        .setDescription(stripIndents`
                        • Item: **${item.data.Name}** X **${amountToAdd}**
                        • Item ID: **${item.data.AssetId}**
                        • Item value: **${abbreviateNumber(Math.round(item.data.PriceInRobux), 2)}**${moneyEmoji}
                        • Total value: **${abbreviateNumber(Math.round(amountToAdd * item.data.PriceInRobux), 2)}**${moneyEmoji}
                        • Type: **${item.type}**
                        ${checkLimited ? `‣✨Limited✨` : ``}
                        ${!allAchMsg && !AchMsg ? `` : `__**Achievement(s)**__ \n ${allAchMsg}\n ${AchMsg}`}
                        [Item Link](https://www.roblox.com/catalog/${item.data.AssetId})

                        • Balance: ${abbreviateNumber(p.balance, 2)} ${moneyEmoji}
                        ${vipEmoji} ${betaTesters.includes(msg.author.id) ? betaEmoji : ""} ${this.client.isOwner(msg.author.id) ? this.client.emojis.cache.get("743658003001245736") : ``} ${isMod !== 0 ? this.client.emojis.cache.get("763584614237077524") : ``} ${p.pumpkinBadge === true ? `${pumpkinEmoji}` : ``}`)
                        .setThumbnail(item.img)
                        .setColor(`${caseHex[crate]}`)
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                )
                    .catch((err) => { });

            }
        } else if (crate.toLowerCase() === "iron") {

            p.ironOpened = Math.floor(p.ironOpened + amountOpened)

            let AchMsg = ``

            if (p.ironOpened >= 10 && !AC.iron.tenCases.completed.includes(msg.author.id)) {

                AchMsg = `- **10 iron cases opened!**`
                AC.iron.tenCases.completed.push(msg.author.id);

            } else if (p.ironOpened >= 50 && !AC.iron.fiftyCases.completed.includes(msg.author.id)) {

                AchMsg = `- **50 iron cases opened!**`
                AC.iron.fiftyCases.completed.push(msg.author.id);

            } else if (p.ironOpened >= 100 && !AC.iron.oneHundredCases.completed.includes(msg.author.id)) {

                AchMsg = `- **100 iron cases opened!**`
                AC.iron.oneHundredCases.completed.push(msg.author.id);

            } else if (p.ironOpened >= 500 && !AC.iron.fiveHundredCases.completed.includes(msg.author.id)) {

                AchMsg = `- **500 iron cases opened!**`
                AC.iron.fiveHundredCases.completed.push(msg.author.id);

            } else if (p.ironOpened >= 1000 && !AC.iron.oneThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **1000 iron cases opened!**`
                AC.iron.oneThousandCases.completed.push(msg.author.id);

            } else if (p.ironOpened >= 5000 && !AC.iron.fiveThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **5000 iron cases opened!**`
                AC.iron.fiveThousandCases.completed.push(msg.author.id);

            } else if (p.ironOpened >= 100000 && !AC.iron.oneHundredThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **100000 iron cases opened!**`
                AC.iron.oneHundredThousandCases.completed.push(msg.author.id);

            }

            if (items && items.items.length > 1) {

                let mappedItems = items.items.map(item => `- [${item.name}](https://www.roblox.com/catalog/${item.itemID}) ${abbreviateNumber(item.itemWorth, 2)} ${moneyEmoji}`).join(`\n`)

                let totalValue = 0
                items.items.forEach(item => totalValue += item.itemWorth)

                msg.say(
                    new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`You opened ${items.items.length} ${crate} cases`)
                        .setDescription(stripIndent`
                    • Items: 
                    ${mappedItems}
                    
                    • Total Value: ${abbreviateNumber(totalValue, 2)} ${moneyEmoji}
                    
                    • Balance: ${abbreviateNumber(p.balance, 2)} ${moneyEmoji}
                    ${!allAchMsg && !AchMsg ? `` : `__**Achievement(s)**__ \n ${allAchMsg}\n ${AchMsg}`}
                    ${vipEmoji} ${betaTesters.includes(msg.author.id) ? betaEmoji : ""} ${this.client.isOwner(msg.author.id) ? this.client.emojis.cache.get("743658003001245736") : ``} ${isMod !== 0 ? this.client.emojis.cache.get("763584614237077524") : ``} ${p.pumpkinBadge === true ? `${pumpkinEmoji}` : ``}`)
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                )

                multiSaveFunction()
                p.save().catch((err) => console.log(err));


            } else {
                let checkLimited = item.isLimited || item.IsLimitedUnique;

                saveFunction();

                msg.say(
                    new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`You opened a ${crate} case!`)
                        .setDescription(stripIndents`
                        • Item: **${item.data.Name}** X **${amountToAdd}**
                        • Item ID: **${item.data.AssetId}**
                        • Item value: **${abbreviateNumber(Math.round(item.data.PriceInRobux), 2)}**${moneyEmoji}
                        • Total value: **${abbreviateNumber(Math.round(amountToAdd * item.data.PriceInRobux), 2)}**${moneyEmoji}
                        • Type: **${item.type}**
                        ${checkLimited ? `‣✨Limited✨` : ``}
                        ${!allAchMsg && !AchMsg ? `` : `__**Achievement(s)**__ \n ${allAchMsg}\n ${AchMsg}`}
                        [Item Link](https://www.roblox.com/catalog/${item.data.AssetId})

                        • Balance: ${abbreviateNumber(p.balance, 2)} ${moneyEmoji}
                        ${vipEmoji} ${betaTesters.includes(msg.author.id) ? betaEmoji : ""} ${this.client.isOwner(msg.author.id) ? this.client.emojis.cache.get("743658003001245736") : ``} ${isMod !== 0 ? this.client.emojis.cache.get("763584614237077524") : ``} ${p.pumpkinBadge === true ? `${pumpkinEmoji}` : ``}`)
                        .setThumbnail(item.img)
                        .setColor(`${caseHex[crate]}`)
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                )
                    .catch((err) => { });

            }
        } else if (crate.toLowerCase() === "silver") {

            p.silverOpened = Math.floor(p.silverOpened + amountOpened)

            let AchMsg = ``

            if (p.silverOpened >= 10 && !AC.silver.tenCases.completed.includes(msg.author.id)) {

                AchMsg = `- **10 silver cases opened!**`
                AC.silver.tenCases.completed.push(msg.author.id);

            } else if (p.silverOpened >= 50 && !AC.silver.fiftyCases.completed.includes(msg.author.id)) {

                AchMsg = `- **50 silver cases opened!**`
                AC.silver.fiftyCases.completed.push(msg.author.id);

            } else if (p.silverOpened >= 100 && !AC.silver.oneHundredCases.completed.includes(msg.author.id)) {

                AchMsg = `- **100 silver cases opened!**`
                AC.silver.oneHundredCases.completed.push(msg.author.id);

            } else if (p.silverOpened >= 500 && !AC.silver.fiveHundredCases.completed.includes(msg.author.id)) {

                AchMsg = `- **500 silver cases opened!**`
                AC.silver.fiveHundredCases.completed.push(msg.author.id);

            } else if (p.silverOpened >= 1000 && !AC.silver.oneThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **1000 silver cases opened!**`
                AC.silver.oneThousandCases.completed.push(msg.author.id);

            } else if (p.silverOpened >= 5000 && !AC.silver.fiveThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **5000 silver cases opened!**`
                AC.silver.fiveThousandCases.completed.push(msg.author.id);

            } else if (p.silverOpened >= 100000 && !AC.silver.oneHundredThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **100000 silver cases opened!**`
                AC.silver.oneHundredThousandCases.completed.push(msg.author.id);

            }

            if (items && items.items.length > 1) {

                let mappedItems = items.items.map(item => `- [${item.name}](https://www.roblox.com/catalog/${item.itemID}) ${abbreviateNumber(item.itemWorth, 2)} ${moneyEmoji}`).join(`\n`)

                let totalValue = 0
                items.items.forEach(item => totalValue += item.itemWorth)

                msg.say(
                    new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`You opened ${items.items.length} ${crate} cases`)
                        .setDescription(stripIndent`
                    • Items: 
                    ${mappedItems}
                    
                    • Total Value: ${abbreviateNumber(totalValue, 2)} ${moneyEmoji}
                    
                    • Balance: ${abbreviateNumber(p.balance, 2)} ${moneyEmoji}
                    ${!allAchMsg && !AchMsg ? `` : `__**Achievement(s)**__ \n ${allAchMsg}\n ${AchMsg}`}
                    ${vipEmoji} ${betaTesters.includes(msg.author.id) ? betaEmoji : ""} ${this.client.isOwner(msg.author.id) ? this.client.emojis.cache.get("743658003001245736") : ``} ${isMod !== 0 ? this.client.emojis.cache.get("763584614237077524") : ``} ${p.pumpkinBadge === true ? `${pumpkinEmoji}` : ``}`)
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                )

                multiSaveFunction()
                p.save().catch((err) => console.log(err));


            } else {
                let checkLimited = item.isLimited || item.IsLimitedUnique;

                saveFunction();

                msg.say(
                    new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`You opened a ${crate} case!`)
                        .setDescription(stripIndents`
                        • Item: **${item.data.Name}** X **${amountToAdd}**
                        • Item ID: **${item.data.AssetId}**
                        • Item value: **${abbreviateNumber(Math.round(item.data.PriceInRobux), 2)}**${moneyEmoji}
                        • Total value: **${abbreviateNumber(Math.round(amountToAdd * item.data.PriceInRobux), 2)}**${moneyEmoji}
                        • Type: **${item.type}**
                        ${checkLimited ? `‣✨Limited✨` : ``}
                        ${!allAchMsg && !AchMsg ? `` : `__**Achievement(s)**__ \n ${allAchMsg}\n ${AchMsg}`}
                        [Item Link](https://www.roblox.com/catalog/${item.data.AssetId})

                        • Balance: ${abbreviateNumber(p.balance, 2)} ${moneyEmoji}
                        ${vipEmoji} ${betaTesters.includes(msg.author.id) ? betaEmoji : ""} ${this.client.isOwner(msg.author.id) ? this.client.emojis.cache.get("743658003001245736") : ``} ${isMod !== 0 ? this.client.emojis.cache.get("763584614237077524") : ``} ${p.pumpkinBadge === true ? `${pumpkinEmoji}` : ``}`)
                        .setThumbnail(item.img)
                        .setColor(`${caseHex[crate]}`)
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                )
                    .catch((err) => { });

            }
        } else if (crate.toLowerCase() === "gold") {

            p.goldOpened = Math.floor(p.goldOpened + amountOpened)

            let AchMsg = ``

            if (p.goldOpened >= 10 && !AC.gold.tenCases.completed.includes(msg.author.id)) {

                AchMsg = `- **10 gold cases opened!**`
                AC.gold.tenCases.completed.push(msg.author.id);

            } else if (p.goldOpened >= 50 && !AC.gold.fiftyCases.completed.includes(msg.author.id)) {

                AchMsg = `- **50 gold cases opened!**`
                AC.gold.fiftyCases.completed.push(msg.author.id);

            } else if (p.goldOpened >= 100 && !AC.gold.oneHundredCases.completed.includes(msg.author.id)) {

                AchMsg = `- **100 gold cases opened!**`
                AC.gold.oneHundredCases.completed.push(msg.author.id);

            } else if (p.goldOpened >= 500 && !AC.gold.fiveHundredCases.completed.includes(msg.author.id)) {

                AchMsg = `- **500 gold cases opened!**`
                AC.gold.fiveHundredCases.completed.push(msg.author.id);

            } else if (p.goldOpened >= 1000 && !AC.gold.oneThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **1000 gold cases opened!**`
                AC.gold.oneThousandCases.completed.push(msg.author.id);

            } else if (p.goldOpened >= 5000 && !AC.gold.fiveThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **5000 gold cases opened!**`
                AC.gold.fiveThousandCases.completed.push(msg.author.id);

            } else if (p.goldOpened >= 100000 && !AC.gold.oneHundredThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **100000 gold cases opened!**`
                AC.gold.oneHundredThousandCases.completed.push(msg.author.id);

            }

            if (items && items.items.length > 1) {

                let mappedItems = items.items.map(item => `- [${item.name}](https://www.roblox.com/catalog/${item.itemID}) ${abbreviateNumber(item.itemWorth, 2)} ${moneyEmoji}`).join(`\n`)

                let totalValue = 0
                items.items.forEach(item => totalValue += item.itemWorth)

                msg.say(
                    new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`You opened ${items.items.length} ${crate} cases`)
                        .setDescription(stripIndent`
                    • Items: 
                    ${mappedItems}
                    
                    • Total Value: ${abbreviateNumber(totalValue, 2)} ${moneyEmoji}
                    
                    • Balance: ${abbreviateNumber(p.balance, 2)} ${moneyEmoji}
                    ${!allAchMsg && !AchMsg ? `` : `__**Achievement(s)**__ \n ${allAchMsg}\n ${AchMsg}`}
                    ${vipEmoji} ${betaTesters.includes(msg.author.id) ? betaEmoji : ""} ${this.client.isOwner(msg.author.id) ? this.client.emojis.cache.get("743658003001245736") : ``} ${isMod !== 0 ? this.client.emojis.cache.get("763584614237077524") : ``} ${p.pumpkinBadge === true ? `${pumpkinEmoji}` : ``}`)
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                )

                multiSaveFunction()
                p.save().catch((err) => console.log(err));


            } else {
                let checkLimited = item.isLimited || item.IsLimitedUnique;

                saveFunction();

                msg.say(
                    new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`You opened a ${crate} case!`)
                        .setDescription(stripIndents`
                        • Item: **${item.data.Name}** X **${amountToAdd}**
                        • Item ID: **${item.data.AssetId}**
                        • Item value: **${abbreviateNumber(Math.round(item.data.PriceInRobux), 2)}**${moneyEmoji}
                        • Total value: **${abbreviateNumber(Math.round(amountToAdd * item.data.PriceInRobux), 2)}**${moneyEmoji}
                        • Type: **${item.type}**
                        ${checkLimited ? `‣✨Limited✨` : ``}
                        ${!allAchMsg && !AchMsg ? `` : `__**Achievement(s)**__ \n ${allAchMsg}\n ${AchMsg}`}
                        [Item Link](https://www.roblox.com/catalog/${item.data.AssetId})

                        • Balance: ${abbreviateNumber(p.balance, 2)} ${moneyEmoji}
                        ${vipEmoji} ${betaTesters.includes(msg.author.id) ? betaEmoji : ""} ${this.client.isOwner(msg.author.id) ? this.client.emojis.cache.get("743658003001245736") : ``} ${isMod !== 0 ? this.client.emojis.cache.get("763584614237077524") : ``} ${p.pumpkinBadge === true ? `${pumpkinEmoji}` : ``}`)
                        .setThumbnail(item.img)
                        .setColor(`${caseHex[crate]}`)
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                )
                    .catch((err) => { });

            }
        } else if (crate.toLowerCase() === "diamond") {

            p.diamondOpened = Math.floor(p.diamondOpened + amountOpened)

            let AchMsg = ``

            if (p.diamondOpened >= 10 && !AC.diamond.tenCases.completed.includes(msg.author.id)) {

                AchMsg = `- **10 diamond cases opened!**`
                AC.diamond.tenCases.completed.push(msg.author.id);

            } else if (p.diamondOpened >= 50 && !AC.diamond.fiftyCases.completed.includes(msg.author.id)) {

                AchMsg = `- **50 diamond cases opened!**`
                AC.diamond.fiftyCases.completed.push(msg.author.id);

            } else if (p.diamondOpened >= 100 && !AC.diamond.oneHundredCases.completed.includes(msg.author.id)) {

                AchMsg = `- **100 diamond cases opened!**`
                AC.diamond.oneHundredCases.completed.push(msg.author.id);

            } else if (p.diamondOpened >= 500 && !AC.diamond.fiveHundredCases.completed.includes(msg.author.id)) {

                AchMsg = `- **500 diamond cases opened!**`
                AC.diamond.fiveHundredCases.completed.push(msg.author.id);

            } else if (p.diamondOpened >= 1000 && !AC.diamond.oneThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **1000 diamond cases opened!**`
                AC.diamond.oneThousandCases.completed.push(msg.author.id);

            } else if (p.diamondOpened >= 5000 && !AC.diamond.fiveThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **5000 diamond cases opened!**`
                AC.diamond.fiveThousandCases.completed.push(msg.author.id);

            } else if (p.diamondOpened >= 100000 && !AC.diamond.oneHundredThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **100000 diamond cases opened!**`
                AC.diamond.oneHundredThousandCases.completed.push(msg.author.id);

            }

            if (items && items.items.length > 1) {

                let mappedItems = items.items.map(item => `- [${item.name}](https://www.roblox.com/catalog/${item.itemID}) ${abbreviateNumber(item.itemWorth, 2)} ${moneyEmoji}`).join(`\n`)

                let totalValue = 0
                items.items.forEach(item => totalValue += item.itemWorth)

                msg.say(
                    new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`You opened ${items.items.length} ${crate} cases`)
                        .setDescription(stripIndent`
                    • Items: 
                    ${mappedItems}
                    
                    • Total Value: ${abbreviateNumber(totalValue, 2)} ${moneyEmoji}
                    
                    • Balance: ${abbreviateNumber(p.balance, 2)} ${moneyEmoji}
                    ${!allAchMsg && !AchMsg ? `` : `__**Achievement(s)**__ \n ${allAchMsg}\n ${AchMsg}`}
                    ${vipEmoji} ${betaTesters.includes(msg.author.id) ? betaEmoji : ""} ${this.client.isOwner(msg.author.id) ? this.client.emojis.cache.get("743658003001245736") : ``} ${isMod !== 0 ? this.client.emojis.cache.get("763584614237077524") : ``} ${p.pumpkinBadge === true ? `${pumpkinEmoji}` : ``}`)
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                )

                multiSaveFunction()
                p.save().catch((err) => console.log(err));


            } else {
                let checkLimited = item.isLimited || item.IsLimitedUnique;

                saveFunction();

                msg.say(
                    new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`You opened a ${crate} case!`)
                        .setDescription(stripIndents`
                        • Item: **${item.data.Name}** X **${amountToAdd}**
                        • Item ID: **${item.data.AssetId}**
                        • Item value: **${abbreviateNumber(Math.round(item.data.PriceInRobux), 2)}**${moneyEmoji}
                        • Total value: **${abbreviateNumber(Math.round(amountToAdd * item.data.PriceInRobux), 2)}**${moneyEmoji}
                        • Type: **${item.type}**
                        ${checkLimited ? `‣✨Limited✨` : ``}
                        ${!allAchMsg && !AchMsg ? `` : `__**Achievement(s)**__ \n ${allAchMsg}\n ${AchMsg}`}
                        [Item Link](https://www.roblox.com/catalog/${item.data.AssetId})

                        • Balance: ${abbreviateNumber(p.balance, 2)} ${moneyEmoji}
                        ${vipEmoji} ${betaTesters.includes(msg.author.id) ? betaEmoji : ""} ${this.client.isOwner(msg.author.id) ? this.client.emojis.cache.get("743658003001245736") : ``} ${isMod !== 0 ? this.client.emojis.cache.get("763584614237077524") : ``} ${p.pumpkinBadge === true ? `${pumpkinEmoji}` : ``}`)
                        .setThumbnail(item.img)
                        .setColor(`${caseHex[crate]}`)
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                )
                    .catch((err) => { });

            }

        } else if (crate.toLowerCase() === "ruby") {

            p.rubyOpened = Math.floor(p.rubyOpened + amountOpened)

            let AchMsg = ``

            if (p.rubyOpened >= 10 && !AC.ruby.tenCases.completed.includes(msg.author.id)) {

                AchMsg = `- **10 ruby cases opened!**`
                AC.ruby.tenCases.completed.push(msg.author.id);

            } else if (p.rubyOpened >= 50 && !AC.ruby.fiftyCases.completed.includes(msg.author.id)) {

                AchMsg = `- **50 ruby cases opened!**`
                AC.ruby.fiftyCases.completed.push(msg.author.id);

            } else if (p.rubyOpened >= 100 && !AC.ruby.oneHundredCases.completed.includes(msg.author.id)) {

                AchMsg = `- **100 ruby cases opened!**`
                AC.ruby.oneHundredCases.completed.push(msg.author.id);

            } else if (p.rubyOpened >= 500 && !AC.ruby.fiveHundredCases.completed.includes(msg.author.id)) {

                AchMsg = `- **500 ruby cases opened!**`
                AC.ruby.fiveHundredCases.completed.push(msg.author.id);

            } else if (p.rubyOpened >= 1000 && !AC.ruby.oneThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **1000 ruby cases opened!**`
                AC.ruby.oneThousandCases.completed.push(msg.author.id);

            } else if (p.rubyOpened >= 5000 && !AC.ruby.fiveThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **5000 ruby cases opened!**`
                AC.ruby.fiveThousandCases.completed.push(msg.author.id);

            } else if (p.rubyOpened >= 100000 && !AC.ruby.oneHundredThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **100000 ruby cases opened!**`
                AC.ruby.oneHundredThousandCases.completed.push(msg.author.id);

            }

            if (items && items.items.length > 1) {

                let mappedItems = items.items.map(item => `- [${item.name}](https://www.roblox.com/catalog/${item.itemID}) ${abbreviateNumber(item.itemWorth, 2)} ${moneyEmoji}`).join(`\n`)

                let totalValue = 0
                items.items.forEach(item => totalValue += item.itemWorth)

                msg.say(
                    new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`You opened ${items.items.length} ${crate} cases`)
                        .setDescription(stripIndent`
                    • Items: 
                    ${mappedItems}
                    
                    • Total Value: ${abbreviateNumber(totalValue, 2)} ${moneyEmoji}
                    
                    • Balance: ${abbreviateNumber(p.balance, 2)} ${moneyEmoji}
                    ${!allAchMsg && !AchMsg ? `` : `__**Achievement(s)**__ \n ${allAchMsg}\n ${AchMsg}`}
                    ${vipEmoji} ${betaTesters.includes(msg.author.id) ? betaEmoji : ""} ${this.client.isOwner(msg.author.id) ? this.client.emojis.cache.get("743658003001245736") : ``} ${isMod !== 0 ? this.client.emojis.cache.get("763584614237077524") : ``} ${p.pumpkinBadge === true ? `${pumpkinEmoji}` : ``}`)
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                )

                multiSaveFunction()
                p.save().catch((err) => console.log(err));


            } else {
                let checkLimited = item.isLimited || item.IsLimitedUnique;

                saveFunction();

                msg.say(
                    new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`You opened a ${crate} case!`)
                        .setDescription(stripIndents`
                        • Item: **${item.data.Name}** X **${amountToAdd}**
                        • Item ID: **${item.data.AssetId}**
                        • Item value: **${abbreviateNumber(Math.round(item.data.PriceInRobux), 2)}**${moneyEmoji}
                        • Total value: **${abbreviateNumber(Math.round(amountToAdd * item.data.PriceInRobux), 2)}**${moneyEmoji}
                        • Type: **${item.type}**
                        ${checkLimited ? `‣✨Limited✨` : ``}
                        ${!allAchMsg && !AchMsg ? `` : `__**Achievement(s)**__ \n ${allAchMsg}\n ${AchMsg}`}
                        [Item Link](https://www.roblox.com/catalog/${item.data.AssetId})

                        • Balance: ${abbreviateNumber(p.balance, 2)} ${moneyEmoji}
                        ${vipEmoji} ${betaTesters.includes(msg.author.id) ? betaEmoji : ""} ${this.client.isOwner(msg.author.id) ? this.client.emojis.cache.get("743658003001245736") : ``} ${isMod !== 0 ? this.client.emojis.cache.get("763584614237077524") : ``} ${p.pumpkinBadge === true ? `${pumpkinEmoji}` : ``}`)
                        .setThumbnail(item.img)
                        .setColor(`${caseHex[crate]}`)
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                )
                    .catch((err) => { });

            }
        } else if (crate.toLowerCase() === "emerald") {

            p.emeraldOpened = Math.floor(p.emeraldOpened + amountOpened)

            let AchMsg = ``

            if (p.emeraldOpened >= 10 && !AC.emerald.tenCases.completed.includes(msg.author.id)) {

                AchMsg = `- **10 emerald cases opened!**`
                AC.emerald.tenCases.completed.push(msg.author.id);

            } else if (p.emeraldOpened >= 50 && !AC.emerald.fiftyCases.completed.includes(msg.author.id)) {

                AchMsg = `- **50 emerald cases opened!**`
                AC.emerald.fiftyCases.completed.push(msg.author.id);

            } else if (p.emeraldOpened >= 100 && !AC.emerald.oneHundredCases.completed.includes(msg.author.id)) {

                AchMsg = `- **100 emerald cases opened!**`
                AC.emerald.oneHundredCases.completed.push(msg.author.id);

            } else if (p.emeraldOpened >= 500 && !AC.emerald.fiveHundredCases.completed.includes(msg.author.id)) {

                AchMsg = `- **500 emerald cases opened!**`
                AC.emerald.fiveHundredCases.completed.push(msg.author.id);

            } else if (p.emeraldOpened >= 1000 && !AC.emerald.oneThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **1000 emerald cases opened!**`
                AC.emerald.oneThousandCases.completed.push(msg.author.id);

            } else if (p.emeraldOpened >= 5000 && !AC.emerald.fiveThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **5000 emerald cases opened!**`
                AC.emerald.fiveThousandCases.completed.push(msg.author.id);

            } else if (p.emeraldOpened >= 100000 && !AC.emerald.oneHundredThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **100000 emerald cases opened!**`
                AC.emerald.oneHundredThousandCases.completed.push(msg.author.id);

            }

            if (items && items.items.length > 1) {

                let mappedItems = items.items.map(item => `- [${item.name}](https://www.roblox.com/catalog/${item.itemID}) ${abbreviateNumber(item.itemWorth, 2)} ${moneyEmoji}`).join(`\n`)

                let totalValue = 0
                items.items.forEach(item => totalValue += item.itemWorth)

                msg.say(
                    new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`You opened ${items.items.length} ${crate} cases`)
                        .setDescription(stripIndent`
                    • Items: 
                    ${mappedItems}
                    
                    • Total Value: ${abbreviateNumber(totalValue, 2)} ${moneyEmoji}
                    
                    • Balance: ${abbreviateNumber(p.balance, 2)} ${moneyEmoji}
                    ${!allAchMsg && !AchMsg ? `` : `__**Achievement(s)**__ \n ${allAchMsg}\n ${AchMsg}`}
                    ${vipEmoji} ${betaTesters.includes(msg.author.id) ? betaEmoji : ""} ${this.client.isOwner(msg.author.id) ? this.client.emojis.cache.get("743658003001245736") : ``} ${isMod !== 0 ? this.client.emojis.cache.get("763584614237077524") : ``} ${p.pumpkinBadge === true ? `${pumpkinEmoji}` : ``}`)
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                )

                multiSaveFunction()
                p.save().catch((err) => console.log(err));


            } else {
                let checkLimited = item.isLimited || item.IsLimitedUnique;

                saveFunction();

                msg.say(
                    new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`You opened a ${crate} case!`)
                        .setDescription(stripIndents`
                        • Item: **${item.data.Name}** X **${amountToAdd}**
                        • Item ID: **${item.data.AssetId}**
                        • Item value: **${abbreviateNumber(Math.round(item.data.PriceInRobux), 2)}**${moneyEmoji}
                        • Total value: **${abbreviateNumber(Math.round(amountToAdd * item.data.PriceInRobux), 2)}**${moneyEmoji}
                        • Type: **${item.type}**
                        ${checkLimited ? `‣✨Limited✨` : ``}
                        ${!allAchMsg && !AchMsg ? `` : `__**Achievement(s)**__ \n ${allAchMsg}\n ${AchMsg}`}
                        [Item Link](https://www.roblox.com/catalog/${item.data.AssetId})

                        • Balance: ${abbreviateNumber(p.balance, 2)} ${moneyEmoji}
                        ${vipEmoji} ${betaTesters.includes(msg.author.id) ? betaEmoji : ""} ${this.client.isOwner(msg.author.id) ? this.client.emojis.cache.get("743658003001245736") : ``} ${isMod !== 0 ? this.client.emojis.cache.get("763584614237077524") : ``} ${p.pumpkinBadge === true ? `${pumpkinEmoji}` : ``}`)
                        .setThumbnail(item.img)
                        .setColor(`${caseHex[crate]}`)
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                )
                    .catch((err) => { });

            }
        } else if (crate.toLowerCase() === "amethyst") {

            p.amethystOpened = Math.floor(p.amethystOpened + amountOpened)

            let AchMsg = ``

            if (p.amethystOpened >= 10 && !AC.amethyst.tenCases.completed.includes(msg.author.id)) {

                AchMsg = `- **10 amethyst cases opened!**`
                AC.amethyst.tenCases.completed.push(msg.author.id);

            } else if (p.amethystOpened >= 50 && !AC.amethyst.fiftyCases.completed.includes(msg.author.id)) {

                AchMsg = `- **50 amethyst cases opened!**`
                AC.amethyst.fiftyCases.completed.push(msg.author.id);

            } else if (p.amethystOpened >= 100 && !AC.amethyst.oneHundredCases.completed.includes(msg.author.id)) {

                AchMsg = `- **100 amethyst cases opened!**`
                AC.amethyst.oneHundredCases.completed.push(msg.author.id);

            } else if (p.amethystOpened >= 500 && !AC.amethyst.fiveHundredCases.completed.includes(msg.author.id)) {

                AchMsg = `- **500 amethyst cases opened!**`
                AC.amethyst.fiveHundredCases.completed.push(msg.author.id);

            } else if (p.amethystOpened >= 1000 && !AC.amethyst.oneThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **1000 amethyst cases opened!**`
                AC.amethyst.oneThousandCases.completed.push(msg.author.id);

            } else if (p.amethystOpened >= 5000 && !AC.amethyst.fiveThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **5000 amethyst cases opened!**`
                AC.amethyst.fiveThousandCases.completed.push(msg.author.id);

            } else if (p.amethystOpened >= 100000 && !AC.amethyst.oneHundredThousandCases.completed.includes(msg.author.id)) {

                AchMsg = `- **100000 amethyst cases opened!**`
                AC.amethyst.oneHundredThousandCases.completed.push(msg.author.id);

            }

            if (items && items.items.length > 1) {

                let mappedItems = items.items.map(item => `- [${item.name}](https://www.roblox.com/catalog/${item.itemID}) ${abbreviateNumber(item.itemWorth, 2)} ${moneyEmoji}`).join(`\n`)

                let totalValue = 0
                items.items.forEach(item => totalValue += item.itemWorth)

                msg.say(
                    new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`You opened ${items.items.length} ${crate} cases`)
                        .setDescription(stripIndent`
                    • Items: 
                    ${mappedItems}
                    
                    • Total Value: ${abbreviateNumber(totalValue, 2)} ${moneyEmoji}
                    
                    • Balance: ${abbreviateNumber(p.balance, 2)} ${moneyEmoji}
                    ${!allAchMsg && !AchMsg ? `` : `__**Achievement(s)**__ \n ${allAchMsg}\n ${AchMsg}`}
                    ${vipEmoji} ${betaTesters.includes(msg.author.id) ? betaEmoji : ""} ${this.client.isOwner(msg.author.id) ? this.client.emojis.cache.get("743658003001245736") : ``} ${isMod !== 0 ? this.client.emojis.cache.get("763584614237077524") : ``} ${p.pumpkinBadge === true ? `${pumpkinEmoji}` : ``}`)
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                )

                multiSaveFunction()
                p.save().catch((err) => console.log(err));


            } else {
                let checkLimited = item.isLimited || item.IsLimitedUnique;

                saveFunction();

                msg.say(
                    new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`You opened a ${crate} case!`)
                        .setDescription(stripIndents`
                        • Item: **${item.data.Name}** X **${amountToAdd}**
                        • Item ID: **${item.data.AssetId}**
                        • Item value: **${abbreviateNumber(Math.round(item.data.PriceInRobux), 2)}**${moneyEmoji}
                        • Total value: **${abbreviateNumber(Math.round(amountToAdd * item.data.PriceInRobux), 2)}**${moneyEmoji}
                        • Type: **${item.type}**
                        ${checkLimited ? `‣✨Limited✨` : ``}
                        ${!allAchMsg && !AchMsg ? `` : `__**Achievement(s)**__ \n ${allAchMsg}\n ${AchMsg}`}
                        [Item Link](https://www.roblox.com/catalog/${item.data.AssetId})

                        • Balance: ${abbreviateNumber(p.balance, 2)} ${moneyEmoji}
                        ${vipEmoji} ${betaTesters.includes(msg.author.id) ? betaEmoji : ""} ${this.client.isOwner(msg.author.id) ? this.client.emojis.cache.get("743658003001245736") : ``} ${isMod !== 0 ? this.client.emojis.cache.get("763584614237077524") : ``} ${p.pumpkinBadge === true ? `${pumpkinEmoji}` : ``}`)
                        .setThumbnail(item.img)
                        .setColor(`${caseHex[crate]}`)
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                )
                    .catch((err) => { });

            }
        }


        AC.save().catch((err) => console.log(err));
    }
};
