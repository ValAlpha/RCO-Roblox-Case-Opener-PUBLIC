const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")
const { stripIndents } = require("common-tags")

module.exports = class rebirthstats extends Command {
    constructor(client) {
        super(client, {
            name: 'rebirthstats',
            description: 'View your rebirth stats',
            group: 'rebirth',
            memberName: 'rebirthstats',
            aliases: ["rs"]
        })
    }

    async run(msg) {

        const P = await this.client.dbs.profile.findOne({ id: msg.author.id })
        if (!P)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You need to open some cases first!`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if (P.rebirthLevel === 0)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You haven't rebirthed yet`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        msg.say(new MessageEmbed()

            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(stripIndents`Your Rebirth Stats
                        
                        Rebirth level: ${P.rebirthLevel}
                        Rebirth tokens: ${P.rebirthTokens}

                        Case discount: ${P.caseDiscount}%
                        Inventory size ${P.invSize}
                        
                        Next Rebirth cost: ${Math.floor((P.rebirthLevel + 1) * 1000000)}`)
            .setColor("PURPLE")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
    }
}
