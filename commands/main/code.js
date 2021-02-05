const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")


module.exports = class code extends Command {
    constructor(client) {
        super(client, {
            name: 'code',
            description: 'Claim a code for a reward!',
            group: 'main',
            memberName: 'code',
            args: [{
                type: "string",
                prompt: "What's the code?",
                key: "answer"
            }]
        })
    }

    async run(msg, { answer }) {

        const P = await this.client.dbs.profile.findOne({ id: msg.author.id })
        if (!P)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You need to go open some cases first!`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        const C = await this.client.dbs.codes.findOne({ dbID: this.client.user.id })

        const moneyEmoji = this.client.emojis.cache.get("696719071009570848")

        if (!C)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`There's no codes to claim!`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        const codeToClaim = C.codes.find(c => c.code === answer)
        if (!codeToClaim)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Invalid/Expired code! 😇`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if (codeToClaim.claimed.includes(msg.author.id))   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You've already claimed this code!`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if (codeToClaim.type === "money") {
            P.balance += codeToClaim.reward
            codeToClaim.claimed.push(msg.author.id)

            msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`__**Money Code Claimed**__
            
            Code: ${answer}
            Money earned: ${codeToClaim.reward}`)
                .setColor("GREEN")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

            P.save().catch(err => console.log(err))
            C.save().catch(err => console.log(err))

        } else if (codeToClaim.type === "item") {
            let img = `https://www.roblox.com/asset-thumbnail/image?assetId=${codeToClaim.item.itemID}&width=420&height=420&format=png`

            let existsInInventory = P.inventory.find(i => i.itemID === codeToClaim.item.itemID)

            if (existsInInventory) {
                existsInInventory.amount += codeToClaim.item.amount
                existsInInventory.totalValue += codeToClaim.item.amount * codeToClaim.item.itemWorth

                P.value += codeToClaim.item.itemWorth * codeToClaim.item.amount

                codeToClaim.claimed.push(msg.author.id)


                C.save().catch(err => console.log(err))
                P.save().catch(err => console.log(err))

                msg.say(new MessageEmbed()
                    .setDescription(`__**Code Claimed!**__
                    
                    Item: ${codeToClaim.item.name}
                    Item ID: ${codeToClaim.item.itemID}
                    Amount: ${codeToClaim.item.amount}

                    Value: ${codeToClaim.item.itemWorth}${this.client.emojis.cache.get("696719071009570848")}
                    
                    Limited: ${codeToClaim.item.limited ? "Yes" : "No"}`)
                    .setThumbnail(img))

            } else if (!existsInInventory) {
                let img = `https://www.roblox.com/asset-thumbnail/image?assetId=${codeToClaim.item.itemID}&width=420&height=420&format=png`

                codeToClaim.claimed.push(msg.author.id)

                C.save().catch(err => console.log(err))
                P.inventory.push(codeToClaim.item)
                P.value += codeToClaim.item.itemWorth
                P.save().catch(err => console.log(err))


                msg.say(new MessageEmbed()
                    .setDescription(`__**Code Claimed!**__
                    
                    Item: ${codeToClaim.item.name}
                    Item ID: ${codeToClaim.item.itemID}
                    Amount: ${codeToClaim.item.amount}

                    Value: ${codeToClaim.item.itemWorth}${this.client.emojis.cache.get("696719071009570848")}
                    
                    Limited: ${codeToClaim.item.limited ? "Yes" : "No"}`)
                    .setThumbnail(img))


            }

        }

    }
}
