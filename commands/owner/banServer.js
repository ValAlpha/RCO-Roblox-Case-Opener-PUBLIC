const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")
const moment = require("moment")
require("moment-duration-format")

module.exports = class banserver extends Command {
    constructor(client) {
        super(client, {
            name: "banserver",
            description: "ban a server from using RCO",
            group: "owner",
            ownerOnly: true,
            memberName: "banserver",
            aliases: ["bs"],
            args: [{
                type: "string",
                prompt: "Which server?",
                key: "server"
            }, {
                type: "string",
                prompt: "Reason?",
                key: "reason"
            }]
        })
    }

    async run(msg, { server, reason }) {

        const BS = await this.client.dbs.bannedServers.findOne({ serverID: server })

        if (BS)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`This server is already banned`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))



        new this.client.dbs.bannedServers({
            serverID: server,
            reason,
            bannedBy: msg.author.username,
            date: moment().format()
        }).save().then(msg.say(new MessageEmbed()
            .setTitle(`Banned Server`)
            .setDescription(`Server: ${server} has been banned`)
            .setColor("RED")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))).catch(err => console.log(err))



        let guild = this.client.guilds.cache.get(server);
        if (guild) {
            const BU = await this.client.dbs.bannedUsers.findOne({ userID: this.client.guilds.cache.get(server).ownerID })

            if (!BU) {
                new this.client.dbs.bannedUsers({
                    userID: this.client.guilds.cache.get(server).ownerID,
                    reason,
                    bannedBy: msg.author.id,
                    date: moment().format()
                }).save().catch(err => console.log(err))
            }
        }

        this.client.bannedUsers.push(this.client.guilds.cache.get(server).ownerID)

        this.client.channels.cache.get("737683373866090579").send(new MessageEmbed()
            .setTitle(`Banned Server`)
            .setDescription(`${this.client.guilds.cache.get(server).name} (${this.client.guilds.cache.get(server).id}) was banned
        Owner: <@${this.client.guilds.cache.get(server).ownerID}>
        
        Reason: ${reason}
        
        Banned By ${msg.author.username}`)
            .setColor("RED")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))).catch(() => { })

        setTimeout(() => {
            this.client.guilds.cache.get(server).leave()
        }, 10000)

    }

}