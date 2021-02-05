const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")

const moment = require("moment")
const { monthsShort } = require("moment")
require("moment-duration-format")

module.exports = class rob extends Command { 
    constructor(client){
        super(client, {
            name: "rob", 
            description: "Rob a random unlocked item from another user",
            memberName: "rob", 
            group: "main",
            args: [{
                type: "user",
                prompt: "Who are you robbing?",
                key: "user"
            }]
        })
    }

    async run(msg, { user }){

        const VIP = async (userID) => {
            let res = await require("superagent").get(`${process.env.CLIENT_IP}:${process.env.CLIENT_PORT}/members/${userID}/vip`).catch((err) => console.log(err));
            if(!res) return;
            if(res.status !== 200) return;
            if(res.body.status !== true) return;
            return res.body.tier;
        }

    
        let isVip = await VIP(user.id)
        if(isVip > 1)  return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`This user is a VIP member can not be robbed`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if(user.id === msg.author.id)  return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Sure, Rob yourself.. Lets see how far you get!`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        if(user.bot)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You can't rob bots!`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        const P = await this.client.dbs.profile.findOne({id: msg.author.id})
        if(!P)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You don't have a profile yet`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if(P.rebirthLevel < 7)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You need to be at least rebirth level 7 to use this command`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        const UP = await this.client.dbs.profile.findOne({id: user.id})
        if(!UP)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`This user has nothing to rob`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if(P.rob != moment().format('L')){
            P.rob = moment().format('L')


            const itemsList = UP.inventory.filter(i => i.locked === false)
        
            let filteredlist = itemsList.filter(i => i.itemWorth <= 10000)


            if(itemsList.length < 1 || filteredlist.length < 1 )   return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`This user has nothing to rob!`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))


            let itemToRob = filteredlist[Math.floor(Math.random() * filteredlist.length)]

            let ownedItem = P.inventory.find(i => i.name === itemToRob.name) 

            

            if(ownedItem){

                ownedItem.amount += itemToRob.amount
                ownedItem.totalValue += itemToRob.totalValue

                UP.inventory = UP.inventory.filter(i => i.name !== itemToRob.name)

                msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`You robbed ${itemToRob.amount} x ${itemToRob.name} from <@${user.id}> and now have ${ownedItem.amount + itemToRob.amount}
                
                You can rob again in 24 hours`)
                .setColor("RED")
                .setThumbnail(`https://www.roblox.com/asset-thumbnail/image?assetId=${itemToRob.itemID}&width=420&height=420&format=png`)
                .setTimestamp()
                .setFooter(user.username, user.displayAvatarURL({dynamic: true}))).catch(err => console.log(err))

            }else{

                P.inventory.push(itemToRob)
                UP.inventory = UP.inventory.filter(i => i.name !== itemToRob.name)

                msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`You robbed ${itemToRob.amount} x ${itemToRob.name}(${itemToRob.itemID}) from <@${user.id}>
                
                You can rob again in 24 hours`)
                .setColor("GREEN")
                .setThumbnail(`https://www.roblox.com/asset-thumbnail/image?assetId=${itemToRob.itemID}&width=420&height=420&format=png`)
                .setTimestamp()
                .setFooter(user.username, user.displayAvatarURL({dynamic: true}))).catch(err => console.log(err))
            }
            
            UP.save().catch(err => console.log(err))
            P.save().catch(err => console.log(err))
            

        }else{
            msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setTitle(`You can't use the rob command yet`)
            .setColor("RED")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))).catch(err => console.log(err))
        }

    }

}