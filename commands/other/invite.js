const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")
const { stripIndents } = require("common-tags")


module.exports = class invite extends Command {
    constructor(client) {
        super(client, {
            name: 'invite',
            description: 'Invite me to your server!',
            group: 'other',
            memberName: 'invite',
        })
    }

    async run(msg) {


        msg.say(new MessageEmbed()
            .setAuthor(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))
            .setDescription(stripIndents`[Invite me to your server](https://discordapp.com/api/oauth2/authorize?client_id=688542620040953913&permissions=912448&scope=bot)
            [Support server](https://discord.gg/pPh8p3x)`)
            .setColor("#FF0000")
            .setTimestamp()
            .setFooter(`Requested by: ${msg.author.username}#${msg.author.discriminator}`)).catch(err => { })

    }
}