const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")

module.exports = class unbanuser extends Command {
    constructor(client){
        super(client, {
            name: "unbanuser", 
            description: "Unban a user allowing them to use RCO", 
            group: "owner", 
            ownerOnly: true, 
            memberName: "unbanuser", 
            aliases: ["ubu"], 
            args: [{
                type: "string", 
                prompt: "Which user?",
                key: "user"
            }] 
        })
    }

    async run(msg, {user}){

        const BU = await this.client.dbs.bannedUsers.findOne({userID: user})
        
        if(!BU)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`This user isn't banned`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        BU.remove()
        this.client.bannedUsers = this.client.bannedUsers.filter(user => user !== user)
          msg.say(new MessageEmbed()
           .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
           .setDescription(`This user has been unbanned!`)
           .setColor("RANDOM")
           .setTimestamp()
           .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        this.client.channels.cache.get("737683373866090579").send(new MessageEmbed()
            .setTitle(`Unabnned User`)
            .setDescription(`<@${user}> - ${user}
            
            Unbanned By: ${msg.author.username}`)
            .setColor("GREEN")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
    }
}