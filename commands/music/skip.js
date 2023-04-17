const { joinVoiceChannel , createAudioPlayer , createAudioResource, AudioPlayerStatus } = require('@discordjs/voice')
const { EmbedBuilder } = require("discord.js");
const ytdl = require('ytdl-core');

module.exports = {
    name: "skip",
    category: "help",
    description: "skips the current video",
    usage: "skip",
    run: async (client, interaction, args) => {

        var server = servers[interaction.guild.id];

        if (!interaction.member.voice.channel.id)
        {
            interaction.reply("What are you trying to do? I am not even in a voice channel... <:holoLaugh:712812696772411403>");
        }
        else if(server.player && interaction.member.voice.channel.id && server.music[1])
        {
            latestmsg = server.latestmsg
            interaction.reply(`Skipped **${server.music[0].title}**`);
            console.log(`${interaction.user.username} has skipped ${server.music[0].title}`)
            server.music.shift()

            client.channels.fetch(interaction.channel.id).then(channel => {
                channel.messages.delete(latestmsg.id)
            })

            var buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('pause')
                    .setLabel('Pause')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('skip')
                    .setLabel('Skip')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('stop')
                    .setLabel('Stop')
                    .setStyle(ButtonStyle.Danger),
            )

            var embed = new EmbedBuilder()
                .setColor('#DD7F3F')
                .setTitle("Now playing:")
                .addFields({name: "Video: ", value: "[" + server.music[0].title + "](" + server.music[0].url + ")"})
                .addFields({name: "Channel: ", value: "[" + server.music[0].authorName + "]("+ server.music[0].authorUrl +")"})
                .setThumbnail(server.music[0].thumbnail)
                .setFooter({text: "Duration: " + server.music[0].timestamp})

            await interaction.channel.send({embeds:[embed], components: [buttons]});

            console.log(`Now playing ${server.music[0].title}`)

            var options = {highWaterMark: 1<<25, filter: "audioonly"}

            server.player.play(createAudioResource(ytdl(server.music[0].url, options)));
        }
        else {

            interaction.reply(`Sorry ${interaction.user.username} there are no more songs in queue... <:holoSad:613567137801437215>`);

            console.log(`${interaction.user.username} has stopped the queue`);

            server.connection.destroy();
        }
    } 
}