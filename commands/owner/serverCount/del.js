const { Command } = require('discord.js-commando');
const { stat } = require('fs');
const { post, patch } = require("superagent");
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'del',
            memberName: 'del',
            aliases: [`dblu`],
            examples: [`${client.commandPrefix}del`],
            description: 'Posts the current stats to DBL',
            group: 'owner',
            ownerOnly: true,
            guildOnly: true
        })
    }
    async run(message) {
        let send = (content) => {
            return message.channel.send({
                embed: {
                    author: {
                        name: message.author.tag,
                        icon_url: message.author.displayAvatarURL({dynamic: true})
                    },
                    title: "INFO",
                    description: content,
                    color: message.member.displayColor,
                    timestamp: new Date()
                }
            })
        }
        const yes = "<a:tick:698540646033522698>",
              no = "<a:cross:698540645962481714>",
              status = (s) => s ? [200, 204].includes(s.status) ? yes : no : no;
        let rco = "688542620040953913";
        if (this.client.user.id !== rco) return send(`:x: You can't run this command on any other bot then RCO..`);

        const stats = await this.client.dbs.stats.findOne({dbID: this.client.user.id})
        let Ps = await this.client.dbs.profile.countDocuments()
        if(!stats){
            new this.client.dbs.stats({
                dbID: this.client.user.id, 
                servers: this.client.guilds.cache.size, 
                profiles: Ps
            }).save().catch(err => console.log(err))
        }else{
            stats.servers = this.client.guilds.cache.size
            stats.profiles = Ps;

            stats.save().catch(err => console.log(err))
        }

        // discordextremelist.xyz
        let del = await post(`https://api.discordextremelist.xyz/v2/bot/${rco}/stats`)
            .set(`Authorization`, process.env.DELKEY)
            .send({ "guildCount": this.client.guilds.cache.size })
            .catch(() => null);

        //top.gg
        let dbl = await post(`https://top.gg/api/bots/${rco}/stats`)
            .set(`Authorization`, process.env.DBLKEY)
            .send({ "server_count": this.client.guilds.cache.size })
            .catch(() => null);

        // discord.boats
        let boats = null;

        if(process.env.BOATSKEY) boats = await post(`https://discord.boats/api/bot/${rco}`)
            .set("Authorization", process.env.BOATSKEY)
            .send({"server_count": this.client.guilds.cache.size })
            .catch(() => null)

            
        //bots.gg

        let bgg = await post(`https://discord.bots.gg/api/v1/bots/${rco}/stats`)
        .set(`Authorization`, process.env.BGGKEY)
        .send({"guildCount": this.client.guilds.cache.size})
        .catch(() => null)

        //blist

        let blist = await patch(`https://blist.xyz/api/v2/bot/${this.client.user.id}/stats`)
        .send({"server_count": this.client.guilds.cache.size, "shard_count": 1})
        .set("Authorization", process.env.BLISTKEY)
        .catch(err => null)

        
        return send(`__Bot List Updater__
        \nDEL([Discord Extreme List](https://discordextremelist.xyz/bots/${rco})): ${status(del)}
        \nBoats([Discord Boats](https://discord.boats/bot/${rco})): ${status(boats)}
        \nBGG([Discord Bots](https://discord.bots.gg/bots/${rco})): ${status(bgg)}
        \nBLIST([BLIST](https://blist.xyz/bot/${rco})): ${status(blist)}
        \nTop.GG([topgg](https://top.gg/bot/${rco})) : ${status(dbl)}
        `)
    };

}
