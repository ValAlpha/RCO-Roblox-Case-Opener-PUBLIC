const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")


module.exports = class enabletrades extends Command {
    constructor(client) {
        super(client, {
            name: 'enabletrades',
            description: 'Allow all trades',
            group: 'trading',
            memberName: 'enabletrades',
            aliases: ["et"],
            throttling: {
                duration: 10,
                usages: 1
            }
        })
    }

    async run(msg) {

        const P = await this.client.dbs.profile.findOne({ id: msg.author.id })

        if (!P)  return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You need to open a case first`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if (P.disableTrades === true) {
              return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`Your trades are already enabled`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        } else {
            P.disableTrades = true
            msg.reply(`Trades enabled`)
        }

        P.save().catch(err => console.log(err))
    }
}