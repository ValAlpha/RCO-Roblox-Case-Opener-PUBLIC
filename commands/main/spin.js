const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

const { abbreviateNumber } = require("js-abbreviation-number")

const getBonusItems = require("../../functions/getItems/bonus");

module.exports = class spin extends Command {
        constructor(client) {
            super(client, {
                name: "spin",
                description: "Use your bonus spins to spin the special chest where a limited item is guaranteed",
                group: "main",
                memberName: "spin",
            });
        }

        async run(msg) {
                const P = await this.client.dbs.profile.findOne({ id: msg.author.id });
                if (!P)
                      return msg.say(new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                        .setDescription(`You need to open some cases before you can do this`)
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

                if (P.spins === 0)
                    return msg.say(
                        `You don't have any bonus spins! Make sure to collect your daily!`
                    );

                const choices = ["money", "money", "money"]

                const choice = choices[Math.floor(Math.random() * choices.length)]

                if (choice === "money") {
                    msg.say(new MessageEmbed()

                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                        .setDescription(`You spun and won ${abbreviateNumber(1000, 0)}${this.client.emojis.cache.get("696719071009570848")}`)
                        .setColor("GREEN")
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

                    P.balance = (P.balance + 1000)
                    P.spins = Math.floor(P.spins - 1)
                    P.save().catch(err => console.log(err))


                } else if (choice === "item") {

                    const item = await getBonusItems();

                    if (!item)   return msg.say(new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                        .setDescription(`Bad luck! You got nothing from this spin!`)
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
                    P.spins = Math.floor(P.spins - 1);
                    let res = await require("superagent")
                        .get(
                            `https://catalog.roblox.com/v1/search/items/details?keyword=${encodeURIComponent(
                        item.data.Name
                    )}&limit=30`
                        )
                        .catch(() => null);
                    if (!res) return null;
                    if (res.status !== 200)   return msg.say(new MessageEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                        .setDescription(`Bad luck! You got nothing from this spin!`)
                        .setColor("RANDOM")
                        .setTimestamp()
                        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
                    let itemData = res.body.data;

                    if (itemData === null) {
                        msg.say(item.searchQuery)
                          return msg.say(new MessageEmbed()
                            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                            .setDescription(`Unlucky, You didn't find anything!`)
                            .setColor("RANDOM")
                            .setTimestamp()
                            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
                    }

                    let itemToShow = itemData.find(i => i.name.toLowerCase() === item.data.Name.toLowerCase());


                    if (!itemToShow) {
                        this.client.channels.cache.get("703176851467796582").send(`${item.data.Name} (${item.data.AssetId}) needs to be removed from the bonus case list`)
                          return msg.say(new MessageEmbed()
                            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                            .setDescription(`Unlucky, You didn't find anything!`)
                            .setColor("RANDOM")
                            .setTimestamp()
                            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

                    }

                    let existsInInv = P.inventory.find(
                        (i) => i.itemID === itemToShow.id.toString()
                    );

                    if (!existsInInv) {
                        P.inventory.push({
                            name: itemToShow.name,
                            itemID: itemToShow.id,
                            amount: 1,
                            itemWorth: itemToShow.lowestPrice || itemToShow.price,
                            totalValue: itemToShow.lowestPrice || itemToShow.price,
                            itemType: item.type,
                            limited: item.isLimited ? true : false,
                            locked: false,
                        });

                        P.value += itemToShow.lowestPrice || itemToShow.price;

                    } else {
                        existsInInv.amount++;
                        existsInInv.totalValue += itemToShow.lowestPrice || itemToShow.price;

                        P.value += itemToShow.lowestPrice || itemToShow.price;
                    }
                    P.save().catch(() => {});
                    msg
                        .say(
                            new MessageEmbed()
                            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                            .setDescription(
                                stripIndents `**bonus case!**\n
                    You got: ${itemToShow.name} (${itemToShow.id})

                    Value per item: ${itemToShow.lowestPrice || itemToShow.price}
                    Type: ${item.type}
                    ${item.isLimited ? `✨Limited✨` : ``}
                    [item link](https://www.roblox.com/catalog/${itemToShow.id})`
                        )
                        .setColor("RANDOM")
                        .setThumbnail(item.img)
                        .setTimestamp()
                        .setFooter(
                            this.client.user.username,
                            this.client.user.displayAvatarURL({dynamic: true})
                        )
                )
                .catch(() => { });
        }

    }
};
