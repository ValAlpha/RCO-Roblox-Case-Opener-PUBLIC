const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags")

module.exports = class achievements extends Command {
        constructor(client) {
            super(client, {
                name: "achievements",
                description: "View your achievements",
                group: "main",
                memberName: "achievements",
                aliases: ["ach"],
                args: [{
                    type: "string",
                    prompt: "Which category?",
                    key: "category",
                    oneOf: ["list", "all", "noob", "bronze", "silver", "gold", "epic"],
                    default: "list",
                }, ],
            });
        }

        async run(msg, { category }) {
                const P = await this.client.dbs.profile.findOne({ id: msg.author.id });
                if (!P)   return msg.say(new MessageEmbed()
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`You need to go open some cases first!`)
                    .setColor("RANDOM")
                    .setTimestamp()
                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

                const AC = await this.client.dbs.achievements.findOne({
                    dbID: this.client.user.id,
                });
                if (!AC) {
                    AC = await new this.client.dbs.achievements({ dbID: this.client.user.id }).save().catch(() => {})
                }
                const tickEmoji = this.client.emojis.cache.get("698540646033522698");
                const crossEmoji = this.client.emojis.cache.get("698540645962481714");

                if (category.toLowerCase() === "list") {
                    msg.say(
                        new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                        .setDescription(stripIndents `**__Achievement Categories!__**
                \`all\` - Achievments for all case  
                \`noob\` - Achievments for noob cases
                \`bronze\` - Achievments for bronze cases
                \`silver\` - Achievments for silver cases
                \`gold\` - Achievments for gold cases
                \`epic\` - Achievments for epic cases

                usage: \`${this.client.commandPrefix}achievements [category]\`
                `)
                        .setColor("RED")
                        .setTimestamp()
                        .setFooter(
                            this.client.user.username,
                            this.client.user.displayAvatarURL({dynamic: true})
                        )
                    );
                } else if (category.toLowerCase() === "all") {
                    msg.say(
                            new MessageEmbed()
                            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                            .setDescription(stripIndents

                                `**__${msg.author.username}'s Achievements!__**

            **Total opened cases: ${P.casesOpened}**

             Any 10 Cases: ${AC.allCases.tenCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}
           
           Any 50 Cases: ${AC.allCases.fiftyCases.completed.includes(msg.author.id)? `${tickEmoji}` : `${crossEmoji}`}

           Any 100 Cases: ${AC.allCases.oneHundredCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}
          
           Any 500 Cases: ${AC.allCases.fiveHundredCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}

           Any 1000 Cases: ${AC.allCases.oneThousandCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}

           Any 5000 Cases: ${AC.allCases.fiveThousandCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}
            
           Any 100000 Cases: ${AC.allCases.oneHundredThousandCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}`)
           
          .setColor("RED")
          .setTimestamp()
          .setFooter(
            this.client.user.username,
            this.client.user.displayAvatarURL({dynamic: true})
          ))}else if (category.toLowerCase() === "noob") {
          msg.say(
                  new MessageEmbed()
                  .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                  .setDescription(stripIndents
      
                      `**__${msg.author.username}'s Achievements!__**
      
      **Opened Noob Cases: ${P.noobOpened}**
      
      10 Noob Cases: ${AC.noob.tenCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}
      
      50 Noob Cases: ${AC.noob.fiftyCases.completed.includes(msg.author.id)? `${tickEmoji}` : `${crossEmoji}`}
      
      100 Noob Cases: ${AC.noob.oneHundredCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}
      
      500 Noob Cases: ${AC.noob.fiveHundredCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}
      
      1000 Noob Cases: ${AC.noob.oneThousandCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}
      
      5000 Noob Cases: ${AC.noob.fiveThousandCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}
      
      100000 Noob Cases: ${AC.noob.oneHundredThousandCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}`)
      
      .setColor("RED")
      .setTimestamp()
      .setFooter(
      this.client.user.username,
      this.client.user.displayAvatarURL({dynamic: true})
      ))}else if (category.toLowerCase() === "bronze") {
        msg.say(
                new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(stripIndents
    
                    `**__${msg.author.username}'s Achievements!__**
    
    **Opened Bronze Cases: ${P.bronzeOpened}**
    
    10 Bronze Cases: ${AC.bronze.tenCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}
    
    50 Bronze Cases: ${AC.bronze.fiftyCases.completed.includes(msg.author.id)? `${tickEmoji}` : `${crossEmoji}`}
    
    100 Bronze Cases: ${AC.bronze.oneHundredCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}
    
    500 Bronze Cases: ${AC.bronze.fiveHundredCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}
    
    1000 Bronze Cases: ${AC.bronze.oneThousandCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}
    
    5000 Bronze Cases: ${AC.bronze.fiveThousandCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}
    
    100000 Bronze Cases: ${AC.bronze.oneHundredThousandCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}`)
    
    .setColor("RED")
    .setTimestamp()
    .setFooter(
    this.client.user.username,
    this.client.user.displayAvatarURL({dynamic: true})
    ))}else if (category.toLowerCase() === "silver") {
      msg.say(
              new MessageEmbed()
              .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
              .setDescription(stripIndents
  
                  `**__${msg.author.username}'s Achievements!__**
  
  **Opened Silver Cases: ${P.silverOpened}**
  
  10 Silver Cases: ${AC.silver.tenCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}
  
  50 Silver Cases: ${AC.silver.fiftyCases.completed.includes(msg.author.id)? `${tickEmoji}` : `${crossEmoji}`}
  
  100 Silver Cases: ${AC.silver.oneHundredCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}
  
  500 Silver Cases: ${AC.silver.fiveHundredCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}
  
  1000 Silver Cases: ${AC.silver.oneThousandCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}
  
  5000 Silver Cases: ${AC.silver.fiveThousandCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}
  
  100000 Silver Cases: ${AC.silver.oneHundredThousandCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}`)
  
  .setColor("RED")
  .setTimestamp()
  .setFooter(
  this.client.user.username,
  this.client.user.displayAvatarURL({dynamic: true})
  ))}else if (category.toLowerCase() === "gold") {
    msg.say(
            new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(stripIndents

                `**__${msg.author.username}'s Achievements!__**

**Opened Gold Cases: ${P.goldOpened}**

10 Gold Cases: ${AC.gold.tenCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}

50 Gold Cases: ${AC.gold.fiftyCases.completed.includes(msg.author.id)? `${tickEmoji}` : `${crossEmoji}`}

100 Gold Cases: ${AC.gold.oneHundredCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}

500 Gold Cases: ${AC.gold.fiveHundredCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}

1000 Gold Cases: ${AC.gold.oneThousandCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}

5000 Gold Cases: ${AC.gold.fiveThousandCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}

100000 Gold Cases: ${AC.gold.oneHundredThousandCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}`)

.setColor("RED")
.setTimestamp()
.setFooter(
this.client.user.username,
this.client.user.displayAvatarURL({dynamic: true})
))}else if (category.toLowerCase() === "epic") {
    msg.say(
            new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(stripIndents

                `**__${msg.author.username}'s Achievements!__**

**Opened Epic Cases: ${P.epicOpened}**

10 Epic Cases: ${AC.epic.tenCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}

50 Epic Cases: ${AC.epic.fiftyCases.completed.includes(msg.author.id)? `${tickEmoji}` : `${crossEmoji}`}

100 Epic Cases: ${AC.epic.oneHundredCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}

500 Epic Cases: ${AC.epic.fiveHundredCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}

1000 Epic Cases: ${AC.epic.oneThousandCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}

5000 Epic Cases: ${AC.epic.fiveThousandCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}

100000 Epic Cases: ${AC.epic.oneHundredThousandCases.completed.includes(msg.author.id) ? `${tickEmoji}` : `${crossEmoji}`}`)

.setColor("RED")
.setTimestamp()
.setFooter(
this.client.user.username,
this.client.user.displayAvatarURL({dynamic: true})
))}
  }
};