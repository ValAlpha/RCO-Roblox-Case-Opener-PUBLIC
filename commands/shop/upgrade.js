const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")
const { stripIndents } = require("common-tags")

module.exports = class upgrade extends Command { 
    constructor(client){
        super(client, {
            name: "upgrade", 
            description: "Upgrade stats to give you a boost", 
            memberName: "upgrade", 
            group: "rebirth",
            args: [{
                type: "string", 
                prompt: "What are you upgrading? \`Inventory Size\`, \`Case Discount\` or \`multi case\`", 
                key: "upgrade", 
                default: "all", 
                oneOf: ["inventory size", "case discount", "multi case"]
            }]
        })
    }

    async run(msg, {upgrade}){

        const P = await this.client.dbs.profile.findOne({id: msg.author.id})

        if(!P)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You need to ${this.client.commandPrefix}open some cases first!`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if(P.rebirthLevel < 1)  return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You need to rebirth at least once to view the upgrade options!`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if(upgrade.toLowerCase() === "all")  return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(stripIndents`Rebirth tokens (All upgrades cost rebirth tokens)

            Your rebirth level: **${P.rebirthLevel}**
            Your rebirth tokens: **${P.rebirthTokens}**

            __**Inventory Size**__ (Current: **${P.invSize}**)
            **Increase your inventory slots by 50**
            ${P.invSizeUpgradable === true ? `• Cost: ${P.invSizeCost}` : `You can only upgrade this once per rebirth`}

            __**Case Discount**__ (Current: **-${P.caseDiscount}%**)
            **-2% off case price**
            ${P.caseDiscountUpgradable === true ? `• Cost: ${P.caseDiscountCost}` : `You can only upgrade this once per rebirth`}

            __**Multi Case**__ (${P.multiCaseUnlocked === false ? '**LOCKED**' : '**UNLOCKED**'})
            **The ability to use ${this.client.commandPrefix}open [max/1-10] to open multiple cases at once**
            • Cost: 20

            
            `)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if(upgrade.toLowerCase() === "inventory size"){

            if(P.invSize === 2000)  return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(stripIndents`Max inventory reached`)
                .setColor("RED")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

            if(P.invSizeUpgradable === false)  return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`You can only upgrade your inventory size once per rebirth`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

            let cost = P.invSizeCost
            if(cost > P.rebirthTokens)  return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(stripIndents`You need __**${cost - P.rebirthTokens}**__ more ${cost - P.rebirthTokens < 2 ? `token` : `tokens`} to upgrade your inventory size!
                You have __**${P.rebirthTokens}**__`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))


            P.invSize += 50
            P.rebirthTokens -= cost
            P.invSizeUpgradable = false
            P.invSizeCost++
            P.save().catch(err => console.log(err))

              return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(stripIndents`__**Inventory size +50**__
                Your inventory size is now __**${P.invSize}**__
                
                •Rebirth tokens: __**${P.rebirthTokens}**__`)
                .setColor("GREEN")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))


        }else if(upgrade.toLowerCase() === "case discount"){
            if(P.caseDiscount === 50) return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(stripIndents`Max discount reached`)
            .setColor("RED")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

            if(P.caseDiscountUpgradable === false)  return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`You can only upgrade your case discount once per rebirth`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

            let cost = P.caseDiscountCost
            if(cost > P.rebirthTokens) return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(stripIndents`You need __**${cost - P.rebirthTokens}**__ more ${cost - P.rebirthTokens < 2 ? `token` : `tokens`} to upgrade your inventory size!
            You have __**${P.rebirthTokens}**__`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

            P.caseDiscount += 2
            P.rebirthTokens-= cost
            P.caseDiscountUpgradable = false
            P.caseDiscountCost++
            P.save().catch(err => console.log(err))

              return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(stripIndents`__**Case Discount upgraded**__
                Your case discount is now -__**${P.caseDiscount}**__%
                
                •Rebirth tokens: __**${P.rebirthTokens}**__`)
                .setColor("GREEN")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        }if(upgrade.toLowerCase() === "multi case"){

            if(P.multiCaseUnlocked === true)  return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`You've already unlocked the multi case upgrade`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

            if(P.rebirthTokens < 20)   return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`The multi case upgrade costs __**20**__ rebirth tokens`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

            P.rebirthTokens -= 20
            P.multiCaseUnlocked = true

            P.save().catch(err => console.log(err))

              return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`Multi case upgrade unlocked! You can now use ${this.client.commandPrefix}open [max/1-10] to open multiple cases`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        }



    }

}