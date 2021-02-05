const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")

const moment = require("moment")
require("moment-duration-format")

module.exports = class swap extends Command { 
    constructor(client){
        super(client, {
            name: "swap", 
            description: "Swap a random unlocked item for another user's random unlocked item", 
            group: "main", 
            memberName: "swap", 
            args: [{
                type: "user", 
                prompt: "Who do you want to swap with?", 
                key: "user"
            }]
        })
    }

    async run(msg, {user}){

        const VIP = async (userID) => {
            let res = await require("superagent").get(`${process.env.CLIENT_IP}:${process.env.CLIENT_PORT}/members/${userID}/vip`).catch((err) => console.log(err));
            if(!res) return;
            if(res.status !== 200) return;
            if(res.body.status !== true) return;
            return res.body.tier;
        }

        let isVip = await VIP(user.id)

        if(isVip > 0)  return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`This user is a VIP member can not be robbed`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))


        if(user.id === msg.author.id)   return msg.say(new MessageEmbed()
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


            if(P.rebirthLevel < 55)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You need to be at least rebirth level 55 to use this command`)
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

        if(P.swap != moment().format('L')){
            P.swap = moment().format('L')


        
            const PitemsList = P.inventory.filter(i => i.locked === false)
            if(PitemsList.length < 1)   return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`You have nothing to swap`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

            const UPitemsList = UP.inventory.filter(i => i.locked === false)
            if(UPitemsList.length < 1)  return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`This user has nothing to swap`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

            let randomPItem = PitemsList[Math.floor(Math.random() * PitemsList.length)]
            let randomUPItem = UPitemsList[Math.floor(Math.random() * UPitemsList.length)]

            P.inventory.push(randomUPItem)
            P.inventory = P.inventory.filter(i => i.name !== randomPItem.name)

            UP.inventory.push(randomPItem)
            UP.inventory = UP.inventory.filter(i => i.name !== randomUPItem.name)

            P.save().catch(err => console.log(err))
            UP.save().catch(err => console.log(err))

            msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setTitle(`__Items Swapped With **${user.tag}**__`)
            .setDescription(`You took: ${randomUPItem.amount} x ${randomUPItem.name} (${randomUPItem.itemID})\n You gave: ${randomPItem.amount} x ${randomPItem.name} (${randomPItem.itemID}) `)
            .setColor("GREEN")
            .setTimestamp()
            .setFooter(user.username, user.displayAvatarURL({dynamic: true}))).catch(err => console.log(err))

        }else{
            msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setTitle(`__**You can only use the swap command once every 24 hours!**__`)
            .setColor("GREEN")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))  
        }
        
    }


}