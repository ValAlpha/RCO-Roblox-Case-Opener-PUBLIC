const { Command } = require("discord.js-commando"), { RichDisplay } = require("great-commando"),
    Discord = require("discord.js");
const { stripIndents } = require("common-tags")
const { MessageEmbed } = require("discord.js")


module.exports = class help extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            description: 'Help on how to use the bot',
            group: 'help',
            memberName: 'help',
            clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
            args: [{
                type: "string",
                prompt: "-",
                key: "catagory",
                default: "help",
            }]
        })
    }

    async run(msg, { catagory }) {

        const moneyEmoji = this.client.emojis.cache.get("696719071009570848")
        let cat = catagory.toLowerCase()
        let prefix = this.client.commandPrefix


        let defaultEmbed = async () => {
            let color = msg.guild ? msg.guild.me.displayHexColor === "#000000" ? 0xFFBF00 : msg.guild.me.displayColor : 0xFFBF00

            const groups = this.client.registry.groups;

            let e = new Discord.MessageEmbed().setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ dynamic: true })).setColor(color)
            let display = new RichDisplay(e)
            groups.forEach(g => {
                if (["owner", "commands"].includes(g.id) && !this.client.isOwner(msg.author.id)) return null;
                let commands = g.commands.filter(cmd => !["eval"].includes(cmd.name)).map(c => `**${c.name}**${c.nsfw ? "(NSFW)" : ""} - ${c.description}`)
                if (g.commands.size !== 0) {
                    display.addPage(e => e.setDescription(commands.join('\n')).setTitle(`${g.name}`).addField(`\u200b`, ` - Use ${this.client.commandPrefix}help [command] for detailed command usage`))
                }
            });
            display.setFooterPrefix('Here are all of the commands you can use. Page: ')
            display.run(await msg.channel.send(`Loading...`), { filter: (reaction, user) => user.id === msg.author.id })
        }


        if (cat === "help") {
            defaultEmbed()
        } else {

            let cmd = this.client.registry.commands.find(c => c.name === cat || (c.aliases || []).includes(cat))
            if (!cmd) return defaultEmbed()

            let embed = new MessageEmbed()
                .setAuthor(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
                .setTitle(cmd.name)
                .setDescription(`\`\`\`${cmd.description}\`\`\``)
                .setColor("RANDOM")
                .setTimestamp()

            if (cmd.name === "inventory") {

                let options = ['hat (1)', 'face (2)', 'gear (3)', 'package (4)', 'hair accessory (5)', 'face accessory (6)', 'neck accessory (7)', 'shoulder accessory (8)', 'front accessory (9)', 'back accessory (10)', 'waist accessory (11)', "limiteds (12)", 'pets (13)',]

                embed.description = `\`\`\`View your inventory\`\`\``
                embed.addField(`Prompt (1)`, `Which category?`)
                embed.addField(`\u200b`, `${options.map(i => `•${i}`).join(`\n`)}`)
                return msg.say(embed)
            }

            if (cmd.argsCollector === null) {
                return msg.say(embed).catch(err => console.log(err))
            }

            let args = cmd.argsCollector.args

            if ((cmd.argsCollector ? args : [] || []).length !== 0) {
                args.forEach((arg, index) => {
                    embed.addField(`Prompt(${index + 1})`, `${args[index].prompt}\n${args[index].oneOf ? `${args[index].oneOf.map(i => `• ${i}`).join(`\n`)}` : ``} ${args[index].min ? `Min: ${args[index].min}` : ``}\n${args[index].max ? `Max: ${args[index].max}` : ``} ${args[0].type.id === "user" ? `@user` : ``}`)
                })
            }

            msg.say(embed)
        }

    }
}
