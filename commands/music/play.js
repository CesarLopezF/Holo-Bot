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
            } else if(mensaje.includes("youtube.com/watch?"))
            {
                ytdl.getBasicInfo(mensaje).then(result => {
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
    
                    Add(info.video_url, info.title, message.author.id, ret, info.thumbnails[info.thumbnails.length-1].url, info.author.name, info.author.user_url, message, live)
                })

            } else 
            {
                var filters = await ytsr.getFilters(mensaje);
                filter = filters.get('Type').get('Video')
    
                result = await ytsr(filter.url, {limit: 1}) 
    
                let youtube = result.items[0]

                if(!youtube.duration){
                    var duration = "LIVE"
                    var live = true;
                } else {
                    var duration = youtube.duration
                }
    
                Add(youtube.url, youtube.title, message.author.id, duration, youtube.bestThumbnail.url, youtube.author.name, youtube.author.url, message, live);
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
                .addField("Song: ", `[${title}](${url}) [<@${author}>]`)
                .addField("Channel: ", "[" + ytAuthor + "]("+ ytAuthorURL +")")
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

async function Add(url, title, author, timestamp, thumbnail, ytAuthor, ytAuthorURL, message, live)
{
    var server = servers[message.guild.id];

    const embed = new MessageEmbed()
        .setColor('#DD7F3F')
        .setTitle(`Added to the queue:`)
        .addField("Song: ", `[${title}](${url}) [<@${author}>]`)
        .addField("Channel: ", "[" + ytAuthor + "]("+ ytAuthorURL +")")
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
            Play(connection, message, live)
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

async function Play(connection, message, live)
{
    var server = servers[message.guild.id];

    if(live)
    {
        var options = {highWaterMark: 1<<25}
    }   
    else 
    {
        var options = {highWaterMark: 1<<25, filter: "audioonly"}
    }

    server.dispatcher = connection.play(ytdl(server.music[0].url, options));
    
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
            if(server.music[0].timestamp == "LIVE"){
                var live = true;
                Play(connection, message, live);
            } else {
                Play(connection, message);
            }
        }
        else
        {
            message.channel.send("All music has been played. <:holoSleepy:612894366041899009>");
            connection.disconnect();
        }
    });

    server.dispatcher.on('error', console.error);
}