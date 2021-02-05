const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")
const hastebin = require("hastebin.js")

const { stripIndents } = require("common-tags")

module.exports = class inventory extends Command {
        constructor(client) {
            super(client, {
                name: 'inventory',
                description: "View yours or someone else's inventory",
                group: 'main',
                memberName: 'inventory',
                aliases: ["inv"],
                args: [{
                    type: 'string',
                    prompt: 'Which inventory category?',
                    key: 'category',
                    oneOf: ['hat', 'face', 'gear', 'package', 'hair accessory', 'face accessory', 'neck accessory', 'shoulder accessory', 'front accessory', 'back accessory', 'waist accessory', "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "limited", "limiteds", 'pets'],
                    default: 'all'
                }]
            })
        }

        async run(msg, { category }) {



                const p = await this.client.dbs.profile.findOne({ id: msg.author.id })

                if (!p)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You don't have any items`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

                if (category === 'all') {

                    return msg.say(new MessageEmbed()
                            .setTitle(`Click here to view your inventory on our website!`)
                            .setURL(`https://robloxcaseopener.xyz`)
                            .setAuthor(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))
                            .setDescription(stripIndents `**You have ${p.inventory.length} unique items**
                            
            **Inventory categories**:
            1 - hat **(${p.inventory.filter(i => i.itemType === `hat`).length || `0`})**
            2 - face **(${p.inventory.filter(i => i.itemType === `face`).length || `0`})**
            3 - gear **(${p.inventory.filter(i => i.itemType === `gear`).length || `0`})**
            4 - package **(${p.inventory.filter(i => i.itemType === `package`).length || `0`})**
            5 - hair accessory **(${p.inventory.filter(i => i.itemType === `hair accessory`).length || `0`})**
            6 - face accessory **(${p.inventory.filter(i => i.itemType === `face accessory`).length || `0`})**
            7 - neck accessory **(${p.inventory.filter(i => i.itemType === `neck accessory`).length || `0`})**
            8 - shoulder accessory **(${p.inventory.filter(i => i.itemType === `shoulder accessory`).length || `0`})**
            9 - front accessory **(${p.inventory.filter(i => i.itemType === `front accessory`).length || `0`})**
            10 - back accessory **(${p.inventory.filter(i => i.itemType === `back accessory`).length || `0`})**
            11 - waist accessory **(${p.inventory.filter(i => i.itemType === `waist accessory`).length || `0`})**
            12 - ✨limiteds✨ **(${p.inventory.filter(i => i.limited === true).length || `0`})**`)
                .setColor("RANDOM")
                .setFooter(`Use ${this.client.commandPrefix}inv [category/category number]`)).catch(err => { })
        } else {

            let searchTerm

            if (category.toLowerCase() === "hat" || category === "1") {
                searchTerm = "hat"
            } else if (category.toLowerCase() === "face" || category === "2") {
                searchTerm = "face"
            } else if (category.toLowerCase() === "gear" || category === "3") {
                searchTerm = "gear"
            } else if (category.toLowerCase() === "package" || category === "4") {
                searchTerm = "package"
            } else if (category.toLowerCase() === "hair accessory" || category === "5") {
                searchTerm = "hair accessory"
            } else if (category.toLowerCase() === "face accessory" || category === "6") {
                searchTerm = "face accessory"
            } else if (category.toLowerCase() === "neck accessory" || category === "7") {
                searchTerm = "neck accessory"
            } else if (category.toLowerCase() === "shoulder accessory" || category === "8") {
                searchTerm = "shoulder accessory"
            } else if (category.toLowerCase() === "front accessory" || category === "9") {
                searchTerm = "front accessory"
            } else if (category.toLowerCase() === "back accessory" || category === "10") {
                searchTerm = "back accessory"
            } else if (category.toLowerCase() === "waist accessory" || category === "11") {
                searchTerm = "waist accessory"
            }else if(category.toLowerCase() === "limiteds" || category === "12"){
                searchTerm = "limiteds"
            }
            
               
            if(category.toLowerCase() === 'pets'){

                if(p.pets.length < 1)   return msg.say(new MessageEmbed()
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`You don't have any pets`)
                    .setColor("RANDOM")
                    .setTimestamp()
                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

                let lockEmoji = this.client.emojis.cache.get("753814265831358534")
                let eqPets = p.pets.filter(pet => pet.equipped === true)
                let mappedEqPets = eqPets.map(pet => `${this.client.emojis.cache.get(pet.emojiID)} ${pet.type} - ${this.client.emojis.cache.get("696719071009570848")}${pet.coinBoost}% - **${pet.rarity}** [**${pet.petID}**] ${pet.equipped ? this.client.emojis.cache.get("698540646033522698") : ``} ${pet.locked ? lockEmoji : ``}`).join(`\n`)

                let notEqPets = p.pets.filter(pet => pet.equipped === false)
                let mappedNotEqPets = notEqPets.map(pet => `${this.client.emojis.cache.get(pet.emojiID)} ${pet.type} - ${this.client.emojis.cache.get("696719071009570848")}${pet.coinBoost}% - **${pet.rarity}** [**${pet.petID}**] ${pet.equipped ? this.client.emojis.cache.get("698540646033522698") : ``} ${pet.locked ? lockEmoji : ``}`).join(`\n`)
                
                let totalCoinBoost = 0 
                eqPets.forEach(pet => totalCoinBoost += pet.coinBoost)

               msg.say(new MessageEmbed()
               .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
               .setTitle(`PETS (${p.pets.length}) \n **+ ${totalCoinBoost}% money boost**`)
               .setDescription(`pet type | money boost | rarity | pet ID

               ${mappedEqPets}
               
               ${mappedNotEqPets}`)
               .setTimestamp()
               .setColor("RANDOM")
               .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
               return
            }

            if(searchTerm === "limiteds"){
                let itemLookup = p.inventory.filter(item => item.limited === true)
                let itemsToDisplay = itemLookup.map(i => `${i.amount} x ${i.name} (${i.itemID}) ${i.locked === true ? `🔒` : ``}`).join(`\n`)

                if (!itemsToDisplay) {
                      return msg.say(new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                        .setDescription(`You don't own any items of this type!`)
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
                } else if (itemsToDisplay.length < 2000) {
                    msg.say(new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                        .setDescription(stripIndents`amount | name | itemID
                        __**${searchTerm}**__
    
                    ${itemsToDisplay}`)
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))).catch(err => { })
                } else {
                  return msg.say(new MessageEmbed()
                  .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true})))
                  .setDescription(`You have too many of **${searchTerm}**, please go to [our website](https://robloxcaseopener.xyz) to view all of your items!`)
                  .setColor("RANDOM")
                  .setTimestamp()
                  .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})
                  )
                }
    


            }else{
                let itemLookup = p.inventory.filter(item => item.itemType.toLowerCase() === searchTerm)
                let itemsToDisplay = itemLookup.map(i => `${i.amount} x ${i.name} (${i.itemID}) ${i.locked === true ? `🔒` : ``}`).join(`\n`);
            if (!itemsToDisplay) return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`You don't own any items of this type!`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
            let display = stripIndents`amount | name | itemID
            __**${searchTerm}**__

            ${itemsToDisplay}`;


            if (display.length <= 2000) {
              return msg.say(new MessageEmbed()
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                    .setDescription(display)
                    .setColor("RANDOM")
                    .setTimestamp()
                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))).catch(err => { })
            } else {
                return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`You have too many of **${searchTerm}**, please go to [our website](https://robloxcaseopener.xyz) to view all of your items!`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))).catch(err => console.log(err))
            }

        }

    }

    }
}
