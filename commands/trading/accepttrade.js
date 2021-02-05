const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")


module.exports = class accepttrade extends Command {
    constructor(client) {
        super(client, {
            name: 'accepttrade',
            description: 'Accept your current trade',
            group: 'trading',
            memberName: 'accepttrade',
            aliases: ["ac"],
            args: [{
                type: "string",
                prompt: "Are you sure you want to accept? You trade at your own risk!",
                key: "answer",
                oneOf: ["y", "yes", "n", "no"]
            }]
        })
    }

    async run(msg, { answer }) {

        const P = await this.client.dbs.profile.findOne({ id: msg.author.id })

        const trade = await this.client.dbs.trades.findOne({ traders: msg.author.id })

        if (!P || !P.isTrading || !trade)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You're not trading`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        let personOne
        let personTwo

        if (trade.traders[0] === msg.author.id) {
            personOne = await this.client.dbs.profile.findOne({ id: trade.traders[0] })

            personTwo = await this.client.dbs.profile.findOne({ id: trade.traders[1] })
        } else {

            personOne = await this.client.dbs.profile.findOne({ id: trade.traders[1] })

            personTwo = await this.client.dbs.profile.findOne({ id: trade.traders[0] })

        }

        if (answer === "n" || answer === "no") {
              return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`Ok!`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        } else {


            personOne.accepted = true

            if (personOne.accepted && personTwo.accepted) {

                personTwo.tempStorage.forEach(tempItem => {

                    let existsInInv = personOne.inventory.find(item => item.itemID === tempItem.itemID)

                    if (existsInInv) {
                        existsInInv.amount += tempItem.amount
                        existsInInv.totalValue += tempItem.amount * tempItem.itemWorth
                    } else {
                        personOne.inventory.push({
                            name: tempItem.name,
                            itemID: tempItem.itemID,
                            amount: tempItem.amount,
                            itemWorth: tempItem.itemWorth,
                            totalValue: tempItem.itemWorth,
                            itemType: tempItem.itemType,
                            limited: tempItem.isLimited ? true : false,
                            locked: false
                        })
                    }

                })

                personOne.tempStorage.forEach(tempItem => {

                    let existsInInv = personTwo.inventory.find(item => item.itemID === tempItem.itemID)

                    if (existsInInv) {
                        existsInInv.amount += tempItem.amount
                        existsInInv.totalValue += tempItem.amount * tempItem.itemWorth
                    } else {
                        personTwo.inventory.push({
                            name: tempItem.name,
                            itemID: tempItem.itemID,
                            amount: tempItem.amount,
                            itemWorth: tempItem.itemWorth,
                            totalValue: tempItem.itemWorth,
                            itemType: tempItem.itemType,
                            limited: tempItem.isLimited ? true : false,
                            locked: false
                        })
                    }

                })

                personOne.tempStorage = []
                personTwo.tempStorage = []

                personOne.isTrading = false
                personTwo.isTrading = false

                personOne.accepted = false
                personTwo.accepted = false

                personOne.tradeCount++
                personTwo.tradeCount++

                trade.remove()

                personOne.save().catch(err => console.log(err))
                personTwo.save().catch(err => console.log(err))

                  return msg.say(new MessageEmbed()
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`Trade complete`)
                    .setColor("RANDOM")
                    .setTimestamp()
                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

            } else if (personOne.accepted && !personTwo.accepted) {

                personOne.save().catch(err => console.log(err))

                  return msg.say(new MessageEmbed()
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`The person you're trading with hasn't accepted`)
                    .setColor("RANDOM")
                    .setTimestamp()
                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
            }

        }

    }
}