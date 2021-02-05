const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")

module.exports = class equip extends Command { 
    constructor(client){
        super(client, {
            name: "equip", 
            description: "Equip your pets",
            group: "pets", 
            memberName: "equip", 
            aliases: ["eq"], 
            args: [{
                type: "string", 
                prompt: "Which pet? `Pet ID`",
                key: "petID"
            }] 
        })
    }

    async run(msg, { petID }){

        const P = await this.client.dbs.profile.findOne({id: msg.author.id})
        if(!P || P.pets.length === 0)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You don't have any pets`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if(P.pets.filter(pet => pet.equipped).length === 2)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You already have 2 pets equipped`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        let oldPets = P.pets.filter(pet => pet.petID !== petID)
        
        let petToUpdate = P.pets.find(pet => pet.petID === petID)
        if(!petToUpdate)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Unable to find a pet with that ID`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if(petToUpdate.equipped === true)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`This pet is already equipped`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        petToUpdate.equipped = true

        P.pets = []

        P.pets.push(...oldPets)
        P.pets.push(petToUpdate)

        P.save().catch(err => console.log(err))

        msg.say(new MessageEmbed()
        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
        .setTitle(`Pet Equipped`)
        .setColor("GREEN")
        .setTimestamp()
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
    

    }

}