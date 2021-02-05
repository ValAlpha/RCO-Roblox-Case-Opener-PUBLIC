const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

const { abbreviateNumber } = require("js-abbreviation-number")

const { stripIndents } = require("common-tags");

module.exports = class profile extends Command {
  constructor(client) {
    super(client, {
      name: "profile",
      description: "View yours or someone else's inventory",
      group: "main",
      memberName: "profile",
      aliases: ["prof", "pro"],
      args: [
        {
          type: "user",
          prompt: "Who's profile? (Yours by default)",
          key: "user",
          default: (msg) => msg.author,
        },
      ],
    });
  }

  async run(msg, { user }) {
    if (user.bot)
      return msg.say(new MessageEmbed()
        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`Discord bots can't have profiles`)
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))
    const p = await this.client.dbs.profile.findOne({ id: user.id });

    if (!p && user === msg.author)
      return msg.say(new MessageEmbed()
        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`You need to open a crate to create your profile 🤭`)
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))
    if (!p && user !== msg.author)
      return msg.say(new MessageEmbed()
        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`This person hasn't opened any cases yet🤭`)
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true })))

    const betaEmoji = this.client.emojis.cache.get("702063612037955584");
    const moneyEmoji = this.client.emojis.cache.get("696719071009570848");
    const PE = this.client.emojis.cache.get("762102187651235870");

    const VIP = async (userID) => {
      let res = await require("superagent").get(`${process.env.CLIENT_IP}:${process.env.CLIENT_PORT}/members/${userID}/vip`).catch((err) => console.log(err));
      if(!res) return;
      if(res.status !== 200) return;
      if(res.body.status !== true) return;
      return res.body.tier;
  }

  let isVip = await VIP(msg.author.id)
  let vipEmoji = ``

  isVip > 0 ? vipEmoji = this.client.emojis.cache.get("767369283117514772") : ``


    const MOD = async (userID) => {
      let res = await require("superagent").get(`${process.env.CLIENT_IP}:${process.env.CLIENT_PORT}/members/${userID}/mod`).catch((err) => console.log(err));
      if(!res) return 0;
      if(res.status !== 200) return 0;
      if(res.body.status !== true) return 0;
      return res.body.mod;
  }

    let isMod = await MOD(user.id)


    let BT = await this.client.dbs.betatesters.findOne({
      dbID: this.client.user.id,
    });
    let betaTesters = BT.testers.map(c => c.userID) || [];


    //!================================================
    //! calculate owned items of each case
    let ownedItems = []
    let obtainedNoob = 0
    let obtainedCopper = 0
    let obtainedBronze = 0
    let obtainedIron = 0
    let obtainedSilver = 0
    let obtainedGold = 0
    let obtainedDiamond = 0
    let obtainedRuby = 0
    let obtainedEmerald = 0
    let obtainedAmethyst = 0
    // let obtainedSpooky = 0

    p.inventory.forEach(i => ownedItems.push(i.itemID))

    //?=======Noob Case=======
    const noobItems = require("../../functions/getItems/data/noob.json")

    let noobIDs = []
    noobItems.forEach(i => noobIDs.push(i.itemID))

    noobIDs.forEach(i => {
      if (ownedItems.includes(i)) {
        obtainedNoob++
      }
    })

    //?=======Copper Case=======
    const copperItems = require("../../functions/getItems/data/copper.json")

    let copperIDs = []
    copperItems.forEach(i => copperIDs.push(i.itemID))

    copperIDs.forEach(i => {
      if (ownedItems.includes(i)) {
        obtainedCopper++
      }
    })

    //?=======Bronze Case=======
    const bronzeItems = require("../../functions/getItems/data/bronze.json")

    let bronzeIDs = []
    bronzeItems.forEach(i => bronzeIDs.push(i.itemID))

    bronzeIDs.forEach(i => {
      if (ownedItems.includes(i)) {
        obtainedBronze++
      }
    })

    //?=======Iron Case=======
    const ironItems = require("../../functions/getItems/data/iron.json")

    let ironIDs = []
    ironItems.forEach(i => ironIDs.push(i.itemID))

    ironIDs.forEach(i => {
      if (ownedItems.includes(i)) {
        obtainedIron++
      }
    })

    //?=======Silver Case=======
    const silverItems = require("../../functions/getItems/data/silver.json")

    let silverIDs = []
    silverItems.forEach(i => silverIDs.push(i.itemID))

    silverIDs.forEach(i => {
      if (ownedItems.includes(i)) {
        obtainedSilver++
      }
    })

    //?=======Gold Case=======
    const goldItems = require("../../functions/getItems/data/gold.json")

    let goldIDs = []
    goldItems.forEach(i => goldIDs.push(i.itemID))

    goldIDs.forEach(i => {
      if (ownedItems.includes(i)) {
        obtainedGold++
      }
    })

    //?=======Diamond Case=======
    const diamondItems = require("../../functions/getItems/data/diamond.json")

    let diamondIDs = []
    diamondItems.forEach(i => diamondIDs.push(i.itemID))

    diamondIDs.forEach(i => {
      if (ownedItems.includes(i)) {
        obtainedDiamond++
      }
    })

     //?=======Ruby Case=======
     const rubyItems = require("../../functions/getItems/data/ruby.json")

     let rubyIDs = []
     rubyItems.forEach(i => rubyIDs.push(i.itemID))
 
     rubyIDs.forEach(i => {
       if (ownedItems.includes(i)) {
         obtainedRuby++
       }
     })

     //?=======Emerald Case=======
     const emeraldItems = require("../../functions/getItems/data/emerald.json")

     let emeraldIDs = []
     emeraldItems.forEach(i => emeraldIDs.push(i.itemID))
 
     emeraldIDs.forEach(i => {
       if (ownedItems.includes(i)) {
         obtainedEmerald++
       }
     })

     //?=======Amethyst Case=======
     const amethystItems = require("../../functions/getItems/data/amethyst.json")

     let amethystIDs = []
     amethystItems.forEach(i => amethystIDs.push(i.itemID))
 
     amethystIDs.forEach(i => {
       if (ownedItems.includes(i)) {
         obtainedAmethyst++
       }
     })

    

    let TOTAL = noobIDs.length 
    + copperIDs.length 
    + bronzeIDs.length 
    + ironIDs.length 
    + silverIDs.length 
    + goldIDs.length 
    + diamondIDs.length
    + rubyIDs.length
    + emeraldIDs.length
    + amethystIDs.length

    //!================================================


    let totalOwnedItems = 0;

    p.inventory.forEach((i) => {
      totalOwnedItems = Math.floor(totalOwnedItems + Number(i.amount));
    });

    let emojis = {
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
      spooky: this.client.emojis.cache.get("762137404496019457")
  }

    let limiteds = p.inventory.filter((i) => i.limited).length;
    let EMBED = new MessageEmbed()
      .setAuthor(user.username, user.displayAvatarURL({ dynamic: true }))
      .setTitle(`__${user.username}'s profile__`)
      .setDescription(stripIndents`
    • Balance: **${p.balance < 1000 ? Math.floor(p.balance) : abbreviateNumber(p.balance, 2)}** ${moneyEmoji}
    • Value: **${p.value < 1000 ? Math.floor(p.value) : abbreviateNumber(p.value, 2)}** ${moneyEmoji}
    **-------------------------------------------**`)
      .addField(`• Owned Items`, `${totalOwnedItems}`, true)
      .addField(`• Unique Owned Items`, `${p.inventory.length}`, true)
      .addField(`• Limiteds`, `${limiteds}`, true)
      .addField(`• Inventory Size`, `${p.invSize}`, true)
      .addField(`• Selected Case`, `${p.defaultCrate.slice(0, 1).toUpperCase() + p.defaultCrate.slice(1, p.defaultCrate.length).toLowerCase()} ${emojis[p.defaultCrate]}`, true)
      .addField(`• Cases Opened`, `${p.casesOpened}`, true)
      .addField(`• Trades Enabled`, `${p.disableTrades ? "Yes" : `No`}`, true)
      .addField(`• Bonus Spins`, `${p.spins}`, true)
      .addField(`• Case Multiplier`, `${p.caseMultiplier}`, true)
      .addField(`\u200b`, `\u200b`, true)
      .addField(`\u200b`, `\u200b`, true)
      .addField(`- Completion Tracker`, `Total item count: **${TOTAL}**`)
      .addField(`• Noob ${emojis.noob}`, `${obtainedNoob}/${noobIDs.length}`, true)
      .addField(`• Copper ${emojis.copper}`, `${obtainedCopper}/${copperIDs.length}`, true)
      .addField(`• Bronze ${emojis.bronze}`, `${obtainedBronze}/${bronzeIDs.length}`, true)
      .addField(`• Iron ${emojis.iron}`, `${obtainedIron}/${ironIDs.length}`, true)
      .addField(`• Silver ${emojis.silver}`, `${obtainedSilver}/${silverIDs.length}`, true)
      .addField(`• Gold ${emojis.gold}`, `${obtainedGold}/${goldIDs.length}`, true)
      .addField(`• Diamond ${emojis.diamond}`, `${obtainedDiamond}/${diamondIDs.length}`, true)
      .addField(`• Ruby ${emojis.ruby}`, `${obtainedRuby}/${rubyIDs.length}`, true)
      .addField(`• Emerald ${emojis.emerald}`, `${obtainedEmerald}/${emeraldIDs.length}`, true)
      .addField(`• Amethyst ${emojis.amethyst}`, `${obtainedAmethyst}/${amethystIDs.length}`, true)
      .setColor("RANDOM")
      .setTimestamp()
      .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
    if (p.pumpkinBadge || p.betaTester || this.client.isOwner(user.id)) EMBED.addFields([
      { name: "\u200b", value: "\u200b" },
      { name: `• Badges`, value: `${vipEmoji} ${betaTesters.includes(msg.author.id) ? `${betaEmoji}` : ``} ${this.client.isOwner(user.id) ? this.client.emojis.cache.get("743658003001245736") : ``} ${isMod !== 0 ? this.client.emojis.cache.get("763584614237077524") : ``} ${p.pumpkinBadge ? PE : ""}`, inline: true }
    ])
    msg.say(EMBED).catch((err) => { });
  }
};
