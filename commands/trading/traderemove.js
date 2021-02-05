const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")


module.exports = class traderemove extends Command {
    constructor(client) {
        super(client, {
            name: 'traderemove',
            description: 'Remove an item from your trade list',
            group: 'trading',
            memberName: 'traderemove',
            aliases: ["tr"],
            args: [{
                type: "string",
                prompt: "Which item do you want to remove?",
                key: "toRemove"
            }, {
                type: "integer",
                prompt: "How many?",
                key: "amount"
            }]
        })
    }

    async run(msg, { toRemove, amount }) {

        let P = await this.client.dbs.profile.findOne({ id: msg.author.id })

        if (!P || P.isTrading === false)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You're not trading`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if (P.tempStorage.length === 0)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Your trade list is empty, Nothing to remove`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        let itemToRemove = P.tempStorage.find(i => i.itemID === toRemove)

        if (!itemToRemove)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`This item isn't in your trading list`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if (itemToRemove.amount < amount)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You only have ${itemToRemove.amount} of these in your trade list`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        //!Check if already in inv

        let isInInv = P.inventory.find(i => i.itemID === toRemove)


        if (!isInInv) {
            P.inventory.push({
                name: itemToRemove.name,
                itemID: itemToRemove.itemID,
                amount: amount,
                itemWorth: itemToRemove.itemWorth,
                totalValue: itemToRemove.itemWorth * amount,
                itemType: itemToRemove.itemType,
                limited: itemToRemove.limited ? true : false,
            })

            itemToRemove.amount -= amount
            itemToRemove.totalValue -= (itemToRemove.itemWorth * amount)
            if (itemToRemove.amount === 0) {
                itemToRemove.remove()
            }
        } else {
            let newAmount = isInInv.amount + amount

            isInInv.amount += amount
            isInInv.totalValue += isInInv.itemWorth * amount

            itemToRemove.amount -= amount
            itemToRemove.totalValue -= itemToRemove.itemWorth * amount

            if (itemToRemove.amount === 0) {
                itemToRemove.remove()
            }
        }

        P.save().catch(err => console.log(err))

          return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`${amount} x ${itemToRemove.name} (${itemToRemove.itemID}) removed from your trade list`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
    }
}