const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")
const { stripIndents } = require("common-tags")

const mongoose = require("mongoose")

module.exports = class slots extends Command {
    constructor(client) {
        super(client, {
            name: 'slots',
            description: 'A game of slots to earn some money!',
            group: 'gambling',
            memberName: 'slots',
            throttling: {
                usages: 1,
                duration: 10
            },
            args: [{
                type: "integer",
                prompt: "How much do you want to bet?",
                key: "amount",
                min: 5
            }]
        })
    }

    async run(msg, { amount }) {

        const P = await this.client.dbs.profile.findOne({ id: msg.author.id })

        if (!P)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You need to open some crates to earn some money!`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if (P.balance < amount)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You don't have enough to bet that amount!`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        let emojis = ["❤", "💙", "💚"]
        const moneyEmoji = this.client.emojis.cache.get("696719071009570848")

        let slot1 = emojis[Math.floor(Math.random() * emojis.length)]
        let slot2 = emojis[Math.floor(Math.random() * emojis.length)]
        let slot3 = emojis[Math.floor(Math.random() * emojis.length)]

        let message

        if (slot1 === slot2 && slot1 === slot3) {
            P.balance += amount
            P.save().catch(err => console.log(err))

            message = `.⭐WIN!⭐\nWon: ${amount}${moneyEmoji}\nNew balance: ${P.balance}${moneyEmoji}`

        } else if (slot1 === slot2 || slot2 === slot3) {
            const sum = 10 / 100 * amount
            P.balance -= amount + sum
            P.save().catch(err => console.log(err))
            message = `✨You matched 2!✨\nYou gained 10% of your bet!\nWon: ${sum}${moneyEmoji}\nNew balance: ${P.balance}${moneyEmoji}`
            P.balance - sum
        } else {
            P.balance -= amount
            P.save().catch(err => console.log(err))
            message = `Bad luck, You lost!\nLost: ${amount}${moneyEmoji}\nNew balance: ${P.balance}${moneyEmoji}`
        }


        msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`${slot1} | ${slot2} | ${slot3}
            
            ${message}`)
            .setColor("RANDOM")
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
    }
}