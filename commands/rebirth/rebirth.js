const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")

const { abbreviateNumber } = require("js-abbreviation-number")
const { stripIndents } = require("common-tags")

module.exports = class rebirth extends Command {
    constructor(client) {
        super(client, {
            name: 'rebirth',
            description: 'Rebirth, Clearing your inventory and balance but earn a rebirth token to be spent on upgrades',
            group: 'rebirth',
            memberName: 'rebirth',
            args: [{
                type: "string",
                prompt: "Are you sure? You will lose your entire inventory and money",
                key: "answer",
                oneOf: ["yes", "no"]
            }]
        })
    }

    async run(msg, { answer }) {

        const P = await this.client.dbs.profile.findOne({ id: msg.author.id })

        const VIP = async (userID) => {
            let res = await require("superagent").get(`${process.env.CLIENT_IP}:${process.env.CLIENT_PORT}/members/${userID}/vip`).catch((err) => console.log(err));
            if(!res) return;
            if(res.status !== 200) return;
            if(res.body.status !== true) return;
            return res.body.tier;
        }

        let isVip = await VIP(msg.author.id)


        if (!P)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(stripIndents`You need to open some cases first`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if (P.isTrading === true)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(stripIndents`Please cancel your trade first`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        let moneyNeeded = ((P.rebirthLevel + 1) * 1000000)
        let moneyEmoji = this.client.emojis.cache.get("696719071009570848")

        if (answer.toLowerCase() === "no")   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(stripIndents`Ok`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if (answer.toLowerCase() === "yes") {

            if (P.balance < moneyNeeded)   return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(stripIndents`You need ${abbreviateNumber(moneyNeeded, 0)} ${moneyEmoji} to rebirth to level ${P.rebirthLevel + 1}`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

            P.rebirthLevel = Math.floor(P.rebirthLevel + 1)
            P.rebirthTokens++

            P.inventory = isVip > 1 ? P.inventory : []
            P.balance = 2000
            P.value = 0
            P.defaultCrate = 'noob'
            P.caseMultiplier = 0
            P.pets = isVip > 0 ? P.pets : []
            P.invSizeUpgradable = true
            P.caseDiscountUpgradable = true


            P.save().catch(err => console.log(err))

            msg.say(new MessageEmbed()

                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(stripIndents`**__You Rebirthed!__**
                            
                            \`Rebirth level\`: ${P.rebirthLevel}
                            \`Rebirth token(s)\`: ${P.rebirthTokens}
                            
                            use: \`${this.client.commandPrefix}rebirthstats\` to view your rebirth upgrades info`)
                .setColor("PURPLE")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))


        }

    }
}