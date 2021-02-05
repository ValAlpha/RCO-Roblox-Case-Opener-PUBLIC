  
const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")


module.exports = class setdefaultcase extends Command {
    constructor(client) {
        super(client, {
            name: 'setdefaultcase',
            description: 'Set default case to open: [`noob`, `copper`, `bronze`, `iron`, `silver`, `gold`, `diamond`, `ruby`, `emerald`, `amethyst`]',
            group: 'main',
            memberName: 'setdefaultcase',
            aliases: ['sdc'],
            args: [{
                type: "string",
                prompt: "Which case? [`noob`, `copper`, `bronze`, `iron`, `silver`, `gold`, `diamond`, `ruby`, `emerald`, `amethyst`]",
                key: 'crate',
                oneOf: ["noob", "copper", "bronze", "iron", "silver", "gold", "diamond", "ruby", "emerald", "amethyst"]
            }]
        })
    }

    async run(msg, { crate }) {

        const p = await this.client.dbs.profile.findOne({id: msg.author.id})

        if (!p)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Go open some crate! \`${this.client.commandPrefix}open\``)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

            let cases = {
                noob: "https://cdn.discordapp.com/attachments/735766112557596702/764880995257679932/noob.png",
                copper: "https://cdn.discordapp.com/attachments/735766112557596702/764880993462779904/copper.png",
                bronze: "https://cdn.discordapp.com/attachments/735766112557596702/764880992158482442/bronze.png",
                iron: "https://cdn.discordapp.com/attachments/735766112557596702/764880990669242419/iron.png",
                silver: "https://cdn.discordapp.com/attachments/735766112557596702/764880989293641728/silver.png",
                gold: "https://cdn.discordapp.com/attachments/735766112557596702/764880987913846814/gold.png",
                diamond: "https://cdn.discordapp.com/attachments/735766112557596702/764880986679934986/diamond.png",
                ruby: "https://cdn.discordapp.com/attachments/735766112557596702/764880985354403900/ruby.png",
                emerald: "https://cdn.discordapp.com/attachments/735766112557596702/764880984079859773/emerald.png",
                amethyst: "https://cdn.discordapp.com/attachments/735766112557596702/764880982872031242/amethyst.png"
            }
          

        let colours = require("../../utils/colours").caseHex

        

        if (crate.toLowerCase() === p.defaultCrate) return msg.say(new MessageEmbed()
        .setTitle(`Default case already set to **${crate.toLowerCase()}**`)
        .setColor(colours[crate.toLowerCase()]))

        p.defaultCrate = crate.toLowerCase()

        p.save().catch(err => console.log(err))

       
            msg.say(new MessageEmbed()
            .setTitle(`Default case set to **${crate.toLowerCase()}**`)
            .setThumbnail(cases[crate.toLowerCase()])
            .setColor(colours[crate.toLowerCase()]))


    }
}
