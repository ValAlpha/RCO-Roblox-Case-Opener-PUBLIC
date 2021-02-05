const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")


module.exports = class trade extends Command {
    constructor(client) {
        super(client, {
            name: 'trade',
            description: 'Start a trade with someone',
            group: 'trading',
            memberName: 'trade',
            throttling: {
                usages: 1,
                duration: 30
            },
            args: [{
                type: "user",
                prompt: "Who do you want to trade with?",
                key: "user"
            }]
        })
    }

    async run(msg, { user }) {

        const P = await this.client.dbs.profile.findOne({ id: msg.author.id })
        if (!P || P.inventory.length === 0)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You have nothing to trade`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        const PP = await this.client.dbs.profile.findOne({ id: user.id })

        if (!PP || PP.inventory.length === 0)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`This person has nothing to trade`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if (P.id === PP.id) return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Sure, trade with yourself. Lets see how far you get`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if (PP.disableTrades === false)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`This user doesn't accept incoming trades`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))



        const Ptrade = await this.client.dbs.trades.findOne({ traders: msg.author.id })
        if (Ptrade)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You're already trading`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        const PPtrade = await this.client.dbs.trades.findOne({ traders: user.id })
        if (PPtrade)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`This person is already trading`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        new this.client.dbs.trades({
            traders: [msg.author.id, user.id]
        }).save().catch(err => console.log(err))

        P.isTrading = true
        PP.isTrading = true

        P.save().catch(err => console.log(err))
        PP.save().catch(err => console.log(err))

          return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`<@${msg.author.id}> is now trading with <@${user.id}>`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

    }
}