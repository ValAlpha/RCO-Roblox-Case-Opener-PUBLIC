const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")


module.exports = class vote extends Command {
    constructor(client) {
        super(client, {
            name: 'vote',
            description: 'Vote for me on discord.boats and gain 3k',
            group: 'other',
            memberName: 'vote',
        })
    }

    async run(msg) {
        
        const emoji = this.client.emojis.cache.get("696719071009570848")

        msg.say(new MessageEmbed()

            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Voting helps me and it will help you too! 
                        [Upvote](https://discord.boats/bot/688542620040953913) RCO and earn 3k ${emoji} \n\n• VIP 1 = 15k ${emoji}\n• VIP 2 = 30k ${emoji}`)
            .setColor("PURPLE")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

    }
}
