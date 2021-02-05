const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")


module.exports = class btremove extends Command {
    constructor(client) {
        super(client, {
            name: 'btremove',
            description: 'Remove user from beta tester collection',
            group: 'owner',
            memberName: 'btremove',
            ownerOnly: true,
            args: [{
                type: "user",
                prompt: "Who are you removing",
                key: "toRemove"
            }]
        })
    }

    async run(msg, { toRemove }) {

        const BT = await this.client.dbs.betatesters.findOne({ dbID: this.client.user.id })

        const P = await this.client.dbs.profile.findOne({ id: toRemove.id })
        if (!P)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`This user isn't a beta tester`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if (!BT)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Beta Tester collection missing!`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        let testers = []

        BT.testers.forEach(u => {
            testers.push(u.userID)
        })

        if (!testers.includes(toRemove.id))   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`This user isn't a beta tester`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        BT.testers.find(u => u.userID === toRemove.id).remove()
        P.betaTester = false

        BT.save().catch(err => console.log(err))
        P.save().catch(err => console.log(err))

          return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`That user is no longer a beta tester`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

    }
}