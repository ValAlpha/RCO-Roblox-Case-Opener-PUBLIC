const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")


module.exports = class canceltrade extends Command {
    constructor(client) {
        super(client, {
            name: 'canceltrade',
            description: 'Cancel trade',
            group: 'trading',
            memberName: 'canceltrade',
            aliases: ["ct"],
        })
    }

    async run(msg) {

        const P = await this.client.dbs.profile.findOne({ id: msg.author.id })

        if (!P || !P.isTrading)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You're not trading`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        let trade = await this.client.dbs.trades.findOne({ traders: msg.author.id })

        if (!trade)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You're not trading`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        let personOneProfile = await this.client.dbs.profile.findOne({ id: trade.traders[0] })

        let personTwoProfile = await this.client.dbs.profile.findOne({ id: trade.traders[1] })


        personOneProfile.tempStorage.forEach(tempItem => {

            if (!tempItem) {

            } else {

                let existsInInv = personOneProfile.inventory.find(item => item.itemID === tempItem.itemID)

                if (existsInInv) {
                    existsInInv.amount += tempItem.amount
                    existsInInv.totalValue += tempItem.amount * tempItem.itemWorth
                } else {
                    personOneProfile.inventory.push({
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

            }

        })

        personTwoProfile.tempStorage.forEach(tempItem => {

            if (!tempItem) {

            } else {

                let existsInInv = personTwoProfile.inventory.find(item => item.itemID === tempItem.itemID)

                console.log(existsInInv)

                if (existsInInv) {
                    existsInInv.amount += tempItem.amount
                    existsInInv.totalValue += tempItem.amount * tempItem.itemWorth
                } else {
                    personTwoProfile.inventory.push({
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

            }

        })

        personOneProfile.isTrading = false
        personTwoProfile.isTrading = false

        personOneProfile.tempStorage = []
        personTwoProfile.tempStorage = []

        trade.remove()

        personOneProfile.save().catch(err => console.log(err))
        personTwoProfile.save().catch(err => console.log(err))


          return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`The trade between <@${personOneProfile.id}> and <@${personTwoProfile.id}> has been canceled`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

    }
}