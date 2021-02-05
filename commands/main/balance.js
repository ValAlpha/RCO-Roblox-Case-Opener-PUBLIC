const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")
const { abbreviateNumber  } = require("js-abbreviation-number")

module.exports = class balance extends Command {
    constructor(client) {
        super(client, {
            name: 'balance',
            description: 'View your balance',
            group: 'main',
            memberName: 'balance',
            aliases: ['bal', 'money']
        })
    }

    async run(msg) {

        const P = await this.client.dbs.profile.findOne({ id: msg.author.id })

        if (!P)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You don't have any money`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        let moneyEmoji = this.client.emojis.cache.get("696719071009570848")

      
        msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(P.balance < 1000 ? `${Math.floor(P.balance)}` : `${abbreviateNumber(P.balance, 2)}${moneyEmoji}`)
            .setColor("GREEN"))
    }
}