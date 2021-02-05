const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")


module.exports = class tradeadd extends Command {
    constructor(client) {
        super(client, {
            name: 'tradeadd',
            description: 'Add an item to your trade list',
            group: 'trading',
            memberName: 'tradeadd',
            aliases: ["ta"],
            args: [{
                type: "string",
                prompt: "Which item? (ID)",
                key: "toAdd"
            }, {
                type: "integer",
                prompt: "How many?",
                key: "amount"
            }]
        })
    }

    async run(msg, { toAdd, amount }) {

        const P = await this.client.dbs.profile.findOne({ id: msg.author.id })

        if (!P || !P.isTrading)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You're not trading`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))


        let itemToAdd = P.inventory.find(i => i.itemID === toAdd)

        let existsInTemp = P.tempStorage.find(i => i.itemID === toAdd)

        if (!itemToAdd && existsInTemp)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You have no more of this item to add to your trade list`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if (!itemToAdd)  return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You don't own this item`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if (itemToAdd.locked === true)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You've locked this item. You need to unlock it if you want to trade it`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if (amount > itemToAdd.amount)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You only own ${itemToAdd.amount} of this item`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))


        if (existsInTemp) {
            let newAmount = existsInTemp.amount + amount

            existsInTemp.amount += amount
            existsInTemp.totalValue += existsInTemp.itemWorth * amount


            itemToAdd.amount -= amount
            itemToAdd.totalValue -= itemToAdd.itemWorth * amount

            if (itemToAdd.amount === 0) {
                itemToAdd.remove()
            }

        } else {
            P.tempStorage.push({
                name: itemToAdd.name,
                itemID: itemToAdd.itemID,
                amount: amount,
                itemWorth: itemToAdd.itemWorth,
                totalValue: itemToAdd.itemWorth * amount,
                itemType: itemToAdd.itemType,
                limited: itemToAdd.limited ? true : false,
            })

            itemToAdd.amount -= amount
            itemToAdd.totalValue -= itemToAdd.itemWorth * amount
            if (itemToAdd.amount === 0) {
                itemToAdd.remove()
            }

              return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`Item added`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        }

        P.save().catch(err => console.log(err))






    }
}