    const { Command } = require("discord.js-commando")
    const { MessegeEmbed, MessageEmbed } = require("discord.js")
    const { stripIndents } = require("common-tags")
    const { abbreviateNumber } = require("js-abbreviation-number")

    module.exports = class cases extends Command {
        constructor(client){
            super(client, {
                name: "cases",
                description: "View the cases you can open", 
                group: "main", 
                memberName: "cases"
            })
        }


        async run(msg){

            const BS = await this.client.dbs.botsettings.findOne({ownerID: DB_ID})


            if(!BS){
                msg.say(new MessageEmbed()
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`I'm unable to show you case info at the moment!`)
                    .setColor("RANDOM")
                    .setTimestamp()
                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
                this.client.channels.cache.get("709132280370823239").send("Unable to retrieve bot settings collection")
            }

            const P = await this.client.dbs.profile.findOne({id: msg.author.id})
            if(!P)  return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`You need to \`${this.client.commandPrefix}open\` some cases first!`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

            let cases = {
                noob: this.client.emojis.cache.get("765075616445104148"),
                copper: this.client.emojis.cache.get("765075616461619220"),
                bronze: this.client.emojis.cache.get("765075616055164949"),
                iron: this.client.emojis.cache.get("765075616181256193"),
                silver: this.client.emojis.cache.get("765075616281788427"),
                gold: this.client.emojis.cache.get("765075616252035093"),
                diamond: this.client.emojis.cache.get("765075615912034325"),
                ruby: this.client.emojis.cache.get("765075616198295562"),
                emerald: this.client.emojis.cache.get("765075615770345486"),
                amethyst: this.client.emojis.cache.get("765075616193314856"),
            }

          const getPrice = ((caseCost, discount) => {
            let sum = (discount / 100) * caseCost
            let res = Math.floor(caseCost - sum)
            return res
          })

            msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setTitle(`Case info`)
            .setDescription(`
            ${cases.noob} __NOOB__
            • Price: ${abbreviateNumber(BS.cases.noob.price, 1)}
            ${P.caseDiscount > 0 ? `- Your price: ${abbreviateNumber(getPrice(BS.cases.noob.price, P.caseDiscount), 3)}\n` : ``} 
            ${cases.copper} __COPPER__
            • Price: ${abbreviateNumber(BS.cases.copper.price, 1)}
            ${P.caseDiscount > 0 ? `- Your price: ${abbreviateNumber(getPrice(BS.cases.copper.price, P.caseDiscount), 3)}\n` : ``} 
            ${cases.bronze} __BRONZE__
            • Price: ${abbreviateNumber(BS.cases.bronze.price, 1)}
            ${P.caseDiscount > 0 ? `- Your price: ${abbreviateNumber(getPrice(BS.cases.bronze.price, P.caseDiscount), 3)}\n` : ``} 
            ${cases.iron} __IRON__
            • Price: ${abbreviateNumber(BS.cases.iron.price, 1)}
            ${P.caseDiscount > 0 ? `- Your price: ${abbreviateNumber(getPrice(BS.cases.iron.price, P.caseDiscount), 3)}\n` : ``} 
            ${cases.silver} __SILVER__
            • Price: ${abbreviateNumber(BS.cases.silver.price, 1)}
            ${P.caseDiscount > 0 ? `- Your price: ${abbreviateNumber(getPrice(BS.cases.silver.price, P.caseDiscount), 3)}\n` : ``} 
            ${cases.gold} __GOLD__
            • Price: ${abbreviateNumber(BS.cases.gold.price, 1)}
            ${P.caseDiscount > 0 ? `- Your price: ${abbreviateNumber(getPrice(BS.cases.gold.price, P.caseDiscount), 3)}\n` : ``} 
            ${cases.diamond} __DIAMOND__
            • Price: ${abbreviateNumber(BS.cases.diamond.price, 1)}
            ${P.caseDiscount > 0 ? `- Your price: ${abbreviateNumber(getPrice(BS.cases.diamond.price, P.caseDiscount), 3)}\n` : ``} 
            ${cases.ruby} __RUBY__
            • Price: ${abbreviateNumber(BS.cases.ruby.price, 1)}
            ${P.caseDiscount > 0 ? `- Your price: ${abbreviateNumber(getPrice(BS.cases.ruby.price, P.caseDiscount), 3)}\n` : ``} 
            ${cases.emerald} __EMERALD__
            • Price: ${abbreviateNumber(BS.cases.emerald.price, 1)}
            ${P.caseDiscount > 0 ? `- Your price: ${abbreviateNumber(getPrice(BS.cases.emerald.price, P.caseDiscount), 3)}\n` : ``} 
            ${cases.amethyst} __AMETHYST__
            • Price: ${abbreviateNumber(BS.cases.amethyst.price, 1)}
            ${P.caseDiscount > 0 ? `- Your price: ${abbreviateNumber(getPrice(BS.cases.amethyst.price, P.caseDiscount), 3)}\n` : ``}`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))


        }

    }