const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

const moment = require("moment");
require("moment-duration-format");

const mongoose = require("mongoose");

module.exports = class daily extends Command {
  constructor(client) {
    super(client, {
      name: "daily",
      description: "Claim a daily money bonus",
      group: "main",
      memberName: "daily",
    });
  }

  async run(msg) {
    const P = await this.client.dbs.profile.findOne({ id: msg.author.id });
    if (!P)   return msg.say(new MessageEmbed()
        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
        .setDescription(`You can't claim your bonus yet`)
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

    const moneyEmoji = this.client.emojis.cache.get("696719071009570848");

    if (P.daily != moment().format("L")) {
      let ranSpins = Math.floor(Math.random() * 2) + 1;

      P.daily = moment().format("L");
      P.spins += ranSpins;
      P.balance += 1000;
      P.save().catch(() => {});

      msg.say(
        new MessageEmbed()
          .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
          .setDescription(
            stripIndents`__**You claimed your daily bonus!**__
        
        You gained 1000${moneyEmoji} and ${ranSpins} bonus case spins!`
          )
          .setColor("#FF000")
          .setTimestamp()
          .setFooter(
            this.client.user.username,
            this.client.user.displayAvatarURL({dynamic: true})
          )
      );
    } else {
      msg.say(
        new MessageEmbed()
          .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
          .setDescription(
            stripIndents`Your daily bonus is ready **${moment()
              .endOf("day")
              .fromNow()}**`
          )
          .setColor("#FF000")
          .setTimestamp()
          .setFooter(
            this.client.user.username,
            this.client.user.displayAvatarURL({dynamic: true})
          )
      );
    }
  }
};
