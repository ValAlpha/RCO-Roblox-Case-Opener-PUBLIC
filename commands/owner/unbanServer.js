const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")

module.exports = class unbanserver extends Command {
    constructor(client){
        super(client, {
            name: "unbanserver", 
            description: "Unabn a banned server allowing them to invite RCO again", 
            group: "owner", 
            ownerOnly: true,
            memberName: "unbanserver", 
            aliases: ["ubs"], 
            args: [{
                type: "string", 
                prompt: "Server ID to unban", 
                key: "server"
            }]
        })
    }


    async run(msg, {server}){

        const BS = await this.client.dbs.bannedServers.findOne({serverID: server})

        if(!BS)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Not a banned server`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        BS.remove()

        this.client.bannedServers.forEach((server, index) => {
            this.client.bannedServers.splice(index, 0, "")
        })

           msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Server unbanned`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        this.client.channels.cache.get("737683373866090579").send(new MessageEmbed()
        .setTitle(`Unbanned Server`)
        .setDescription(`${server} was unbanned
        
        Unbanned By ${msg.author.username}`)
        .setColor("GREEN")
        .setTimestamp()
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))).catch(() => {})
        
    }

}