const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")

const mongoose = require("mongoose")
const BotSettings = require("../../../models/botSettings")


module.exports = class caseprice extends Command {
    constructor(client) {
        super(client, {
            name: 'caseprice',
            description: `Set the price for cases`,
            group: 'owner',
            memberName: 'caseprice',
            ownerOnly: true,
            aliases: ['cp'],
            args: [{
                type: "string",
                prompt: 'Which case?',
                key: 'caseName',
                oneOf: ['noob', 'bronze', 'silver', 'gold', 'epic']
            }, {
                type: 'integer',
                prompt: 'How much',
                key: 'newPrice',
            }]
        })
    }

    async run(msg, { caseName, newPrice }) {

        const BS = await BotSettings.findOne({ ownerID: msg.author.id })

        let tickEmoji = this.client.emojis.cache.get('698540646033522698')

        let crossEmoji = this.client.emojis.cache.get('698540645962481714')

        if (!BS) {
            new BotSettings({
                ownerID: msg.author.id
            }).save()
                .then(msg.say(new MessageEmbed()
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`Oops, Run the command again!`)
                    .setColor("RANDOM")
                    .setTimestamp()
                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))))
                .catch(err => console.log(err))
        } else {

            if (BS.cases[caseName].price === newPrice) {
                  return msg.say(new MessageEmbed()
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`The ${caseName} price is already set to ${BS.cases[caseName].price}`)
                    .setColor("RANDOM")
                    .setTimestamp()
                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))


            } else {

                BS.cases[caseName].price = newPrice

                BS.save()
                    .then(msg.say(new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                        .setDescription(`I updated the price of the ${caseName} case to ${newPrice}`)
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))))
                    .catch(err => console.log(err))
            }

        }

    }
}   
