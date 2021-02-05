const { Command } = require("discord.js-commando")
const { MessageEmbed } = require("discord.js")


module.exports = class btadd extends Command {
    constructor(client) {
        super(client, {
            name: 'btadd',
            description: 'Add a user to the beta tester collection',
            group: 'owner',
            memberName: 'btadd',
            ownerOnly: true,
            args: [{
                type: "user",
                prompt: "Which user to add",
                key: "toAdd"
            }]
        })
    }

    async run(msg, { toAdd }) {

        const BT = await this.client.dbs.betatesters.findOne({ dbID: this.client.user.id })

        const P = await this.client.dbs.profile.findOne({ id: toAdd.id })
        if (!P) return msg.say(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`This user needs to open a case to create their profile`)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))

        if (!BT) {
            new this.client.dbs.betatesters({
                dbID: this.client.user.id,
                testers: [{
                    userID: toAdd.id,
                    tag: toAdd.tag
                }]
            }).save()
                .then( msg.say(new MessageEmbed()
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`That user is now a beta tester`)
                    .setColor("RANDOM")
                    .setTimestamp()
                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))))
                .catch(err => console.log(err))
            P.betaTester = true
            P.save().catch(err => console.log(err))
        } else if (BT.testers.find(u => u.userID === toAdd.id)) {
              return msg.say(new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`This user is already a beta tester`)
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true})))
        } else {
            BT.testers.push({
                userID: toAdd.id,
                tag: toAdd.tag
            })

            P.betaTester = true
            P.save().catch(err => console.log(err))
            BT.save()
                .then(msg.say(new MessageEmbed()
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`That user is now a beta tester`)
                    .setColor("RANDOM")
                    .setTimestamp()
                    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))))
                .catch(err => console.log(err))
        }




    }
}