const { MessageEmbed } = require("discord.js");
const ytsr = require('ytsr')
const YTDL = require('ytdl-core');
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
            
            if(!mensaje){
                message.channel.send("Search for a youtube video!");
                return;
            }

            var filters = await ytsr.getFilters(mensaje);
            filter = filters.get('Type').get('Video')

            result = await ytsr(filter.url, {limit: 1}) 

            let youtube = result.items[0]

            Add(youtube.url, youtube.title, message.author.id, youtube.duration, youtube.bestThumbnail.url, youtube.author.name, youtube.author.url, message);
            
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
            
            server.queue.push(url);
            server.queueTitle.push(title);
            server.queueThumbnail.push(thumbnail);
            server.queueTime.push(timestamp);
            server.queueRequestor.push(author);
            server.queueAdded.push(added.id);
            server.queueAuthorName.push(ytAuthor);
            server.queueAuthorUrl.push(ytAuthorURL);

            

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
        .setDescription(`[${title}](${url}) [<@${author}>]`)
        .setFooter(`Duration: ${timestamp}`)

    const added = await message.channel.send(embed);
    
    server.queue.push(url);
    server.queueTitle.push(title);
    server.queueThumbnail.push(thumbnail);
    server.queueTime.push(timestamp);
    server.queueRequestor.push(author);
    server.queueAdded.push(added.id);
    server.queueAuthorName.push(ytAuthor);
    server.queueAuthorUrl.push(ytAuthorURL);

    

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

    server.dispatcher = connection.play(YTDL(server.queue[0], {highWaterMark: 1<<25}), {filter: "audioonly"});
    
    var embed = new MessageEmbed()
            .setColor('#DD7F3F')
            .setTitle("Now playing:")
            .addField("Duration: " + server.queueTime[0], "[" + server.queueTitle[0] + "](" + server.queue[0] + ")")
            .addField("Channel: ", "[" + server.queueAuthorName[0] + "]("+ server.queueAuthorUrl +")")
            .setThumbnail(server.queueThumbnail[0])

    var lastmsg = await message.channel.send(embed);
    lastmsg = lastmsg.id;

    server.dispatcher.on("finish", function()
    {
        message.channel.messages.fetch(lastmsg).then(async msg => {
            msg.delete();
        });
        message.channel.messages.fetch(server.queueAdded[0]).then(async msg =>{
            msg.delete();
        })

        server.queue.shift();
        server.queueTitle.shift();
        server.queueThumbnail.shift();
        server.queueTime.shift();
        server.queueRequestor.shift();
        server.queueAdded.shift();
        server.queueAuthorName.shift();
        server.queueAuthorUrl.shift();

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

    server.dispatcher.on('error', console.error);
}