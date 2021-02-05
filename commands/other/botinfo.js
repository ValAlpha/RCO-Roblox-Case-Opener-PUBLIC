
const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")
const { stripIndents } = require("common-tags")

const moment = require("moment")
require("moment-duration-format")

const Profiles = require("../../models/profile")




module.exports = class botinfo extends Command {
    constructor(client) {
        super(client, {
            name: 'botinfo',
            description: 'View bot info and stats',
            group: 'other',
            memberName: 'botinfo',
            aliases: ['bi']
        })
    }

    async run(msg) {




        const CPU = require('cpu-stat')

        let pl = { "win32": "Windows", "linux": "Linux", "darwin": "Darwin", "undefined": "Unknown" }





        const duration = moment.duration(this.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

        msg.say(new MessageEmbed()
            .setAuthor(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))
            .setDescription(stripIndents`Created by <@OWNER_ID>
            Built using **Discord.js** & **Discord.js-commando**
            
            **__System Info__**
            **CPU: **${CPU.totalCores()} Cores ${CPU.avgClockMHz()}MHz
            **Memory Used: **${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
            **Operating System: **${pl[process.platform]}
            **Uptime** ${duration}
            **Bot Created On** ${moment(this.client.user.createdAt).format(`MMMM Do YYYY, h:mm:ss a`)} (**${moment(this.client.user.createdAt, "MMMM Do YYYY, h:mm:ss a").fromNow()}**)

            [Support Server](${this.client.options.invite})
            [Add To Your Server](https://discord.com/api/oauth2/authorize?client_id=688542620040953913&permissions=912448&scope=bot)

            **Default prefix**: \`${this.client.commandPrefix}\` or \`@${this.client.user.username}\`
            **Server count**: ${this.client.guilds.cache.size}`)
            .setThumbnail(this.client.user.displayAvatarURL({dynamic: true}))
            .setColor("#FF0000")
            .setTimestamp()
            .setFooter('Have a great day!')).catch(err => { })

    }
}
