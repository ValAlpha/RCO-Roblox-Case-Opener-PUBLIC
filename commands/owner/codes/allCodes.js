const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")


module.exports = class allcodes extends Command {
    constructor(client) {
        super(client, {
            name: 'allcodes',
            description: 'List all active codes',
            group: 'owner',
            memberName: 'allcodes',
            ownerOnly: true
        })
    }

    async run(msg) {

        const C = await this.client.dbs.codes.findOne({ dbID: this.client.user.id })

        if (!C)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`No active codes`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        // let codes = C.codes.map(c => `${c.code} | ${c.reward}`).join(`\n`)
        let moneyCodes = []
        let itemCodes = []

        C.codes.forEach(code => {
            if (code.type === "money") {
                moneyCodes.push(`${code.code} | ${code.reward}`)
            } else {
                itemCodes.push(`${code.code} - ${code.item.name} (${code.item.itemID}) | ${code.item.amount}`)
            }
        })

        msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`**All Active Codes**

        __**Money**__
        ${moneyCodes.length < 1 ? "None" : moneyCodes.join(`\n`)}
        
        __**Items**__
        ${itemCodes.length < 1 ? "None" : itemCodes.join(`\n`)}
        `)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

    }
}