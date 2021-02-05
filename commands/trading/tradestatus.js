const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")


module.exports = class tradestatus extends Command {
    constructor(client) {
        super(client, {
            name: 'tradestatus',
            description: 'Check the status of your trade',
            group: 'trading',
            memberName: 'tradestatus',
            aliases: ["ts"],
        })
    }

    async run(msg) {

        const P = await this.client.dbs.profile.findOne({ id: msg.author.id })

        if (!P || !P.isTrading)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You're not trading`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        let trade = await this.client.dbs.trades.findOne({ traders: msg.author.id })

        let personOne = trade.traders[0]
        let personTwo = trade.traders[1]

        let personOneProfile = await this.client.dbs.profile.findOne({ id: personOne })

        let personTwoProfile = await this.client.dbs.profile.findOne({ id: personTwo })

        let personOneOffers = personOneProfile.tempStorage.map(i => `${i.amount} x ${i.name} (${i.itemID})`).join(`\n`)

        let personTwoOffers = personTwoProfile.tempStorage.map(i => `${i.amount} x ${i.name} (${i.itemID})`).join(`\n`)

        msg.say(new MessageEmbed()
            .setDescription(`**YOUR TRADE STATUS**
        
        <@${personOne}> is offering:
        ${personOneOffers || `nothing`}
        
        <@${personTwo}> is offering:
        ${personTwoOffers || `nothing`}`))



    }
}