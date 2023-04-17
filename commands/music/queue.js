const { shuffle } = require('./shuffle');
const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
module.exports = {
    name: "queue",
    aliases: ["q"],
    category: "music",
    description: "send a list of queued videos",
    usage: "queue",
    run: async (client, interaction, args) => {
        var server = servers[interaction.guild.id];

        var embed = new EmbedBuilder()
            .setColor('#DD7F3F')
            .setAuthor({name: interaction.member.user.username + ",", iconURL: interaction.member.user.avatarURL()})
            
        if (server.music.length > 0)
        {

            var button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('left')
                    .setLabel('<-')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('right')
                    .setLabel('->')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('shuffle')
                    .setLabel('Shuffle')
                    .setStyle(ButtonStyle.Success)
            )

            embed = new EmbedBuilder(embed)
                .setTitle("All videos in queue:")
                .setThumbnail("https://cdn.discordapp.com/emojis/712807334253953094.gif")
                .addFields({ name: "Now playing ---- Duration: " + server.music[0].timestamp, value: "[" + server.music[0].title + "](" + server.music[0].url + ") ---- [<@" + server.music[0].author + ">]"});

            var length = 6

            if(server.music.length <= 5){
                length = server.music.length
            }

            for (var i = 1; i < length; i++)
            {
                embed = new EmbedBuilder(embed)
                    .addFields({ name: i + ") ---- Duration: " + server.music[i].timestamp, value: "[" + server.music[i].title + "](" + server.music[i].url + ") ---- [<@" + server.music[i].author + ">]"});
            }
        } 
        else 
        {
            embed = new EmbedBuilder(embed)
                .setDescription("There is nothing in queue...")
                .setThumbnail("https://cdn.discordapp.com/emojis/712832917835087882.gif")
        }

        if(server.music.length > 6){
            var i = 0;

            interaction.reply({embeds:[embed], components:[button]})

            const filter = inter => inter.customId === 'left' || inter.customId === 'right' || inter.customId === 'shuffle' && inter.user.id == interaction.member.user.id

            const collector = interaction.channel.createMessageComponentCollector({filter, time: 100000 })
            collector.on("collect", async inter => {

                if(inter.customId === 'left')
                {
                    i-=6

                } 
                else if(inter.customId === 'right')
                {
                    i+=6

                } 
                else if (inter.customId === 'shuffle')
                {
                    var first = server.music[0];

                    server.music.shift();

                    server.music.sort(song => Math.random() - 0.5);

                    server.music.unshift(first);

                    console.log(`${interaction.user.username} has shuffled the queue`)
                }

                if(i <= 0){
                    i=0
                }

                if((i+6) > server.music.length){
                    i = server.music.length-6
                }

                var editedEmbed = new EmbedBuilder()
                    .setColor('#DD7F3F')
                    .setAuthor({name: interaction.member.user.username + ",", value: interaction.member.user.avatarURL()})
                    .setTitle("All videos in queue:")
                    .setThumbnail("https://cdn.discordapp.com/emojis/712807334253953094.gif")

                if(!server.music.length){
                    editedEmbed = new EmbedBuilder()
                        .setDescription("There is nothing in queue...")
                        .setThumbnail("https://cdn.discordapp.com/emojis/712832917835087882.gif")
                } else {
                    for (var j=i; j < i+6; j++)
                    {
                        if(j==0){
                            editedEmbed = new EmbedBuilder(editedEmbed)
                            .addFields({ name: "Now playing ---- Duration: " + server.music[j].timestamp, value: "[" + server.music[j].title + "](" + server.music[j].url + ") ---- [<@" + server.music[j].author + ">]"});
                        } else {
                            editedEmbed = new EmbedBuilder(editedEmbed)
                            .addFields({ name: j + ") ---- Duration: " + server.music[j].timestamp, value: "[" + server.music[j].title + "](" + server.music[j].url + ") ---- [<@" + server.music[j].author + ">]"});
                        }
                    }
                }

                await inter.update({embeds:[editedEmbed], components:[button]});
            })
            
        } else {
            interaction.reply({embeds:[embed]})
        }
    }

    
}