const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")


module.exports = class addmoney extends Command {
    constructor(client) {
        super(client, {
            name: 'addmoney',
            description: 'Add money to yourself',
            group: 'owner',
            memberName: 'addmoney',
            ownerOnly: true,
            args: [{
                type: "integer",
                prompt: "How much",
                key: "amount",
                min: 1
            }]
        })
    }

    async run(msg, { amount }) {

        const P = await this.client.dbs.profile.findOne({ id: msg.author.id })
        if (!P)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You don't have a profile`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        P.balance += amount

        P.save().catch(err => console.log(err))

          return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Added ${amount}`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        

    }
}