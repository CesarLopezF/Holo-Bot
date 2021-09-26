const { RichEmbed } = require("discord.js");
const ytsr = require('ytsr')
const YTDL = require('ytdl-core');
module.exports = {
    name: "play",
    category: "music",
    description: "plays a video",
    usage: "play",
    run: async (client, message, args) => {
        if (message.member.voiceChannel)
        {
            mensaje = message.content.toString().split( "-play ");
            mensaje = mensaje[1];
            
            if(!mensaje){
                message.channel.send("Search for a youtube video!");
                return;
            }

            result = await ytsr(mensaje, {limit: 1}) 

            let youtube = result.items[0]

            Add(youtube.url, youtube.title, message.author.id, youtube.duration, youtube.bestThumbnail.url, message);

            if(!message.guild.voiceConnection)
            {
                message.member.voiceChannel.join()
                .then(connection=>{
                    Play(connection, message)
                })
            }
            
        } 
        else 
        {
            message.channel.send("You must be in a voice channel!");
            return;
        }
    }
}

async function Add(url, title, author, timestamp, thumbnail, message)
{
    var server = servers[message.guild.id];

    const embed = new RichEmbed()
        .setColor('#DD7F3F')
        .setTitle(`Added to the queue:`)
        .setDescription(`[${title}](${url}) [<@${author}>]`)
        .setFooter(`Duration: ${timestamp}`)

    const added = await message.channel.send(embed);
    
    server.queue.push(url);
    server.queueTitle.push(title);
    server.queueThumbnail.push(thumbnail);
    server.queueTime.push(timestamp);
    server.queueRequestor.push(author);
    server.queueAdded.push(added.id);
}

async function Play(connection, message)
{
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {highWaterMark: 1<<25}), {type: 'opus'}, {filter: "audioonly"});
    
    var embed = new RichEmbed()
            .setColor('#DD7F3F')
            .setTitle("Now playing:")
            .addField("Duration: " + server.queueTime[0], "[" + server.queueTitle[0] + "](" + server.queue[0] + ")")
            .setThumbnail(server.queueThumbnail[0])

    var lastmsg = await message.channel.send(embed);
    lastmsg = lastmsg.id;

    server.dispatcher.on("end", function()
    {
        message.channel.fetchMessage(lastmsg).then(async msg => {
            msg.delete();
        });
        message.channel.fetchMessage(server.queueAdded[0]).then(async msg =>{
            msg.delete();
        })

        server.queue.shift();
        server.queueTitle.shift();
        server.queueThumbnail.shift();
        server.queueTime.shift();
        server.queueRequestor.shift();
        server.queueAdded.shift();

        if(server.queue[0])
        {
            Play(connection, message);
        }
        else
        {
            message.channel.send("All music has been played. <:holoSleepy:612894366041899009>");
            connection.disconnect();
        }
    });
}