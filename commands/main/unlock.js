const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")


module.exports = class unlock extends Command {
    constructor(client) {
        super(client, {
            name: 'unlock',
            description: "Unlock a locked item allowing you to sell it. If you're a VIP user you can use c!unlock [all] to unlock all items",
            group: 'main',
            memberName: 'unlock',
            args: [{
                type: "string",
                prompt: "What's the item's ID?",
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
    
                    P.inventory.forEach(i => i.locked = false)
                    P.save().catch(err => console.log(err))
        
                      return msg.say(new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                        .setDescription(`All items have been unlocked!`)
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        
                }
            }

        let itemToUnlock = P.inventory.find(i => i.itemID === itemID)

        if (!itemToUnlock)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You don't own this item`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        if (itemToUnlock.locked === false)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`This item is already unlocked`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        itemToUnlock.locked = false

        P.save().catch(err => console.log(err))

          return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You unlocked ${itemToUnlock.name}(${itemToUnlock.itemID}) ${this.client.emojis.cache.get("753814265831358534")}`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

    }
}