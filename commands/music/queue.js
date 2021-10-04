const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "queue",
    aliases: ["q"],
    category: "music",
    description: "send a list of queued videos",
    usage: "queue",
    run: async (client, message, args) => {
        var server = servers[message.guild.id];

        var embed = new MessageEmbed()
            .setColor('#DD7F3F')
            .setAuthor(message.author.username + ",", message.author.displayAvatarURL)
            
        if (server.music.length > 0)
        {
            embed = new MessageEmbed(embed)
                .setTitle("All music in queue:")
                .setThumbnail("https://cdn.discordapp.com/emojis/712807334253953094.gif")
                .addField("Now playing ---- Duration: " + server.music[0].timestamp, "[" + server.music[0].title + "](" + server.music[0].url + ") ---- [<@" + 
                server.music[0].author + ">]");

            var length = 6

            if(server.music.length < 5){
                length = server.music.length
            }

            for (var i = 1; i < length; i++)
            {
                embed = new MessageEmbed(embed)
                    .addField("Song " + i + ") ---- Duration: " + server.music[i].timestamp, "[" + server.music[i].title + "](" + server.music[i].url + ") ---- [<@" + 
                    server.music[i].author + ">]");
            }
        } 
        else 
        {
            embed = new MessageEmbed(embed)
                .setDescription("There is no music in queue...")
                .setThumbnail("https://cdn.discordapp.com/emojis/712832917835087882.gif")
        }

        if(server.music.length > 6){
            var i = 0;

            message.channel.send(embed).then(async msg => {
                msg.react("⬅️")
                msg.react("➡️")

                const filter = (reaction, user) => reaction.emoji.name == '⬅️' || reaction.emoji.name == '➡️' && user.id == message.author.id

                const collector = msg.createReactionCollector(filter, { time: 100000 })
                collector.on("collect", r => {

                    if(r.emoji.name == '⬅️'){
                        i-=6
                    } else if(r.emoji.name == '➡️'){
                        i+=6
                    }

                    if(i <= 0){
                        i=0;
                    }

                    if((i+6) > server.music.length){
                        i = server.music.length-6
                    }

                    var editedEmbed = new MessageEmbed()
                        .setColor('#DD7F3F')
                        .setAuthor(message.author.username + ",", message.author.displayAvatarURL)
                        .setTitle("All music in queue:")
                        .setThumbnail("https://cdn.discordapp.com/emojis/712807334253953094.gif")

                    for (var j=i; j < i+6; j++)
                    {
                        if(j==0){
                            editedEmbed = new MessageEmbed(editedEmbed)
                            .addField("Now playing ---- Duration: " + server.music[j].timestamp, "[" + server.music[j].title + "](" + server.music[j].url + ") ---- [<@" + 
                            server.music[j].author + ">]");
                        } else {
                            editedEmbed = new MessageEmbed(editedEmbed)
                            .addField("Song " + j + ") ---- Duration: " + server.music[j].timestamp, "[" + server.music[j].title + "](" + server.music[j].url + ") ---- [<@" + 
                            server.music[j].author + ">]");
                        }
                    }

                    msg.edit(editedEmbed);
                })
            });
        } else {
            message.channel.send(embed)
        }
    }
}