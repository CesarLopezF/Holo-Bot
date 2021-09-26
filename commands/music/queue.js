const { RichEmbed } = require("discord.js");
module.exports = {
    name: "queue",
    aliases: ["q"],
    category: "music",
    description: "send a list of queued videos",
    usage: "queue",
    run: async (client, message, args) => {
        var server = servers[message.guild.id];

        var embed = new RichEmbed()
            .setColor('#DD7F3F')
            .setAuthor(message.author.username + ",", message.author.displayAvatarURL)
            
        if (server.queueTitle.length > 0)
        {
            embed = new RichEmbed(embed)
                .setTitle("All music in queue:")
                .setThumbnail("https://cdn.discordapp.com/emojis/712807334253953094.gif")
                .addField("Now playing ---- Duration: " + server.queueTime[0], "[" + server.queueTitle[0] + "](" + server.queue[0] + ") ---- [<@" + 
                server.queueRequestor[0] + ">]");

            for (var i = 1; i < server.queueTitle.length; i++)
            {
                embed = new RichEmbed(embed)
                    .addField("Song " + i + ") ---- Duration: " + server.queueTime[i], "[" + server.queueTitle[i] + "](" + server.queue[i] + ") ---- [<@" + 
                    server.queueRequestor[i] + ">]");
            }
        } 
        else 
        {
            embed = new RichEmbed(embed)
                .setDescription("There is no music in queue...")
                .setThumbnail("https://cdn.discordapp.com/emojis/712832917835087882.gif")
        }
        message.channel.send(embed);
    }
}