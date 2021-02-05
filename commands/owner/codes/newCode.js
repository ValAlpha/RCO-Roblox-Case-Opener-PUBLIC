const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")


module.exports = class newcode extends Command {
    constructor(client) {
        super(client, {
            name: 'newcode',
            description: 'Create a new code',
            group: 'owner',
            memberName: 'newcode',
            ownerOnly: true,
            args: [{
                type: "string",
                prompt: "What is the code?",
                key: "newCode"
            }, {
                type: "integer",
                prompt: "What's the reward?",
                key: "reward"
            }]
        })
    }

    async run(msg, { newCode, reward }) {

        const C = await this.client.dbs.codes.findOne({ dbID: this.client.user.id })
        if (!C) {
            new this.client.dbs.codes({
                dbID: this.client.user.id,
                codes: [{
                    code: newCode,
                    reward,
                    claimed: []
                }]
            }).save()
                .then(msg.say(new MessageEmbed()
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`__**Database Created**__
            New code added: ${newCode}
            The reward is ${reward}`)
                    .setColor("ORANGE")
                    .setTimestamp()
                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))))
                .catch(err => console.log(err))
        } else if (C.codes.find(c => c.code === newCode)) {
              return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`That code is already in use!`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        } else {

            C.codes.push({
                code: newCode,
                reward,
                type: "money",
                claimed: []
            })

            C.save()
                .then(msg.say(new MessageEmbed()
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`__**Code Added**__
            New code added: ${newCode}
            The reward is ${reward}`)
                    .setColor("GREEN")
                    .setTimestamp()
                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))))
                .catch(err => console.log(err))

        }

    }
}