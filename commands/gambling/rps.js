const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")
const { stripIndents } = require("common-tags")

const mongoose = require("mongoose")

module.exports = class rps extends Command {
    constructor(client) {
        super(client, {
            name: 'rps',
            description: 'A game of Rock Paper Scissors',
            group: 'gambling',
            memberName: 'rps',
            throttling: {
                usages: 1,
                duration: 10
            },
            args: [{
                type: "string",
                prompt: "rock paper or scissors?",
                key: "choice",
                oneOf: ["rock", "paper", "scissors"],
                parse: s => s.toLowerCase()
            }, {
                type: "integer",
                prompt: "Choose how much to bet!",
                key: "amount",
                min: 0,
                default: 0
            }]
        })
    }

    async run(msg, { choice, amount }) {

        const P = await this.client.dbs.profile.findOne({ id: msg.author.id })
        if (!P)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You need to open some crates to earn some money!`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if (P.balance < amount)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You don't have enough to bet that much`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))


        let pos = ["rock", "paper", "scissors"]

        let res = pos[Math.floor(Math.random() * pos.length)]

        let userRes

        //Win

        if (choice === "rock" && res === "scissors") userRes = "win"
        if (choice === "paper" && res === "rock") userRes = "win"
        if (choice === "scissors" && res === "paper") userRes = "win"

        //Draw
        if (choice === res) userRes = "draw"

        //Lose
        if (res === "rock" && choice === "scissors") userRes = "lose"
        if (res === "paper" && choice === "rock") userRes = "lose"
        if (res === "scissors" && choice === "paper") userRes = "lose"

        let embedColor
        if (userRes === "win") embedColor = "GREEN"
        if (userRes === "draw") embedColor = "GREY"
        if (userRes === "lose") embedColor = "RED"

        let winLoseMsg
        let moneyEmoji = this.client.emojis.cache.get("696719071009570848")
        let RCOEmoji = this.client.emojis.cache.get("702415357704667216")

        if (userRes === "win") {

            if (amount === 0) {
                winLoseMsg = `You __**won**__  You didn't bet anything`
            } else {
                P.balance += amount
                P.save().catch(err => console.log(err))

                winLoseMsg = `You __**won**__ and gained ${amount}${moneyEmoji}!`
            }

        } else if (userRes === "lose") {
            winLoseMsg = `You __**lost**__ You didn't bet anything`
            if (amount === 0) {

            } else {
                P.balance -= amount
                P.save().catch(err => console.log(err))
                winLoseMsg = `You __**lost**__ and lost ${amount}${moneyEmoji}!`
            }

        } else {

            if (amount === 0) {
                winLoseMsg = `You __**drew**__! You didn't bet anything`
            } else {
                winLoseMsg = `You __**drew**__! You reclaimed your bet of ${amount}`
            }
        }


        msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(stripIndents`
               You: ${choice.toUpperCase()} v ${res.toUpperCase()} ${RCOEmoji}

            ${winLoseMsg}
            `)
            .setColor(embedColor)
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))




    }
}
