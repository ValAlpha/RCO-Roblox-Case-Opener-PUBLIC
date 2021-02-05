const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")


module.exports = class removecode extends Command {
    constructor(client) {
        super(client, {
            name: 'removecode',
            description: 'Remove a code',
            group: 'owner',
            memberName: 'removecode',
            ownerOnly: true,
            args: [{
                type: "string",
                prompt: "What's the code?",
                key: "toRemove"
            }]
        })
    }

    async run(msg, { toRemove }) {

        const C = await this.client.dbs.codes.findOne({ dbID: this.client.user.id })

        if (!C)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`There are no active codes`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))


        let codeToRemove = C.codes.find(c => c.code.toLowerCase() === toRemove.toLowerCase())

        if (!codeToRemove)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`That code does not exist!`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        codeToRemove.remove()

        C.save().then(msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`**__Code Removed!__**
        ${codeToRemove.code} was removed. It had a total reach of ${codeToRemove.claimed.length} users`)
            .setColor("GREEN")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))))
            .catch(err => console.log(err))

    }
}