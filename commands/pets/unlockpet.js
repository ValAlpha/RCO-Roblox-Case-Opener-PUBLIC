const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")

module.exports = class unlockpet extends Command { 
    constructor(client){
        super(client, {
            name: "unlockpet", 
            description: "unlock a pet preventing you from deleting it", 
            memberName: "unlockpet", 
            group: "pets", 
            args: [{
                type: "string", 
                prompt: "Which pet? (ID)", 
                key: "petID"
            }]
        })
    }

    async run(msg, {petID}){

        let embed = new MessageEmbed()
        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))

        const P = await this.client.dbs.profile.findOne({id: msg.author.id})
        if(!P){
            embed.setDescription(`You don't have a profile`)
            return msg.say(embed).catch(err => console.log(err))
        }

        let Pets = P.pets
        if(P.pets.length < 1){
            embed.setDescription(`You don't have any pets`)
            return msg.say(embed).catch(err => console.log(err))
        }
        

        let petToUnlock = Pets.find(pet => pet.petID === petID)
        if(!petToUnlock){
            embed.setDescription(`You do not own a pet with this ID`)
            return msg.say(embed).catch(err => console.log(err))
        }

        if(petToUnlock.locked === false){
            embed.setDescription(`This pet is already unlocked`)
            return msg.say(embed).catch(err => console.log(err))
        }

        let updatedPet = petToUnlock
        updatedPet.locked = false
        let filteredPets = Pets.filter(p => p.petID !== petID)
        P.pets = filteredPets
        P.pets.push(updatedPet)
       
        P.save().catch(err => console.log(err)) 
        
        embed.setTitle(`Pet unlocked! ${this.client.emojis.cache.get("753814265831358534")}`)
        embed.setThumbnail(petToUnlock.imgLink)
        embed.setDescription(`Type: ${petToUnlock.type}
        Pet ID: ${petToUnlock.petID}`)
        
        return msg.say(embed).catch(err => console.log(err))

    }

}