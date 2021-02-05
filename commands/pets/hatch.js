const { command, Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")
const moment = require("moment")
const { monthsShort } = require("moment")
require("moment-duration-format")

const CRS = require("crypto-random-string")

module.exports = class hatch extends Command {
    constructor(client) {
        super(client, {
            name: "hatch",
            description: "hatch",
            group: "pets",
            memberName: "pets",
            throttling: {
                duration: 10,
                usages: 1
            }
        })
    }
    async run(msg) {

        const P = await this.client.dbs.profile.findOne({ id: msg.author.id })
        if (!P)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You need to open some case first!`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        
        let maxPetInv = 10
        let hatchCost = 10000   

        if (P.pets.length >= maxPetInv)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Your pet inventory is full, You need to delete some to make room for new ones!`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if (P.balance < hatchCost)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You don't have enough! You need ${hatchCost} coins to hatch pets`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        const getTierOnePet = require("../../functions/getItems/getTierOnePet")

        const { pet } = await getTierOnePet()

        let embedColours = {
            "GODLY": "PURPLE",
            "LEGENDARY": "RED",
            "RARE": "BLUE",
            "COMMON": "RED"
        }

        let emojiID = {
            "Bear": "736303581723885608",
            "Cat": "736303583427035258",
            "Chick": "736303580528771213",
            "Chicken": "736303581908697149",
            "Cow": "736303581992321186",
            "Dog": "736303582193778850",
            "Duck": "736303581606576218",
            "Elephant": "736303582227464232",
            "Giraffe": "736303582885969970",
            "Lion": "736303582243979275",
            "Panda": "736303582109761607",
            "Pig": "736303582852415568",
            "Rabbit": "736303582780850208",
            "Reindeer": "736303582755684433",
            "Squirrel": "736303582915199132"
        }

        let petID = CRS({length: 5})
        
        P.pets.push({
                     type: pet.name, 
                     amount: 1,
                     emojiID: emojiID[pet.name], 
                     rarity: [pet.stats.rarity],
                     equipped: false,
                     coinBoost: pet.stats.coinPercBoost,
                     petID,
                     imgLink: pet.link
                 })

        P.balance -= hatchCost
        P.save().catch(err => console.log(err))

        msg.say(new MessageEmbed()

            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setTitle(`You hatched: ${pet.name}`)
            .setColor(embedColours[pet.stats.rarity])
            .setThumbnail(pet.link)
            .setDescription(`Stats
     **${pet.stats.rarity}**
     
     Coin boost - ${pet.stats.coinPercBoost}%
     
     Pet ID: **${petID}**`)
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

    }
}

