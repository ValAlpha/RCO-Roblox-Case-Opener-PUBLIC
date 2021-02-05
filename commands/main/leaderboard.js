const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const {RichDisplay} = require("great-commando")
const table = require('markdown-table')
const { abbreviateNumber  } = require("js-abbreviation-number")

module.exports = class leaderboard extends Command {
    constructor(client) {
        super(client, {
            name: "leaderboard",
            description: "View the leaderboard",
            group: "main",
            memberName: "leaderboard",
            aliases: ["lb"]
        });
    }

    async run(msg) {

        let embed = new MessageEmbed()
        .setAuthor(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))
        .setColor("GREEN")
        .setTimestamp()
        .setFooter(`Requested by ${msg.author.tag}`, msg.author.displayAvatarURL({dynamic: true}))
        const P = await this.client.dbs.profile.find()
        if(!P || P.length === 0) return msg.say(embed.setDescription(`I was unable to find any user profiles?`));

        const menu = new RichDisplay(new MessageEmbed())

    //!=== Value === 

        let valueList = P.sort((a, b) => b.value - a.value)
        .slice(0, 10);
        let formattedValue = [['Rank', 'Player', 'Value']]
        valueList.forEach(i => {
            formattedValue.push([`#${valueList.indexOf(i) + 1}`, i.tag.slice(0, -5), abbreviateNumber(i.value, 1)])
        })

        let valueTable = table(formattedValue)

        menu.addPage(e => e.setDescription(`\`\`\`\n${valueTable}\n\`\`\``)
        .setTitle(`__**Value Leaderboard**__`)
        .setColor("RANDOM")
        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

    
    //!=== Money === 

        let moneyList = P.sort((a, b) => b.balance - a.balance)
        .slice(0, 10);
        let formattedMoney = [['Rank', 'Player', 'Balance']]
        moneyList.forEach(i => {
            formattedMoney.push([`#${moneyList.indexOf(i) + 1}`, i.tag.slice(0, -5), abbreviateNumber(i.balance, 1)])
        })

        let moneyTable = table(formattedMoney)

        menu.addPage(e => e.setDescription(`\`\`\`\n${moneyTable}\n\`\`\``)
        .setTitle(`__**Money Leaderboard**__`)
        .setColor("RANDOM")
        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))


    //!=== Cases === 

        let casesList = P.sort((a, b) => b.casesOpened - a.casesOpened)
        .slice(0, 10);
        let formattedCases = [['Rank', 'Player', 'Cases']]
        casesList.forEach(i => {
            formattedCases.push([`#${casesList.indexOf(i) + 1}`, i.tag.slice(0, -5), abbreviateNumber(i.casesOpened, 1)])
        })

        let casesTable = table(formattedCases)

        menu.addPage(e => e.setDescription(`\`\`\`\n${casesTable}\n\`\`\``)
        .setTitle(`__**Cases Leaderboard**__`)
        .setColor("RANDOM")
        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
   
   
    //!=== Rebirths === 

        let rebirthList = P.sort((a, b) => b.rebirthLevel - a.rebirthLevel)
        .slice(0, 10);
        let formattedRebirths = [['Rank', 'Player', 'Rebirths']]
        rebirthList.forEach(i => {
            formattedRebirths.push([`#${rebirthList.indexOf(i) + 1}`, i.tag.slice(0, -5), abbreviateNumber(i.rebirthLevel, 1)])
        })

        let rebirthsTable = table(formattedRebirths)

        menu.addPage(e => e.setDescription(`\`\`\`\n${rebirthsTable}\n\`\`\``)
        .setTitle(`__**Rebirths Leaderboard**__`)
        .setColor("RANDOM")
        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
  
        menu.run(msg, {filter: (r, user) => user.id === msg.author.id});
    }
};
