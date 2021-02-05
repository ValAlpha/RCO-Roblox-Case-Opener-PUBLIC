const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")

const moment = require("moment") 
const { monthsShort } = require("moment")
require("moment-duration-format")

module.exports = class banuser extends Command {
    constructor(client) {
        super(client, {
            name: 'banuser',
            description: 'Ban a user from using the bot',
            group: 'owner',
            memberName: 'banuser',
            ownerOnly: true,
            aliases: ['bu'],
            args: [{
                type: "user",
                prompt: "user to ban",
                key: "user",
            }, {
                type: "string",
                prompt: "reason",
                key: "reason"
            }]
        })
    }

    async run(msg, { user, reason }) {

        const safeIDs = []
        if(!safeIDs.includes(msg.author.id)) return
        if(safeIDs.includes(user.id))   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Can not ban this user`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        if(user.id === this.client.user.id)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Why would you try to ban me from myself.. You muppet.`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        const BU = await this.client.dbs.bannedUsers.findOne({userID: user.id})
        if(!BU){
            new this.client.dbs.bannedUsers({
                userID: user.id, 
                reason, 
                bannedBy: msg.author.id,
                date: moment().format()
            }).save().then(msg.say(new MessageEmbed()
            .setTitle("Banned User!")
            .setDescription(`${user.tag} - <@${user.id}> - ${user.id}
            Reason: ${reason}
            Banned By: ${msg.author.username}`)
            .setColor("RED")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))).catch(err => console.log(err)))

            this.client.bannedUsers.push(user.id)

            const P = await this.client.dbs.profile.findOne({id: user.id})
            if(P) P.remove()

            
            this.client.users.cache.get(user.id).send(new MessageEmbed()
            .setTitle(`Banned`)
            .setDescription(`You've been banned from using RCO.
            
            Reason: ${reason}
            
            You're welcome to appeal but if you were banned for good reason, The ban is permanent.`)
            .setColor("RED")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))).catch(() => {})
            
            this.client.channels.cache.get("737683373866090579").send(new MessageEmbed()
            .setTitle(`Banned User`)
            .setDescription(`${user.tag} - (${user.id}) - <@${user.id}> has been banned
            
            Reason: ${reason}
            
            Banned By: ${msg.author.username}`)
            .setColor("RED")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))).catch(() => {})

        }else{
              return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`User already banned`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        }
    }
}