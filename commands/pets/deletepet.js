const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")

module.exports = class deletepet extends Command { 
    constructor(client){
        super(client, {
            name: "deletepet",
            description: "Delete a pet from your inventory", 
            group: "pets", 
            memberName: "deletepet", 
            aliases: ["dp"],
            args: [{
                type: "string", 
                prompt: "Which pet? PetID", 
                key: "petID"
            }]
        })
    }

    async run(msg, {petID}){

        const P = await this.client.dbs.profile.findOne({id: msg.author.id})
        if(!P || P.pets.length === 0)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You don't have any pets!`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        let ownsPet = P.pets.find(pet => pet.petID === petID)
        if(!ownsPet)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You don't own a pet with this ID`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if(ownsPet.locked === true){
            return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`This pet is locked`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        }

        let newPets = P.pets.filter(pet => pet.petID !== petID)
        P.pets = (newPets)

        P.save().catch(err => console.log(err))

        msg.say(new MessageEmbed()
        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
        .setTitle(`Pet Deleted`)
        .setColor("RED")
        .setTimestamp()
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
    }

}
