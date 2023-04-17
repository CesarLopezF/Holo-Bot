const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, Events} = require("discord.js");
const { joinVoiceChannel , createAudioPlayer , createAudioResource, AudioPlayerStatus} = require('@discordjs/voice')
const ytsr = require('ytsr')
const ytdl = require('ytdl-core');
const ytpl = require('ytpl');

var timeout;

module.exports = {
    name: "play",
    category: "music",
    description: "plays a video",
    usage: "play",
    run: async (client, interaction, args) => {

        if (interaction.member.voice.channel.id)
        {
            
            if(!args)
            {
                interaction.reply("Search for a youtube video!");
                return;
            }

            clearTimeout(timeout);

            if(args.includes("list="))
            {
                ytpl(args).then(async result => {

                    const embed = new EmbedBuilder()
                        .setColor('#DD7F3F')
                        .setTitle(`Added videos from the playlist: ${result.title}`)
                        .setDescription(`${result.estimatedItemCount} videos added`)
                        .setThumbnail(result.bestThumbnail.url)
    
                    await interaction.reply({embeds:[embed]});

                    var firstSong;

                    if(args.includes("watch?")){

                        firstSong = args.split("&list=")[0]

                        await ytdl.getBasicInfo(firstSong).then(async result => {
                            var info = result.videoDetails
        
                            if(info.lengthSeconds == 0){
                                var ret = "LIVE"
                                var live = true
                            } else {
                                var hrs = ~~(info.lengthSeconds / 3600);
                                var mins = ~~((info.lengthSeconds % 3600) / 60);
                                var secs = ~~info.lengthSeconds % 60;
            
                                // Output like "1:01" or "4:03:59" or "123:03:59"
                                var ret = "";
                                if (hrs > 0) {
                                    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
                                }
                                ret += "" + mins + ":" + (secs < 10 ? "0" : "");
                                ret += "" + secs;
                            }
            
                            Add(info.video_url, info.title, interaction.user.id, ret, info.thumbnails[info.thumbnails.length-1].url, info.author.name, info.author.user_url, interaction, client, live)
                        })
                    }
    
                    result.items.forEach(song => {
                        if(song.url.includes(firstSong)){
                        } else {
                            Add(song.url, song.title, interaction.user.id, song.duration, song.bestThumbnail.url, song.author.name, song.author.url, interaction, client)
                        }
                    })
                })
            } else if(args.includes("youtube.com/watch?"))
            {
                ytdl.getBasicInfo(args).then(async result => {
                    var info = result.videoDetails

                    if(info.lengthSeconds == 0){
                        var ret = "LIVE"
                        var live = true
                    } else {
                        var hrs = ~~(info.lengthSeconds / 3600);
                        var mins = ~~((info.lengthSeconds % 3600) / 60);
                        var secs = ~~info.lengthSeconds % 60;
    
                        // Output like "1:01" or "4:03:59" or "123:03:59"
                        var ret = "";
                        if (hrs > 0) {
                            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
                        }
                        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
                        ret += "" + secs;
                    }
                    
                    const embed = new EmbedBuilder()
                        .setColor('#DD7F3F')
                        .setTitle(`Added to the queue:`)
                        .addFields({name: "Video: ", value: `[${info.title}](${info.video_url}) [<@${interaction.user.id}>]`})
                        .addFields({name: "Channel: ", value: "[" + info.author.name + "]("+ info.author.user_url +")"})
                        .setThumbnail(info.thumbnails[info.thumbnails.length-1].url)
                        .setFooter({text: `Duration: ${ret}`})

                    await interaction.reply({embeds:[embed]});
    
                    Add(info.video_url, info.title, interaction.user.id, ret, info.thumbnails[info.thumbnails.length-1].url, info.author.name, info.author.user_url, interaction, client, live)
                })

            } else 
            {
                var filters = await ytsr.getFilters(args);
                filter = filters.get('Type').get('Video')
    
                result = await ytsr(filter.url, {limit: 1}) 
    
                let youtube = result.items[0]

                if(!youtube.duration){
                    var duration = "LIVE"
                    var live = true;
                } else {
                    var duration = youtube.duration
                }

                const embed = new EmbedBuilder()
                    .setColor('#DD7F3F')
                    .setTitle(`Added to the queue:`)
                    .addFields({name: "Video: ", value: `[${youtube.title}](${youtube.url}) [<@${interaction.user.id}>]`})
                    .addFields({name: "Channel: ", value: "[" + youtube.author.name + "]("+ youtube.author.url +")"})
                    .setThumbnail(youtube.bestThumbnail.url)
                    .setFooter({text:`Duration: ${youtube.duration}`})

                await interaction.reply({embeds:[embed]});
    
                Add(youtube.url, youtube.title, interaction.user.id, duration, youtube.bestThumbnail.url, youtube.author.name, youtube.author.url, interaction, client, live);
            }
            
        } 
        else 
        {
            interaction.reply("You must be in a voice channel!");
            return;
        }
    },
    Add: async (url, title, author, timestamp, thumbnail, ytAuthor, ytAuthorURL, interaction, client) => {
        if (interaction.member.voice.channel)
        {
            var server = servers[interaction.guild.id];

            const embed = new EmbedBuilder()
                .setColor('#DD7F3F')
                .setTitle(`Added to the queue:`)
                .addFields({ name: "Video: ", value: `[${title}](${url}) [<@${author}>]` })
                .addFields({ name: "Channel: ", value: "[" + ytAuthor + "]("+ ytAuthorURL +")" })
                .setThumbnail(thumbnail)
                .setFooter({ text: `Duration: ${timestamp}` })

            const added = await interaction.channel.send({embeds:[embed]});
            
            if(!server.music[0]){

                server.music.push({
                    url: url,
                    title: title,
                    thumbnail: thumbnail,
                    timestamp: timestamp,
                    author: author,
                    added: added.id,
                    authorName:ytAuthor,
                    authorUrl: ytAuthorURL,
                })

                const connection = joinVoiceChannel({
                    channelId: interaction.member.voice.channel.id,
                    guildId: interaction.guildId,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                });
        
                const player = createAudioPlayer();
        
                Play(connection, player, interaction, client)
                
            } else {
                server.music.push({
                    url: url,
                    title: title,
                    thumbnail: thumbnail,
                    timestamp: timestamp,
                    author: author,
                    added: added.id,
                    authorName:ytAuthor,
                    authorUrl: ytAuthorURL,
                })
            }

            console.log(`${interaction.user.username} has added the song ${title} to the queue`)
            
        }else 
        {
            interaction.reply("You must be in a voice channel!");
            return;
        }
    }
}

async function Add(url, title, author, timestamp, thumbnail, ytAuthor, ytAuthorURL, interaction, client, live)
{
    var server = servers[interaction.guild.id];

    if(!server.music[0]){

        server.music.push({
            url: url,
            title: title,
            thumbnail: thumbnail,
            timestamp: timestamp,
            author: author,
            authorName:ytAuthor,
            authorUrl: ytAuthorURL,
        })

        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();

        Play(connection, player, interaction, client, live)

    } else {

        server.music.push({
            url: url,
            title: title,
            thumbnail: thumbnail,
            timestamp: timestamp,
            author: author,
            authorName:ytAuthor,
            authorUrl: ytAuthorURL,
        })

    }

    console.log(`${interaction.user.username} has added the song ${title} to the queue`)
}

async function Play(connection, player, interaction, client, live)
{

    var server = servers[interaction.guild.id];

    if(live)
    {
        var options = {highWaterMark: 1<<25}
    }   
    else 
    {
        var options = {highWaterMark: 1<<25, filter: "audioonly"}
    }

    server.player = player
    server.connection = connection

    server.player.play(createAudioResource(ytdl(server.music[0].url, options)));
    server.connectionSub = connection.subscribe(server.player)

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

    latestmsg = await interaction.channel.send({embeds: [embed], components: [buttons]});
    server.latestmsg = latestmsg

    console.log(`Now playing ${server.music[0].title}`)

    server.player.on(AudioPlayerStatus.Idle, async () =>
    {

        client.channels.fetch(interaction.channel.id).then(channel => {
            channel.messages.delete(latestmsg.id)
        })

        console.log(`Song ${server.music[0].title} has finished playing`)

        server.music.shift()
        
        if(server.music[0])
        {

            if(server.music[0].timestamp == "LIVE"){
                var options = {highWaterMark: 1<<25}
            } else {
                var options = {highWaterMark: 1<<25, filter: "audioonly"}
            }

            var embed = new EmbedBuilder()
                .setColor('#DD7F3F')
                .setTitle("Now playing:")
                .addFields({name: "Video: ", value: "[" + server.music[0].title + "](" + server.music[0].url + ")"})
                .addFields({name: "Channel: ", value: "[" + server.music[0].authorName + "]("+ server.music[0].authorUrl +")"})
                .setThumbnail(server.music[0].thumbnail)
                .setFooter({text: "Duration: " + server.music[0].timestamp})

            latestmsg = await interaction.channel.send({embeds: [embed], components: [buttons]});
            server.latestmsg = latestmsg

            console.log(`Now playing ${server.music[0].title}`)

            server.player.play(createAudioResource(ytdl(server.music[0].url, options)));

        } else {

            timeout = setTimeout(async () => {

                connection.disconnect();

                var embed = new EmbedBuilder()
                    .setColor('#DD7F3F')
                    .setTitle("Queue finished:")
                    .setDescription('No more songs to play! Disconnecting')

                await interaction.channel.send({embeds:[embed]});

                console.log(`No more songs to play. Disconnecting from Voice Channel`)

            }, 600000);

        }

    });

    server.player.on('error', error => {
        console.error(`Error: ${error.message} with resource ${server.music[0].title}`)
    });

    client.on(Events.InteractionCreate, async inter => {
        if (!inter.isButton()) return;

        if(inter.customId == 'pause'){
            server.player.pause()
            console.log(`${inter.user.username} has paused the queue`);

            buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('resume')
                        .setLabel('Resume')
                        .setStyle(ButtonStyle.Success),
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
                .setAuthor({name: `Paused by ${inter.user.username}` , iconURL: inter.user.avatarURL()})
                .addFields({name: "Video: ", value: "[" + server.music[0].title + "](" + server.music[0].url + ")"})
                .addFields({name: "Channel: ", value: "[" + server.music[0].authorName + "]("+ server.music[0].authorUrl +")"})
                .setThumbnail(server.music[0].thumbnail)
                .setFooter({text: "Duration: " + server.music[0].timestamp})

            inter.update({embeds: [embed], components: [buttons]})
        }
        else if(inter.customId == 'resume'){
            server.player.unpause()
            console.log(`${inter.user.username} has resumed the queue`);
            buttons = new ActionRowBuilder()
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
                .setAuthor({name: `Resumed by ${inter.user.username}` , iconURL: inter.user.avatarURL()})
                .addFields({name: "Video: ", value: "[" + server.music[0].title + "](" + server.music[0].url + ")"})
                .addFields({name: "Channel: ", value: "[" + server.music[0].authorName + "]("+ server.music[0].authorUrl +")"})
                .setThumbnail(server.music[0].thumbnail)
                .setFooter({text: "Duration: " + server.music[0].timestamp})

            inter.update({embeds: [embed], components: [buttons]})
        }
        else if(inter.customId == 'skip'){
            console.log(`${inter.user.username} has skipped ${server.music[0].title}`)
            server.music.shift()

            if(!server.music[0]) 
            {

                var embed = new EmbedBuilder()
                    .setColor('#DD7F3F')
                    .setTitle("Queue finished:")
                    .setDescription('No more songs to play! Disconnecting')

                await inter.update({embeds:[embed], components: []});
                server.connection.destroy();
                return
            }

            
            await inter.update(`The song has been skipped`)

            client.channels.fetch(interaction.channel.id).then(channel => {
                channel.messages.delete(latestmsg.id)
            })
            

            var embed = new EmbedBuilder()
                .setColor('#DD7F3F')
                .setTitle("Now playing:")
                .addFields({name: "Video: ", value: "[" + server.music[0].title + "](" + server.music[0].url + ")"})
                .addFields({name: "Channel: ", value: "[" + server.music[0].authorName + "]("+ server.music[0].authorUrl +")"})
                .setThumbnail(server.music[0].thumbnail)
                .setFooter({text: "Duration: " + server.music[0].timestamp})

            latestmsg = await inter.channel.send({embeds: [embed], components: [buttons]});
            server.latestmsg = latestmsg

            server.player.play(createAudioResource(ytdl(server.music[0].url, options)));

            console.log(`Now playing ${server.music[0].title}`)
            
        }
        else if(inter.customId == 'stop'){

            server.music = [];
            server.connection.destroy();
            console.log(`${inter.user.username} has stopped the queue`);

            
            await inter.update(`The queue has been stopped`)

            client.channels.fetch(interaction.channel.id).then(channel => {
                channel.messages.delete(latestmsg.id)
            })
        

            var embed = new EmbedBuilder()
                .setColor('#DD7F3F')
                .setAuthor({name: `Stopped by ${inter.user.username}` , iconURL: inter.user.avatarURL()})
                .setTitle("Queue finished:")
                .setDescription('No more songs to play! Disconnecting')

            await inter.channel.send({embeds:[embed]});
            
        }

    });
}