const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

module.exports = class restart extends Command {
  constructor(client) {
    super(client, {
      name: "restart",
      description: "Restart PM2 process",
      group: "owner",
      memberName: "restart",
      ownerOnly: true,
      aliases: ["rt"]
    });
  }

  async run(msg) {

    if(this.client.user.id !== "688542620040953913"){
        return msg.say(new MessageEmbed()
          .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
          .setDescription(`Can not restart this bot with this command.`)
          .setColor("RANDOM")
          .setTimestamp()
          .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
    }else{
      await msg.say({embed: {title: `⏱ Restarting, one moment`, color: 0xFF000, author: {name: msg.author.tag, icon_url: msg.author.displayAvatarURL({dynamic: true})}}}).catch(() => {});
          setTimeout(() => {
            require(`child_process`).exec("pm2 restart 0")
            return undefined;
          }, 4000)
    }

  }
};
