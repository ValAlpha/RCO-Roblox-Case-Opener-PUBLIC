const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")


module.exports = class lock extends Command {
    constructor(client) {
        super(client, {
            name: 'lock',
            description: 'Lock an item to prevent accidental sell',
            group: 'main',
            memberName: 'lock',
            args: [{
                type: "string",
                prompt: "What's the item's ID? If you're a VIP user you can use c!lock [all] to lock all items",
                key: "itemID"
            }]
        })
    }

    async run(msg, { itemID }) {

        const P = await this.client.dbs.profile.findOne({ id: msg.author.id })

        if (!P)   return msg.say(new MessageEmbed()
        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
        .setDescription(`You don't have any items`)
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        let itemToLock = P.inventory.find(i => i.itemID === itemID.toLowerCase())

        const VIP = async (userID) => {
            let res = await require("superagent").get(`${process.env.CLIENT_IP}:${process.env.CLIENT_PORT}/members/${userID}/vip`).catch((err) => console.log(err));
            if(!res) return;
            if(res.status !== 200) return;
            if(res.body.status !== true) return;
            return res.body.tier;
        }

        let isVip = await VIP(msg.author.id)

        if(itemID.toLowerCase() === "all"){

            if(isVip === undefined || isVip === 0 || isVip === 1)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setTitle(`This is a VIP command!`)
            .setColor("RANDOM")
            .setTimestamp()
            .setURL(`https://www.patreon.com/RCO_Bot`)
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
            
            if(isVip !== undefined && isVip > 1){

                P.inventory.forEach(i => i.locked = true)
                P.save().catch(err => console.log(err))
    
                  return msg.say(new MessageEmbed()
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`All items have been locked!`)
                    .setColor("RANDOM")
                    .setTimestamp()
                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
    
            }
        }

        if(isVip !== undefined && isVip > 0 && itemID.toLowerCase() === "all"){

            P.inventory.forEach(i => i.locked = true)
            P.save().catch(err => console.log(err))

              return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`All items have been locked!`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        }

        if (!itemToLock)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You don't own this item`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if (itemToLock.locked === true)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`This item is already locked`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        itemToLock.locked = true

        P.save().catch(err => console.log(err))

          return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You locked ${itemToLock.name}(${itemToLock.itemID}) ${this.client.emojis.cache.get("753814265831358534")}`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

    }
}