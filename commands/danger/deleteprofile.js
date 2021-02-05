const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")


module.exports = class deleteprofile extends Command {
    constructor(client) {
        super(client, {
            name: 'deleteprofile',
            description: 'Delete your profile',
            group: 'danger',
            memberName: 'deleteprofile',
            args: [{
                type: "string",
                prompt: "Are you sure? **This is not reversable!!** [yes/no]",
                key: "confirmation"
            }]
        })
    }

    async run(msg, { confirmation }) {

        const P = await this.client.dbs.profile.findOne({ id: msg.author.id })

        const Trade = await this.client.dbs.trades.findOne({ traders: msg.author.id })

        if (!P)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You have no profile to delete`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if (confirmation === "no")   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Ok, I won't delete your profile`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if (confirmation === "yes") {

            if (Trade)   return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`Please run ${this.client.commandPrefix}canceltrade first`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
            

            P.remove()

              return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`Ok, Your profile has been deleted`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        }
    }
}