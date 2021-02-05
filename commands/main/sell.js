const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")
const toDecimal = require("to-decimal")
const mongoose = require("mongoose")
const { abbreviateNumber  } = require("js-abbreviation-number")

module.exports = class sell extends Command {
    constructor(client) {
        super(client, {
            name: 'sell',
            description: 'Sell your items',
            group: 'main',
            memberName: 'sell',
            args: [{
                type: 'string',
                prompt: 'What are you selling? (Use item ID if selling case items!)',
                key: 'itemToSell',
            }, {
                type: 'integer',
                prompt: 'How many?',
                key: 'amount',
                min: 1
            }]
        })
    }

    async run(msg, { itemToSell, amount }) {

        const p = await this.client.dbs.profile.findOne({ id: msg.author.id })

        if (!p)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You don't have anything to sell.. Go open some crates!`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        let itemitemToSell = p.inventory.find(item => item.itemID === itemToSell);

        if (!itemitemToSell)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You don't own this item`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))).catch(err => { })

        if (itemitemToSell.locked === true)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`This item is locked preventing you from selling!`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if (itemitemToSell.amount < amount)  return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You only own **${itemitemToSell.amount}** ${itemitemToSell.name}`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        let saleBefore = itemitemToSell.itemWorth * amount

        let perc = toDecimal(p.saleBonus)

        let sum = Math.floor(saleBefore + (perc * saleBefore))

        let eqPets = p.pets.filter(pet => pet.equipped === true)
        let coinBoost = 0
        eqPets.forEach(pet => { coinBoost += pet.coinBoost })

        let coinBoostPerc = coinBoost/100
        
        function val (salePrice, boost){

            let percOfSalePrice = boost * salePrice
            return (percOfSalePrice + salePrice)

        }

        let boostSum = val(sum, coinBoostPerc)

        p.balance = (p.balance + boostSum)
        
        itemitemToSell.amount = (itemitemToSell.amount - amount)
        p.value = p.value - (itemitemToSell.itemWorth * amount)

        const findItemIndex = p.inventory.forEach((item, index) => {
            if (item.amount === 0) {
                item.remove()
            }
        })


        p.save().catch(err => console.log(err))

        if (eqPets.length === 0) {
            return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setTitle(amount > 1 ? `Items sold!` : `Item sold`)
                .setDescription(`You sold ${amount} ${itemitemToSell.name} and gained ${abbreviateNumber(Math.round(sum), 2)} ${this.client.emojis.cache.get("696719071009570848")}`)
                .setColor("GREEN")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        } else {
            return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setTitle(amount > 1 ? `Items sold!` : `Item sold`)
                .setDescription(`You sold ${amount} ${itemitemToSell.name} and gained ${abbreviateNumber(Math.round(boostSum), 2)} ${this.client.emojis.cache.get("696719071009570848")}`)
                .setColor("GREEN")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        }

    }
}