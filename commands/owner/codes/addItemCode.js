    const { Command } = require("discord.js-commando")
    const { MessageEmbed } = require("discord.js")


    module.exports = class additemcode extends Command {
        constructor(client) {
            super(client, {
                name: 'additemcode',
                description: 'Add an item code',
                group: 'owner',
                memberName: 'additemcode',
                ownerOnly: true,
                args: [{
                    type: "string",
                    prompt: "What's the code?",
                    key: "code",
                }, {
                    type: "string",
                    prompt: "What's the item ID?",
                    key: "itemID"
                }, {
                    type: "integer",
                    prompt: "How many?",
                    key: "amount",
                    min: 1,
                }]
            })
        }

        async run(msg, { code, itemID, amount }) {


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

            const ecoData = await getEcoInfo(itemID).catch(err => console.log(err))
            const basicData = await getBasicInfo(itemID).catch(err => console.log(err))


            if (!ecoData && !basicData)   return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`Unable to find info for that item`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

            let img = `https://www.roblox.com/asset-thumbnail/image?assetId=${itemID}&width=420&height=420&format=png`

            let type

            switch (basicData.AssetTypeId) {
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

            let itemName
            let itemWorth
            let totalValue
            let limited

            if(ecoData){
                itemName = basicData.Name
                itemWorth = ecoData.recentAveragePrice
                totalValue = ecoData.recentAveragePrice * amount
            }else{
                itemName = basicData.Name
                itemWorth = basicData.PriceInRobux
                totalValue = basicData.PriceInRobux * amount
            }

            const C = await this.client.dbs.codes.findOne({ dbID: this.client.user.id })

            if (!C) {
                new this.client.dbs.codes({
                    dbID: this.client.user.id,
                    codes: [{
                        code,
                        reward: amount,
                        type: "item",
                        item: {
                            name: itemName,
                            itemID,
                            amount,
                            itemWorth: itemWorth,
                            totalValue: totalValue,
                            itemType: type,
                            limited: basicData.IsLimited || basicData.IsLimitedUnique ? true : false,
                            locked: false
                        },
                        claimed: []
                    }]
                }).save()
                    .then(msg.say(new MessageEmbed()
                        .setDescription(`Code: ${code} for ${amount} x ${itemName} (${itemID}) worth ${totalValue} added!`)))
                    .catch(err => console.log(err))
            } else {
                C.codes.push({
                    code,
                    reward: amount,
                    type: "item",
                    item: {
                        name: itemName,
                        itemID,
                        amount,
                        itemWorth: itemWorth,
                        totalValue: totalValue,
                        itemType: type,
                        limited: basicData.IsLimited || basicData.IsLimitedUnique ? true : false,
                        locked: false
                    },
                    claimed: []
                })

                C.save()
                    .then(msg.say(new MessageEmbed()
                        .setDescription(`Code: ${code} for ${amount} x ${itemName} (${itemID}) worth ${totalValue} added!`)))
                    .catch(err => console.log(err))
            }

        }
    }
