const { MessageEmbed } = require("discord.js");
const ytsr = require('ytsr')
const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
module.exports = {
    name: "play",
    category: "music",
    description: "plays a video",
    usage: "play",
    run: async (client, message, args) => {

        if (message.member.voice.channel)
        {
            mensaje = message.content.toString().split( "-play ");
            mensaje = mensaje[1];
            
            if(!mensaje)
            {
                message.channel.send("Search for a youtube video!");
                return;
            }

            if(mensaje.includes("list="))
            {
                ytpl(mensaje).then(async result => {
                    const embed = new MessageEmbed()
                        .setColor('#DD7F3F')
                        .setTitle(`Added songs from the playlist: ${result.title}`)
                        .setDescription(`${result.estimatedItemCount} songs added`)
                        .setThumbnail(result.bestThumbnail.url)
    
                    await message.channel.send(embed);
    
                    result.items.forEach(song => {
                        AddPlayList(song.url, song.title, message.author.id, song.duration, song.bestThumbnail.url, song.author.name, song.author.url, message)
                    })
                })
            } else 
            {
                var filters = await ytsr.getFilters(mensaje);
                filter = filters.get('Type').get('Video')
    
                result = await ytsr(filter.url, {limit: 1}) 
    
                let youtube = result.items[0]
    
                Add(youtube.url, youtube.title, message.author.id, youtube.duration, youtube.bestThumbnail.url, youtube.author.name, youtube.author.url, message);
            }
            
        } 
        else 
        {
            message.channel.send("You must be in a voice channel!");
            return;
        }
    },
    Add: async (url, title, author, timestamp, thumbnail, ytAuthor, ytAuthorURL, message) => {
        if (message.member.voice.channel)
        {
            var server = servers[message.guild.id];

            const embed = new MessageEmbed()
                .setColor('#DD7F3F')
                .setTitle(`Added to the queue:`)
                .setDescription(`[${title}](${url}) [<@${author}>]`)
                .setFooter(`Duration: ${timestamp}`)

            const added = await message.channel.send(embed);
            
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

            if(!message.guild.me.voice.connection){
                message.member.voice.channel.join()
                .then(connection=>{
                    Play(connection, message)
                })
            }
        }else 
        {
            message.channel.send("You must be in a voice channel!");
            return;
        }
    }
}

async function Add(url, title, author, timestamp, thumbnail, ytAuthor, ytAuthorURL, message)
{
    var server = servers[message.guild.id];

    const embed = new MessageEmbed()
        .setColor('#DD7F3F')
        .setTitle(`Added to the queue:`)
        .addField("Song: ", `[${title}](${url}) [<@${author}>]`)
        .addField("Channel: ", "[" + ytAuthor + "]("+ ytAuthorURL +")")
        .setFooter(`Duration: ${timestamp}`)
        .setThumbnail(thumbnail)

    const added = await message.channel.send(embed);

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

    if(!message.guild.me.voice.connection){
        message.member.voice.channel.join()
        .then(connection=>{
            Play(connection, message)
        })
    }
}

async function AddPlayList(url, title, author, timestamp, thumbnail, ytAuthor, ytAuthorURL, message)
{
    var server = servers[message.guild.id];

    server.music.push({
        url: url,
        title: title,
        thumbnail: thumbnail,
        timestamp: timestamp,
        author: author,
        added: null,
        authorName:ytAuthor,
        authorUrl: ytAuthorURL,
    })

    if(!message.guild.me.voice.connection){
        message.member.voice.channel.join()
        .then(connection=>{
            Play(connection, message)
        })
    }
}

async function Play(connection, message)
{
    var server = servers[message.guild.id];

    server.dispatcher = connection.play(ytdl(server.music[0].url, {highWaterMark: 1<<25, filter: "audioonly"}));
    
    var embed = new MessageEmbed()
            .setColor('#DD7F3F')
            .setTitle("Now playing:")
            .addField("Duration: " + server.music[0].timestamp, "[" + server.music[0].title + "](" + server.music[0].url + ")")
            .addField("Channel: ", "[" + server.music[0].authorName + "]("+ server.music[0].authorUrl +")")
            .setThumbnail(server.music[0].thumbnail)

    var lastmsg = await message.channel.send(embed);
    lastmsg = lastmsg.id;

    server.dispatcher.on("finish", function()
    {
        message.channel.messages.fetch(lastmsg).then(async msg => {
            msg.delete();
        });
        if(server.music[0].added){
            message.channel.messages.fetch(server.music[0].added).then(async msg =>{
                msg.delete();
            })
        }

        server.music.shift()

        if(server.music[0])
        {
            Play(connection, message);
        }
        else
        {
            message.channel.send("All music has been played. <:holoSleepy:612894366041899009>");
            connection.disconnect();
        }
    });

    server.dispatcher.on('error', console.error);
}