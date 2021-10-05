const ytsr = require('ytsr')
const { MessageEmbed } = require("discord.js");
const play = require("./play");
module.exports = {
    name: "search",
    category: "search",
    description: "searches a youtube video",
    usage: "search",
    run: async (client, message, args) => {

        mensaje = message.content.toString().split( "-search ");
        mensaje = mensaje[1];

        var filters = await ytsr.getFilters(mensaje);
        filter = filters.get('Type').get('Video')

        ytsr(filter.url, {limit: 5}).then(r => {

            let videos = r.items

            embed = new MessageEmbed()
                .setTitle("Here is what I found for: " + mensaje)
                .setColor('#DD7F3F')
                .setAuthor(message.author.username + ",", message.author.avatarURL())
            
            var i = 1

            videos.forEach(video => {
                embed.addField("Result "+i+": ","[" + video.title + "](" + video.url + ")");
                i++;
            })

            message.channel.send(embed).then(async msg => {
                msg.react("1️⃣")
                msg.react("2️⃣")
                msg.react("3️⃣")
                msg.react("4️⃣")
                msg.react("5️⃣")
                
                msg.awaitReactions((r,u) => ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣"] && u.id == message.author.id, {max: 1})
                    .then(async collected => {
                        const reaction = collected.first();
                        switch (reaction.emoji.name){
                            case "1️⃣": 
                                play.Add(videos[0].url,videos[0].title,message.author.id,videos[0].duration,videos[0].bestThumbnail.url,videos[0].author.name,videos[0].author.url, message)
                                break;
                            case "2️⃣": 
                                play.Add(videos[1].url,videos[1].title,message.author.id,videos[1].duration,videos[1].bestThumbnail.url,videos[1].author.name,videos[1].author.url, message)
                                break;
                            case "3️⃣": 
                                play.Add(videos[2].url,videos[2].title,message.author.id,videos[2].duration,videos[2].bestThumbnail.url,videos[2].author.name,videos[2].author.url, message)
                                break;
                            case "4️⃣": 
                                play.Add(videos[3].url,videos[3].title,message.author.id,videos[3].duration,videos[3].bestThumbnail.url,videos[3].author.name,videos[3].author.url, message)
                                break;
                            case "5️⃣": 
                                play.Add(videos[4].url,videos[4].title,message.author.id,videos[4].duration,videos[4].bestThumbnail.url,videos[4].author.name,videos[4].author.url, message)
                                break;
                        }
                    })

            });
        })
    }
}