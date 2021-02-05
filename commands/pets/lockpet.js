const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")

module.exports = class lockpet extends Command { 
    constructor(client){
        super(client, {
            name: "lockpet", 
            description: "lock a pet preventing you from deleting it", 
            memberName: "lockpet", 
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
        

        let petToLock = Pets.find(pet => pet.petID === petID)
        if(!petToLock){
            embed.setDescription(`You do not own a pet with this ID`)
            return msg.say(embed).catch(err => console.log(err))
        }

        if(petToLock.locked === true){
            embed.setDescription(`This pet is already locked`)
            return msg.say(embed).catch(err => console.log(err))
        }

        let updatedPet = petToLock
        updatedPet.locked = true
        let filteredPets = Pets.filter(p => p.petID !== petID)
        P.pets = filteredPets
        P.pets.push(updatedPet)
       
        P.save().catch(err => console.log(err)) 



        embed.setTitle(`Pet locked! ${this.client.emojis.cache.get("753814265831358534")}`)
        embed.setThumbnail(petToLock.imgLink)
        embed.setDescription(`Type: ${petToLock.type}
        Pet ID: ${petToLock.petID}`)

        return msg.say(embed).catch(err => console.log(err))

    }

}