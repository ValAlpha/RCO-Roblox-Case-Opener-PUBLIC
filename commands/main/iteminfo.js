const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")
const { stripIndents } = require("common-tags")


module.exports = class iteminfo extends Command {
    constructor(client) {
        super(client, {
            name: 'iteminfo',
            description: 'Get info on an item using its ID',
            group: 'main',
            memberName: 'iteminfo',
            aliases: ["ii"],
            throttling: {
                duration: 30,
                usages: 1
            },
            args: [{
                type: "string",
                prompt: "Which item (ID)",
                key: "query"
            }]
        })
    }

    async run(msg, { query }) {

        const getBasicInfo = async (query) => {
        
            let link = `https://api.roblox.com/Marketplace/ProductInfo?assetId=${query}`

        let res = await require("superagent").get(link).catch(() => null);
        if (!res) return

        let data = res.body
        return data
        }


        const getEcoInfo = async (ID) => {
            let link = `https://economy.roblox.com/v1/assets/${ID}/resale-data`

            let res = await require("superagent").get(link).catch(() => null);

            if (!res) return null;
            if (res.status !== 200) {
                console.log(`Got ${res.status} while looking up ${item.name}`);
                return null;
            }
            let data = res.body
            return data
        }

        let img = `https://www.roblox.com/asset-thumbnail/image?assetId=${query}&width=420&height=420&format=png`


        const ecoData = await getEcoInfo(query).catch(err => console.log(err))
        const basicData = await getBasicInfo(query).catch(err => console.log(err))


        if (!ecoData && !basicData)   return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Unable to find info for that item`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        

        let type

        switch (basicData.AssetTypeId || query) {
            case 8:
                type = 'hat'
                break;

            case 18:
                type = 'face'
                break;

            case 19:
                type = 'gear'
                break;

            case 32:
                type = 'package'
                break;

            case 41:
                type = 'hair accessory'
                break;

            case 42:
                type = 'face accessory'
                break;

            case 43:
                type = 'neck accessory'
                break;

            case 44:
                type = 'shoulder accessory'
                break;

            case 45:
                type = 'front accessory'
                break;

            case 46:
                type = 'back accessory'
                break;

            case 47:
                type = 'waist accessory'
                break;

            default: type = 'n/a'
                break;
        }


        if(ecoData){

            console.log(ecoData)

           return  msg.say(new MessageEmbed()
            .setAuthor(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))
            .setDescription(stripIndents`ITEM INFO

            • Item name: **${basicData.Name}**
            • Item ID: **${basicData.AssetId}**
            • Average Resale Price: **${ecoData.recentAveragePrice || `n/a`}**
            • Item Type: **${type}**
            • Created By: **${basicData.Creator.Name}**
            • Limited: ${basicData.IsLimited || basicData.IsLimitedUnique ? `🌟 **YES** 🌟` : `**NO**`}
            
            • Item description
            \`\`\`${basicData.Description}\`\`\`
            [Item Link](https://www.roblox.com/catalog/${query})`)
            .setThumbnail(img)
            .setColor("#FF0000")
            .setTimestamp())


        }else{

            return  msg.say(new MessageEmbed()
            .setAuthor(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))
            .setDescription(stripIndents`ITEM INFO

            • Item name: **${basicData.Name}**
            • Item ID: **${basicData.AssetId}**
            • Price: **${basicData.PriceInRobux || `n/a`}**
            • Item Type: **${type}**
            • Created By: **${basicData.Creator.Name}**
            • Limited: ${basicData.IsLimited || basicData.IsLimitedUnique ? `🌟 **YES** 🌟` : `**NO**`}
            
            • Item description
            \`\`\`${basicData.Description}\`\`\`
            [Item Link](https://www.roblox.com/catalog/${query})`)
            .setThumbnail(img)
            .setColor("#FF0000")
            .setTimestamp())

        }
        
    }
}