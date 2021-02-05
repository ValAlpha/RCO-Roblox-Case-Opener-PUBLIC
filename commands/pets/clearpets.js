const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")

module.exports = class clearpets extends Command { 
    constructor(client){
        super(client, {
            name: "clearpets", 
            description: "Remove all unlocked pets", 
            group: "pets", 
            memberName: "clearpets"
        })
    }

    async run(msg){

          let embed = new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))

        const P = await this.client.dbs.profile.findOne({id: msg.author.id})
        if(!P){
            embed.setDescription(`You do not have a profile`)
            return msg.say(embed).catch(err => console.log(err))
        }
        
        const Pets = P.pets
        if(Pets.length < 1){
            embed.setDescription(`You do not have pets to delete`)
            return msg.say(embed).catch(err => console.log(err))
        }

        const filteredPets = P.pets.filter(p => p.locked !== true)
        if(filteredPets.length < 1){
            embed.setDescription(`You do not have any unlocked pets to delete`)
            return msg.say(embed).catch(err => console.log(err))
        }

        P.pets = P.pets.filter(p => p.locked === true)
        P.save().catch(err => console.log(err))

        embed.setDescription(`Cleared all unlocked pets!`)
        msg.say(embed).catch(err => console.log(err))

    }

}