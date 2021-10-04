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

            for (var i = 1; i < server.music.length; i++)
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
        message.channel.send(embed);
    }
}