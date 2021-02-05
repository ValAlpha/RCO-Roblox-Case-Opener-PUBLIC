const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")

const mongoose = require("mongoose")

module.exports = class guessnumber extends Command {
    constructor(client) {
        super(client, {
            name: 'guessnumber',
            description: 'Guess the number between 1 & 10',
            group: 'gambling',
            memberName: 'guessnumber',
            throttling: {
                duration: 10,
                usages: 1
            },
            args: [{
                type: "integer",
                prompt: "which number? 1 - 10",
                key: "choice",
                min: 1,
                max: 10
            }, {
                type: "integer",
                prompt: "How much are you betting?",
                key: "bet",
                min: 1
            }]
        })
    }

    async run(msg, { choice, bet }) {

        const P = await this.client.dbs.profile.findOne({ id: msg.author.id })

        if (!P)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You need to open some crates to earn some money!`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if (P.balance < bet)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You don't have this much money to bet`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        let num = Math.floor(Math.random() * 10) + 1

        switch (num === choice) {
            case true:
                P.balance += bet
                break;
            case false:
                P.balance -= bet
                break;
        }

        let moneyEmoji = this.client.emojis.cache.get(`696719071009570848`)
        let thumbnailURL

        switch (num !== undefined) {
            case num === 1:
                thumbnailURL = `https://i.vgy.me/1CB1wm.png`
                break;

            case num === 2:
                thumbnailURL = `https://i.vgy.me/naJt24.png`
                break;

            case num === 3:
                thumbnailURL = `https://i.vgy.me/WENcw4.png`
                break;

            case num === 4:
                thumbnailURL = `https://i.vgy.me/0MCa3y.png`
                break;

            case num === 5:
                thumbnailURL = `https://i.vgy.me/FP3Kj7.png`
                break;

            case num === 6:
                thumbnailURL = `https://i.vgy.me/sV84nQ.png`
                break;

            case num === 7:
                thumbnailURL = `https://i.vgy.me/yC4gUe.png`
                break;

            case num === 8:
                thumbnailURL = `https://i.vgy.me/Qrdgsn.png`
                break;

            case num === 9:
                thumbnailURL = `https://i.vgy.me/g0tQcJ.png`
                break;

            case num === 10:
                thumbnailURL = `https://i.vgy.me/aouOLZ.png`
                break;

            default: null

        }

        P.save().catch(err => console.log(err))

        msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`🔢 Guess the Number 🔢`)
            .addField(`You guessed: ${choice}`, `\u200b`)
            .addField(`The number was: ${num}`, `\u200b`)
            .addField(`${choice === num ? `You won` : `You lost`} ${bet}${moneyEmoji}`, `\u200b`)
            .setColor(`${num === choice ? "GREEN" : "RED"}`)
            .setThumbnail(thumbnailURL)
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

    }
}