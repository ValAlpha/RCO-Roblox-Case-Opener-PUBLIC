const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")
const { stripIndents } = require("common-tags")


module.exports = class support extends Command {
    constructor(client) {
        super(client, {
            name: 'support',
            description: 'Get a link in DMs to the RCO support server',
            group: 'other',
            memberName: 'support',
        })
    }

    async run(msg) {


        msg.author.send(`Here's a link to the RCO support server! https://discord.gg/pPh8p3x`).catch(err => {
            if(err){
                msg.reply(`Your DMs are set to private and I'm unable to send you the invite! 😢`)
            }
        })
        

    }
}