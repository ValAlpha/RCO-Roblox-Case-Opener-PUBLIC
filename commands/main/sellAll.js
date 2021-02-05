const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")
const toDecimal = require("to-decimal")
const { abbreviateNumber  } = require("js-abbreviation-number")
const { monthsShort } = require("moment")
const { stripIndent } = require("common-tags")

module.exports = class sellall extends Command {
    constructor(client) {
        super(client, {
            name: 'sellall',
            description: 'Sell ALL items in your inventory',
            group: 'main',
            memberName: 'sellall',
            aliases: ['sa'],
            args: [{
                type: "string",
                prompt: '\`all\`, \`dupes\` or \`[category]\`',
                key: 'catagory',
                oneOf: ['all', 'hat', 'face', 'gear', 'package', 'hair accessory', 'face accessory', 'neck accessory', 'shoulder accessory', 'front accessory', 'back accessory', 'waist accessory', "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "dupes"]
            }]
        })
    }

    async run(msg, { catagory }) {

        const p = await this.client.dbs.profile.findOne({ id: msg.author.id })
        if (!p)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You don't have any items.. Go open some crates!`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        let moneyEmoji = this.client.emojis.cache.get("696719071009570848"),
            getValue = (oldVal, newVal, add = false) => {
                let value = add === true ? oldVal + newVal : oldVal - newVal;
                if (value.toString().startsWith("-")) return Number(0);
                return Number(value);
            }

        if (catagory.toLowerCase() === 'all') {


            if (p.inventory.length < 1)   return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`You don't have any items to sell!`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

            let moneyEarned = 0



            let itemsToSell = p.inventory.filter(i => i.locked === false)
            let itemsToSellValue = itemsToSell.forEach(i => {
                moneyEarned = moneyEarned + Number(i.totalValue)
            })

            if (itemsToSell.length < 1)   return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`You have nothing to sell`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

            p.inventory = p.inventory.filter(i => i.locked === true)

            let perc = toDecimal(p.saleBonus)

            let sum = moneyEarned + (perc * moneyEarned)

            let eqPets = p.pets.filter(pet => pet.equipped === true)
            let coinBoost = 0
            eqPets.forEach(pet => { coinBoost += pet.coinBoost })

            let coinBoostPerc = coinBoost/100
        
            function val (salePrice, boost){

            let percOfSalePrice = boost * salePrice
            return (percOfSalePrice + salePrice)

            }

            let boostSum = val(sum, coinBoostPerc)
            
            sum = boostSum + (perc * boostSum)

            p.value = getValue(p.value, moneyEarned, false);
            p.balance = getValue(p.balance, sum, true);

            p.save().catch(err => console.log(err))

            
        
            return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setTitle(`Items sold!`)
                .setDescription(`You sold all items and gained ${abbreviateNumber(Math.round(sum), 2)} ${this.client.emojis.cache.get("696719071009570848")}`)
                .setColor("GREEN")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))


        } else if(catagory.toLowerCase() === "dupes"){

            if(p.inventory.length < 1) return msg.say(`You have no items`)

            let dupeItems = p.inventory.filter(i => i.amount > 1 && i.locked === false)

            if(dupeItems.length < 1) return msg.say(`You have no duplicate items to sell`)

            const calculateDupes = () => {
                let moneyMade = 0
                let newValue = 0
                dupeItems.forEach(i => {
                    moneyMade += (i.amount - 1) * i.itemWorth
                    let itemToChange = p.inventory.find(item => item.itemID === i.itemID)
                    newValue += i.itemWorth
                    
                    itemToChange.amount = 1
                    itemToChange.totalValue = itemToChange.itemWorth
                    p.value = newValue  
                })
                return moneyMade
            }
            let sum = calculateDupes()
            p.balance += sum    

            p.save().catch(err => console.log(err))
            
              return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(stripIndent`You sold all duplicate items!
                
                You recieved: ${abbreviateNumber(sum, 2)} ${this.client.emojis.cache.get("696719071009570848")}`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

               
            
            

        } else {

            let searchTerm

            if (catagory.toLowerCase() === "hat" || catagory === "1") {
                searchTerm = "hat"
            } else if (catagory.toLowerCase() === "face" || catagory === "2") {
                searchTerm = "face"
            } else if (catagory.toLowerCase() === "gear" || catagory === "3") {
                searchTerm = "gear"
            } else if (catagory.toLowerCase() === "package" || catagory === "4") {
                searchTerm = "package"
            } else if (catagory.toLowerCase() === "hair accessory" || catagory === "5") {
                searchTerm = "hair accessory"
            } else if (catagory.toLowerCase() === "face accessory" || catagory === "6") {
                searchTerm = "face accessory"
            } else if (catagory.toLowerCase() === "neck accessory" || catagory === "7") {
                searchTerm = "neck accessory"
            } else if (catagory.toLowerCase() === "shoulder accessory" || catagory === "8") {
                searchTerm = "shoulder accessory"
            } else if (catagory.toLowerCase() === "front accessory" || catagory === "9") {
                searchTerm = "front accessory"
            } else if (catagory.toLowerCase() === "back accessory" || catagory === "10") {
                searchTerm = "back accessory"
            } else if (catagory.toLowerCase() === "waist accessory" || catagory === "11") {
                searchTerm = "waist accessory"
            }

            let moneyEarned = 0,
                itemsToSell = p.inventory.filter(item => item.itemType === searchTerm)

            if (itemsToSell.length < 1)   return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`You don't have any **${searchTerm}** items to sell!`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

            let itemsToKeep = p.inventory.filter(item => item.itemType !== searchTerm)

            itemsToSell.forEach(item => moneyEarned = moneyEarned + Number(item.totalValue))

            let perc = toDecimal(p.saleBonus)
            let sum = moneyEarned + (perc * moneyEarned)

            let eqPets = p.pets.filter(pet => pet.equipped === true)
            let coinBoost = 0
            eqPets.forEach(pet => { coinBoost += pet.coinBoost })

            let coinBoostPerc = coinBoost/100
        
        function val (salePrice, boost){

            let percOfSalePrice = boost * salePrice
            return (percOfSalePrice + salePrice)

        }

        

            let boostSum = val(sum, coinBoostPerc)
            
            sum = boostSum + (perc * boostSum)

            p.inventory = itemsToKeep;
            p.value = getValue(p.value, moneyEarned, false);
            p.balance = getValue(p.balance, sum, true);

            p.save().catch(err => console.log(err))

            return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setTitle(`Items sold!`)
                .setDescription(`You sold all **${searchTerm}** items and gained ${abbreviateNumber(Math.round(sum), 2)} ${this.client.emojis.cache.get("696719071009570848")}`)
                .setColor("GREEN")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        }

    }
}